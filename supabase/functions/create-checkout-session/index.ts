import Stripe from "npm:stripe@14";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

function corsFor(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  const allowed = [Deno.env.get("SITE_URL"), "https://sourcestack.onrender.com", "http://localhost:5173", "http://localhost:5174"];
  return {
    "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : Deno.env.get("SITE_URL") ?? "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

Deno.serve(async (req) => {
  const corsHeaders = corsFor(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Identity comes from the verified JWT, never from the request body —
    // otherwise a caller could create sessions for arbitrary users/emails.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price: Deno.env.get("STRIPE_PRICE_ID")!,
          quantity: 1,
        },
      ],
      metadata: { supabase_user_id: user.id },
      // also stamp the subscription itself, so cancellation/pause events
      // (which carry the Subscription object, not the Checkout Session)
      // can be traced back to the user in the webhook
      subscription_data: { metadata: { supabase_user_id: user.id } },
      success_url: `${Deno.env.get("SITE_URL")}/?subscribed=true`,
      cancel_url: `${Deno.env.get("SITE_URL")}/`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Checkout failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
