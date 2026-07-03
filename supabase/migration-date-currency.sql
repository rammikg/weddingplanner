-- Wedding OS — migration: wedding date + CZK rate
-- Run this ONCE in Supabase → SQL Editor (your tables already exist).
-- Safe to run more than once.

alter table settings add column if not exists wedding_date date;
alter table settings add column if not exists eur_czk_rate numeric default 25;
