/*
 * =====================================================================================
 *
 *       Filename:  UploadForm.jsx
 *
 *    Description:  Client component for the photo upload form. Handles file selection,
 *                  compression, upload to Supabase Storage, and DB record creation.
 *
 *        Version:  1.1
 *        Created:  [Current Date]
 *       Revision:  Made form context-aware via URL query parameters.
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import imageCompression from 'browser-image-compression';

export default function UploadForm({ events, categories, user }) {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read eventId from URL if it exists
  const eventIdFromUrl = searchParams.get('eventId');

  const [files, setFiles] = useState([]);
  const [eventId, setEventId] = useState(eventIdFromUrl || '');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // If eventIdFromUrl changes, update the state
  useEffect(() => {
    setEventId(eventIdFromUrl || '');
  }, [eventIdFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 || !eventId || !category) {
      setMessage({
        type: 'error',
        content: 'Please select an event, a category, and at least one file.',
      });
      return;
    }

    setIsUploading(true);
    setMessage({ type: 'info', content: 'Starting upload process...' });

    const uploadPromises = files.map(async (file) => {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const fileName = `${user.id}/${Date.now()}_${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('evidence_photos')
        .upload(fileName, compressedFile);

      if (uploadError) {
        throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('evidence_photos')
        .getPublicUrl(uploadData.path);

      const { error: dbError } = await supabase.from('evidence_photos').insert({
        event_id: eventId,
        user_id: user.id,
        category: category,
        note: note,
        photo_url: urlData.publicUrl,
      });

      if (dbError) {
        await supabase.storage.from('evidence_photos').remove([fileName]);
        throw new Error(
          `Database insert failed for ${file.name}: ${dbError.message}`
        );
      }

      return { fileName: file.name, status: 'success' };
    });

    try {
      await Promise.all(uploadPromises);
      setMessage({
        type: 'success',
        content: 'All files uploaded successfully! Redirecting...',
      });
      // Redirect back to the event gallery page after a short delay
      setTimeout(() => router.push(`/events/${eventId}`), 2000);
    } catch (error) {
      setMessage({ type: 'error', content: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload Evidence Photos
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Selection */}
        <div>
          <label htmlFor="event" className="block text-sm font-medium text-gray-700">
            Select Event
          </label>
          <select
            id="event"
            name="event"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            required
            disabled={!!eventIdFromUrl} // Disable dropdown if eventId comes from URL
            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <option value="" disabled>-- Choose an event --</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Other form fields remain the same... */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Select Category
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>-- Choose a category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="photos" className="block text-sm font-medium text-gray-700">
            Select Photos (Multiple allowed)
          </label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            onChange={handleFileChange}
            required
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            Optional Note
          </label>
          <textarea
            id="note"
            name="note"
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full px-4 py-3 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload Photos'}
        </button>

        {message.content && (
          <div
            className={`p-3 mt-4 text-center rounded-md ${
              message.type === 'error' ? 'bg-red-100 text-red-800' :
              message.type === 'success' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            {message.content}
          </div>
        )}
      </form>
    </div>
  );
}