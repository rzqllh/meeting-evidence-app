/*
 * =====================================================================================
 *
 *       Filename:  EventList.jsx
 *
 *    Description:  A component to display a list of events.
 *
 *        Version:  1.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
export default function EventList({ events }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Existing Events
      </h2>
      {events && events.length > 0 ? (
        <ul className="space-y-3">
          {events.map((event) => (
            <li
              key={event.id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-md"
            >
              <p className="font-semibold text-gray-900">{event.name}</p>
              <p className="text-sm text-gray-600">{event.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No events found. Create one to get started!</p>
      )}
    </div>
  );
}