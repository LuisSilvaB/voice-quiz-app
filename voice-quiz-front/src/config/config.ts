import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.VITE_APP_SUPABASE_URL, 
    import.meta.env.VITE_APP_SUPABASE_ANON_API,
);

export const publicConfig = {
    v1:import.meta.env.VITE_APP_FLASK_API
}