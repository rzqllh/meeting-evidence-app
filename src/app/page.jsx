/*
 * =====================================================================================
 *
 *       Filename:  page.jsx
 *
 *    Description:  The main protected dashboard page of the application.
 *                  Fetches user data, role, and events on the server.
 *
 *        Version:  2.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import AddEventForm from '@/components/AddEventForm';
import EventList from '@/components/EventList';

export default async function HomePage() {
  const supabase = createClient();

  // 1. Get User Session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Get User Profile (including role)
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  // 3. Get Events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false });

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <Header user={user} />
      <main className="w-full max-w-4xl p-4 md:p-8 space-y-8">
        {/* Conditionally render the form for admins */}
        {isAdmin && <AddEventForm />}

        <EventList events={events} />
      </main>
    </div>
  );
}