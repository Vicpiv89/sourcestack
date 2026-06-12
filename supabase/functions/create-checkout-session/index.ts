import Stripe from "https://esm.sh/stripe@14";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    });
  }

  const { userId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price: Deno.env.get("STRIPE_PRICE_ID")!,
        quantity: 1,
      },
    ],
    metadata: { supabase_user_id: userId },
    success_url: `${Deno.env.get("SITE_URL")}/account?subscribed=true`,
    cancel_url: `${Deno.env.get("SITE_URL")}/`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
