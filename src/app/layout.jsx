/*
 * =====================================================================================
 *
 *       Filename:  layout.jsx
 *
 *    Description:  The root layout for the entire application.
 *                  (Version 1.1: Corrected to ensure globals.css is imported)
 *
 *        Version:  1.1
 *        Created:  [Current Date]
 *       Revision:  none
 *
 *         Author:  Your Technical Assistant
 *
 * =====================================================================================
 */
import { Inter } from 'next/font/google';

// !!! BARIS INI SANGAT PENTING !!!
// Ini yang memuat semua styling dari Tailwind CSS ke dalam aplikasi.
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Meeting Evidence App',
  description: 'A web app for documenting meeting evidence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}