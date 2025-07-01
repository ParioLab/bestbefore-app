/*
 * Migration: 001_init.sql
 * Description: Initializes the BestBefore schema in Supabase, including
 *  - Enabling uuid generation
 *  - Creating tables: users, products, sync_queue, settings
 *  - Adding necessary indexes
 *  - Enabling Row Level Security (RLS)
 *  - Defining RLS policies for user-specific data access
 */

/* Enable extension for UUID generation */
create extension if not exists "uuid-ossp";

/* 1. Users Table */
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamptz not null default now(),
  is_premium boolean not null default false
);

/* 2. Products Table */
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  barcode text,
  expiry_date date not null,
  category text not null,
  storage_location text not null,
  details text,
  badges text[],  -- Array of health badges (e.g., 'High Fiber', 'Low Sugar')
  health_tips text[],  -- Array of health tips generated from badges
  created_at timestamptz not null default now()
);
/* Index to efficiently query by user and expiry date */
create index if not exists idx_products_user_expiry 
  on products(user_id, expiry_date);

/* Enable RLS on products */
alter table products enable row level security;

/* 3. Sync Queue Table (Offline Support) */
create table if not exists sync_queue (
  id serial primary key,
  user_id uuid not null references users(id) on delete cascade,
  action text not null check (action in ('ADD','EDIT','DELETE')),
  payload jsonb not null,
  timestamp timestamptz not null default now()
);

/* 4. Settings Table */
create table if not exists settings (
  user_id uuid primary key references users(id) on delete cascade,
  reminder_frequency integer not null default 3
);
/* Enable RLS on settings */
alter table settings enable row level security;

/*
 * RLS Policies
 * Allow users to operate only on their own rows
 */
create policy "Allow users to manage their own products"
  on products
  for all
  using ( auth.uid() = user_id );

create policy "Allow users to manage their own settings"
  on settings
  for all
  using ( auth.uid() = user_id );