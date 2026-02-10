-- This script will set up your database tables and initial data.
-- 1. Run this in the Supabase SQL Editor.
-- 2. If you have existing tables, you may want to drop them first.

-- Create the 'categories' table
CREATE TABLE IF NOT EXISTS public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'products' table
CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    images text[],
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    stock integer DEFAULT 0 NOT NULL,
    variants jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the 'orders' table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    items jsonb,
    total numeric NOT NULL,
    status text DEFAULT 'Pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- IMPORTANT: Disable Row Level Security (RLS) for all tables
-- This is a common cause for "failed to fetch" errors in new projects.
-- For production, you should enable RLS and create specific access policies.
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Insert some sample categories to get you started
INSERT INTO public.categories (name) VALUES
('Apparel'),
('Accessories'),
('Footwear'),
('Homeware')
ON CONFLICT (name) DO NOTHING;
