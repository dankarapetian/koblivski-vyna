create table if not exists public.orders (
  id text primary key,
  customer_name text,
  customer_surname text,
  customer_phone text,
  delivery_type text default 'pickup',
  region text,
  district text,
  city text,
  street text,
  warehouse text,
  notes text,
  total numeric(10,2) default 0,
  items jsonb default '[]'::jsonb,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'Allow inserts for anonymous orders'
  ) then
    create policy "Allow inserts for anonymous orders"
      on public.orders
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
      and policyname = 'Allow reads for authenticated admins'
  ) then
    create policy "Allow reads for authenticated admins"
      on public.orders
      for select
      to authenticated
      using (true);
  end if;
end $$;
