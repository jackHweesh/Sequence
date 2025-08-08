-- Fix RLS policies to allow public read access
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can access questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can access questions" ON questions;

-- Create policy for public read access
CREATE POLICY "Public can read questions" ON questions
FOR SELECT USING (true);

-- Create policy for authenticated users to write
CREATE POLICY "Authenticated users can write questions" ON questions
FOR ALL USING (auth.role() = 'authenticated'); 