import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type Profile = {
  id: string;
  email: string;
  stripe_customer_id: string | null;
  subscription_status: "free" | "active" | "canceled";
  subscription_id: string | null;
};
