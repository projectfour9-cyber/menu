-- Ensure dietaryTags column exists and is text[] on dishes and sub_menu_items
-- This is safe to run multiple times.

alter table if exists public.dishes
  add column if not exists "dietaryTags" text[] not null default '{}';

alter table if exists public.dishes
  alter column "dietaryTags" type text[] using "dietaryTags"::text[];

alter table if exists public.sub_menu_items
  add column if not exists "dietaryTags" text[] not null default '{}';

alter table if exists public.sub_menu_items
  alter column "dietaryTags" type text[] using "dietaryTags"::text[];
