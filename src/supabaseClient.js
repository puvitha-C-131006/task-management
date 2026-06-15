import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = (envUrl && envUrl !== 'YOUR_SUPABASE_URL') ? envUrl : 'https://hbezknyaygvdboylfcwq.supabase.co';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseAnonKey = (envKey && envKey !== 'YOUR_SUPABASE_ANON_KEY') ? envKey : 'sb_publishable_N3Z6dU3qk2vBMDrVv3dVww__tw_vnBE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
