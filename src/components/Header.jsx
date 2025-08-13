/*
 * =====================================================================================
 *
 *       Filename:  Header.jsx
 *
 *    Description:  A shared header component for the authenticated layout.
 *
 *        Version:  1.2 (Corrected)
 *        Created:  [Current Date]
 *       Revision:  FIXED: Added the missing "Upload Photos" link.
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import LogoutButton from './LogoutButton';
import Link from 'next/link';

export default function Header({ user }) {
  return (
    <header className="w-full p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-lg font-bold text-gray-800 hover:text-indigo-600">
            Dashboard
          </Link>
          {/* THIS IS THE MISSING LINK THAT IS NOW ADDED */}
          <Link href="/upload" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
            Upload Photos
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-500 hidden sm:block">
            {user?.email}
          </p>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}