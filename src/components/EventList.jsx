/*
 * =====================================================================================
 *
 *       Filename:  EventList.jsx
 *
 *    Description:  A component to display a list of events, now with links.
 *
 *        Version:  1.1
 *        Created:  [Current Date]
 *       Revision:  Wrapped list items in Link components.
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import Link from 'next/link';

export default function EventList({ events }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Existing Events
      </h2>
      {events && events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/events/${event.id}`}
                className="block p-4 bg-gray-50 border border-gray-200 rounded-md hover:bg-indigo-50 hover:border-indigo-300 transition-colors duration-200"
              >
                <p className="font-semibold text-gray-900">{event.name}</p>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No events found. Create one to get started!</p>
      )}
    </div>
  );
}