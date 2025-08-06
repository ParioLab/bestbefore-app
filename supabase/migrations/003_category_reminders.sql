/*
 * Migration: 003_category_reminders.sql
 * Description: Adds category-specific reminder frequency settings
 *  - Creates category_reminders table for per-category notification settings
 *  - Enables RLS for user-specific access
 *  - Adds indexes for efficient querying
 *  - Migrates existing global reminder settings to category-specific defaults
 */

/* Category Reminders Table */
create table if not exists category_reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  category_name text not null,
  reminder_days integer not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, category_name) -- One reminder setting per category per user
);

/* Index for efficient querying by user */
create index if not exists idx_category_reminders_user_id 
  on category_reminders(user_id);

/* Index for efficient querying by user and category */
create index if not exists idx_category_reminders_user_category 
  on category_reminders(user_id, category_name);

/* Enable RLS on category_reminders */
alter table category_reminders enable row level security;

/* RLS Policy for category_reminders */
create policy "Allow users to manage their own category reminders"
  on category_reminders
  for all
  using ( auth.uid() = user_id );

/* Function to update updated_at timestamp */
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

/* Trigger to automatically update updated_at */
create trigger update_category_reminders_updated_at
  before update on category_reminders
  for each row
  execute function update_updated_at_column();

/* Migrate existing global reminder settings to category-specific defaults */
insert into category_reminders (user_id, category_name, reminder_days)
select 
  s.user_id,
  c.name,
  s.reminder_frequency
from settings s
cross join categories c
where s.reminder_frequency is not null
on conflict (user_id, category_name) do nothing;

/* Add some default category-specific reminders for common categories */
insert into category_reminders (user_id, category_name, reminder_days)
select 
  u.id,
  'Meat',
  7  -- 1 week for meat
from users u
where not exists (
  select 1 from category_reminders cr 
  where cr.user_id = u.id and cr.category_name = 'Meat'
);

insert into category_reminders (user_id, category_name, reminder_days)
select 
  u.id,
  'Bakery',
  5  -- 5 days for bakery
from users u
where not exists (
  select 1 from category_reminders cr 
  where cr.user_id = u.id and cr.category_name = 'Bakery'
);

insert into category_reminders (user_id, category_name, reminder_days)
select 
  u.id,
  'Dairy',
  3  -- 3 days for dairy
from users u
where not exists (
  select 1 from category_reminders cr 
  where cr.user_id = u.id and cr.category_name = 'Dairy'
);

insert into category_reminders (user_id, category_name, reminder_days)
select 
  u.id,
  'Produce',
  2  -- 2 days for produce
from users u
where not exists (
  select 1 from category_reminders cr 
  where cr.user_id = u.id and cr.category_name = 'Produce'
);

/* Add default for any other categories */
insert into category_reminders (user_id, category_name, reminder_days)
select 
  u.id,
  c.name,
  3  -- Default 3 days for other categories
from users u
cross join categories c
where not exists (
  select 1 from category_reminders cr 
  where cr.user_id = u.id and cr.category_name = c.name
); 