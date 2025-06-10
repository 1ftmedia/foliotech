/*
  # Create subscribers table for newsletter subscriptions

  1. New Tables
    - `subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamptz, default: now())
      - `status` (text, subscription status)
      - `updated_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on subscribers table
    - Add policies for:
      - Public can insert new subscribers
      - Admins can view all subscribers
*/

-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'unsubscribed', 'bounced'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS subscribers_email_idx ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS subscribers_status_idx ON public.subscribers(status);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can insert new subscribers"
  ON public.subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can view all subscribers"
  ON public.subscribers
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_subscribers_updated_at();