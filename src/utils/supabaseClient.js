import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dbffhjyrsjjgowvwlqws.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZmZoanlyc2pqZ293dndscXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjA4NTEsImV4cCI6MjA3MDA5Njg1MX0.2s-ANrsJ8HkFrW5rTA-cJnuWw5koNtHJ5-VKAGaHM1M'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 