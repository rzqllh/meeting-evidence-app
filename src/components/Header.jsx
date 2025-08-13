/*
 * =====================================================================================
 *
 *       Filename:  Header.jsx
 *
 *    Description:  A shared header component for the authenticated layout.
 *
 *        Version:  1.0
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import LogoutButton from './LogoutButton';

export default function Header({ user }) {
  return (
    <header className="w-full p-4 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-gray-800">
            Meeting Evidence Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Logged in as: {user?.email}
          </p>
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}