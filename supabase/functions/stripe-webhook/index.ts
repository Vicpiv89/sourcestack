import Stripe from "npm:stripe@14";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature")!;
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

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.supabase_user_id;

  if (event.type === "checkout.session.completed" && userId) {
    await supabase
      .from("profiles")
      .update({
        subscription_status: "active",
        subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  }

  if (
    (event.type === "customer.subscription.deleted" ||
      event.type === "customer.subscription.paused") &&
    userId
  ) {
    await supabase
      .from("profiles")
      .update({
        subscription_status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
