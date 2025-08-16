/*
 * Migration: 002_categories.sql
 * Description: Adds user-specific categories table to allow users to create custom categories
 *  - Creates categories table with user_id foreign key
 *  - Enables RLS for user-specific access
 *  - Adds indexes for efficient querying
 */

/* Categories Table */
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique(user_id, name) -- Prevent duplicate category names per user
);

/* Index for efficient querying by user */
create index if not exists idx_categories_user_id 
  on categories(user_id);

/* Enable RLS on categories */
alter table categories enable row level security;

/* RLS Policy for categories */
create policy "Allow users to manage their own categories"
  on categories
  for all
  using ( auth.uid() = user_id );

/* Insert some default categories for existing users */
insert into categories (user_id, name)
select 
  u.id,
  c.name
from users u
cross join (values 
  ('Dairy'),
  ('Produce'), 
  ('Meat'),
  ('Bakery'),
  ('Snacks'),
  ('Beverages'),
  ('Frozen'),
  ('Condiments')
) as c(name)
on conflict (user_id, name) do nothing; 