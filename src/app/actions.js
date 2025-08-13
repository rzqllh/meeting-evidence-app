/*
 * =====================================================================================
 *
 *       Filename:  actions.js
 *
 *    Description:  Server Actions for the application. These functions run only on the server.
 *
 *        Version:  1.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addEvent(formData) {
  const supabase = createClient();

  // 1. Get User and Validate Role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile to check role
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || profile.role !== 'admin') {
    // You can return an error message or redirect
    return {
      error: 'You do not have permission to create events.',
    };
  }

  // 2. Get Form Data
  const eventData = {
    name: formData.get('name'),
    description: formData.get('description'),
    date: formData.get('date'),
    created_by: user.id,
  };

  // 3. Basic Validation
  if (!eventData.name || !eventData.date) {
    return {
      error: 'Event name and date are required.',
    };
  }

  // 4. Insert into Database
  const { error: insertError } = await supabase.from('events').insert(eventData);

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    return {
      error: `Database error: ${insertError.message}`,
    };
  }

  // 5. Revalidate Path
  // This tells Next.js to re-fetch the data on the dashboard page,
  // so the new event appears immediately.
  revalidatePath('/');

  return {
    success: 'Event created successfully!',
  };
}