create table if not exists orders (
  id           text primary key,
  customer     text not null,
  phone        text not null,
  email        text,
  type         text not null check (type in ('delivery', 'pickup')),
  payment      text not null check (payment in ('cash', 'card')),
  address      text,
  notes        text,
  items        jsonb not null default '[]',
  subtotal     numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total        numeric(10,2) not null default 0,
  status       text not null default 'new' check (status in ('new', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  created_at   timestamptz not null default now()
);
create index if not exists orders_created_at_idx on orders (created_at desc);
alter table orders enable row level security;
create policy "Anyone can place an order" on orders for insert with check (true);
create policy "Authenticated users can read orders" on orders for select using (auth.role() = 'authenticated');
create policy "Authenticated users can update orders" on orders for update using (auth.role() = 'authenticated');