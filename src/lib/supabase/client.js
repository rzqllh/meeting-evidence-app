/*
 * =====================================================================================
 *
 *       Filename:  client.js
 *
 *    Description:  Supabase client for Client Components.
 *                  This is used for interactive, browser-side operations.
 *
 *        Version:  1.1 (Corrected)
 *        Created:  [Current Date]
 *       Revision:  Fixed incorrect function name from auth-helpers.
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
// BEFORE: import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
// AFTER (FIX): The function is now named createClientComponentClient for Client Components.
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// The function signature remains the same, but the imported function name is corrected.
// It still requires the environment variables to be passed in.
export const createClient = () =>
  createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });