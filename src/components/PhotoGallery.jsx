/*
 * =====================================================================================
 *
 *       Filename:  PhotoGallery.jsx
 *
 *    Description:  A component that renders the entire photo gallery for an event,
 *                  with photos grouped by category.
 *
 *        Version:  1.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import PhotoCard from './PhotoCard';

export default function PhotoGallery({ groupedPhotos }) {
  // Get the sorted category keys
  const sortedCategories = Object.keys(groupedPhotos).sort();

  if (sortedCategories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No photos have been uploaded for this event yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedCategories.map((category) => (
        <section key={category}>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {category.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {groupedPhotos[category].map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}