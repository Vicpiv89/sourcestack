-- Users must never write their own profile: subscription_status is the Pro
-- gate, and this policy let any signed-in user set it to 'active' from the
-- browser console. Only the stripe-webhook (service role, bypasses RLS)
-- writes profiles.
drop policy "Users can update own profile" on public.profiles;
