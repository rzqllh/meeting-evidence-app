/*
 * =====================================================================================
 *
 *       Filename:  PhotoCard.jsx
 *
 *    Description:  A component to display a single evidence photo with its metadata.
 *
 *        Version:  1.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import Image from 'next/image';

export default function PhotoCard({ photo }) {
  return (
    <div className="group relative block w-full aspect-square overflow-hidden rounded-lg bg-gray-100 shadow-md">
      <Image
        src={photo.photo_url}
        alt={photo.note || 'Evidence photo'}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="text-xs font-semibold">
          By: {photo.users?.name || photo.users?.email || 'Unknown'}
        </p>
        {photo.note && <p className="mt-1 text-xs">{photo.note}</p>}
      </div>
    </div>
  );
}