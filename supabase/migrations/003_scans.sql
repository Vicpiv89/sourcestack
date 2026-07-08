-- Saved face scans: measurements only, never the photo.
create table public.scans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  overall numeric not null,
  tier text not null,
  metrics jsonb not null,
  goals text[] default '{}',
  created_at timestamptz default now()
);

alter table public.scans enable row level security;

create policy "Users can view own scans" on public.scans
  for select using (auth.uid() = user_id);

-- saving scans is a Pro feature; enforce server-side, not just in the UI
create policy "Active subscribers can insert own scans" on public.scans
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and subscription_status = 'active'
    )
  );

create policy "Users can delete own scans" on public.scans
  for delete using (auth.uid() = user_id);
