import Stripe from "npm:stripe@14";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function setStatus(
  userId: string,
  fields: Record<string, string | null>
) {
  await supabase
    .from("profiles")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", userId);
}

/** Resolve the profile for a subscription: metadata first, customer id fallback. */
async function userIdForSubscription(sub: Stripe.Subscription): Promise<string | null> {
  if (sub.metadata?.supabase_user_id) return sub.metadata.supabase_user_id;
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", sub.customer as string)
    .single();
  return data?.id ?? null;
}

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch {
    return new Response("Webhook signature invalid", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.supabase_user_id;
    if (userId) {
      await setStatus(userId, {
        subscription_status: "active",
        subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
      });
    }
  }

  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.paused"
  ) {
    const sub = event.data.object as Stripe.Subscription;
    const userId = await userIdForSubscription(sub);
    if (userId) await setStatus(userId, { subscription_status: "canceled" });
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const userId = await userIdForSubscription(sub);
    if (userId) {
      const active = sub.status === "active" || sub.status === "trialing";
      await setStatus(userId, {
        subscription_status: active ? "active" : "canceled",
        subscription_id: sub.id,
      });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
