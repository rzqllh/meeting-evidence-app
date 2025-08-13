/*
 * =====================================================================================
 *
 *       Filename:  server.js
 *
 *    Description:  Supabase client for Server Components, Route Handlers, and Server Actions.
 *                  This is used for server-side operations and securely manages auth via cookies.
 *
 *        Version:  1.1 (Corrected)
 *        Created:  [Current Date]
 *       Revision:  Fixed incorrect function name from auth-helpers.
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
// BEFORE: import { createServerClient } from '@supabase/auth-helpers-nextjs';
// AFTER (FIX): The function is now named createServerComponentClient for Server Components.
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// The function signature remains the same, but the imported function name is corrected.
export const createClient = () =>
  createServerComponentClient({
    cookies: cookies,
  });

// NOTE: The original implementation passed credentials directly. The new helper
// for Server Components infers them and only requires the cookies function.
// This is a cleaner and more modern approach provided by the library.