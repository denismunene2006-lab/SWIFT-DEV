create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12, 2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  description text not null default '',
  image_url text not null default '',
  category text not null default 'Accessories',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  store_name text not null default 'Your Store',
  description text not null default '',
  currency text not null default 'KSH' check (currency in ('KSH', 'USD')),
  logo_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null default '',
  customer_email text not null default '',
  phone_number text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'KSH',
  status text not null default 'pending' check (status in ('pending', 'paid', 'delivered', 'cancelled')),
  payment_method text not null default 'Manual confirmation',
  payment_reference text,
  checkout_request_id text,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger set_store_settings_updated_at
before update on public.store_settings
for each row
execute function public.set_updated_at();

create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

insert into public.store_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.store_settings enable row level security;
alter table public.orders enable row level security;

create policy "Public can read products"
on public.products
for select
using (true);

create policy "Authenticated users can manage products"
on public.products
for all
to authenticated
using (true)
with check (true);

create policy "Public can read store settings"
on public.store_settings
for select
using (true);

create policy "Authenticated users can manage store settings"
on public.store_settings
for all
to authenticated
using (true)
with check (true);

create policy "Anyone can create orders"
on public.orders
for insert
to anon, authenticated
with check (status = 'pending');

create policy "Authenticated users can read orders"
on public.orders
for select
to authenticated
using (true);

create policy "Authenticated users can update orders"
on public.orders
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete orders"
on public.orders
for delete
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('store-assets', 'store-assets', true)
on conflict (id) do update set public = true;

create policy "Public can view store assets"
on storage.objects
for select
using (bucket_id = 'store-assets');

create policy "Authenticated users can upload store assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'store-assets');

create policy "Authenticated users can update store assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'store-assets')
with check (bucket_id = 'store-assets');

create policy "Authenticated users can delete store assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'store-assets');
