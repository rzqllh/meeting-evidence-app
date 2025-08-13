/*
 * =====================================================================================
 *
 *       Filename:  page.jsx
 *
 *    Description:  Dynamic page for displaying a single event's details and photo gallery.
 *
 *        Version:  1.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import PhotoGallery from '@/components/PhotoGallery';

export default async function EventDetailsPage({ params }) {
  const supabase = createClient();
  const eventId = params.id;

  // 1. Authenticate User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Fetch Event Details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    notFound(); // Renders the not-found.js file or a default 404 page
  }

  // 3. Fetch Photos for this Event (with uploader's name)
  const { data: photos, error: photosError } = await supabase
    .from('evidence_photos')
    .select('*, users(name, email)') // Join with users table
    .eq('event_id', eventId)
    .order('created_at', { ascending: true });

  // 4. Group Photos by Category
  const groupedPhotos = (photos || []).reduce((acc, photo) => {
    const category = photo.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(photo);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <Header user={user} />
      <main className="w-full max-w-6xl p-4 md:p-8">
        <div className="mb-8">
          <Link href="/" className="text-sm text-indigo-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{event.name}</h1>
          <p className="text-md text-gray-600">{event.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Date: {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <PhotoGallery groupedPhotos={groupedPhotos} />
      </main>
    </div>
  );
}