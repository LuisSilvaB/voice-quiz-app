import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.VITE_APP_SUPABASE_URL, 
    import.meta.env.VITE_APP_SUPABASE_ANON_API,
);

export const publicConfig = {
    back_v1:import.meta.env.VITE_APP_FLASK_API, 
    back_v1_local:import.meta.env.VITE_APP_FLASK_API_LOCAL,
    front_v1:import.meta.env.VITE_APP_FRONT_URL,
    front_v1_local:import.meta.env.VITE_APP_FRONT_LOCAL_URL
}