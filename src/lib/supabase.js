import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "https://jvqeynqbxjmkectmfvbo.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2cWV5bnFieGpta2VjdG1mdmJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDY5NjYxNCwiZXhwIjoyMDYwMjcyNjE0fQ.ZtEfLII9zA0m7eKaToUzzp3thvNytnGCrIEXruuMyoY";

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);