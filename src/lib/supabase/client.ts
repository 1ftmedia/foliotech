import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { supabaseConfig, getCurrentConfig } from './config';

// Check for required environment variables
const config = getCurrentConfig();

if (!config.supabaseUrl || !config.supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

export const supabase = createClient<Database>(
  config.supabaseUrl,
  config.supabaseAnonKey,
  supabaseConfig
);

// Export site URL and configuration for use in other components
export { getCurrentConfig as getConfig } from './config';
export const siteUrl = config.siteUrl;
export const redirectUrl = config.redirectUrl;