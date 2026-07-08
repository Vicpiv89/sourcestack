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

    // profile read is RLS-scoped to the caller
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: "No billing account found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${Deno.env.get("SITE_URL")}/account`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Could not open billing portal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
