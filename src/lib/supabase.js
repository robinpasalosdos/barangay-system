import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "https://quxrkmkoadnsdqvqztyo.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eHJrbWtvYWRuc2RxdnF6dHlvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEzNjkxMiwiZXhwIjoyMDYyNzEyOTEyfQ.BOukcmMFBqfl45tmprmjfH4mRVwz2GbYi2o4WWN7074";

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);