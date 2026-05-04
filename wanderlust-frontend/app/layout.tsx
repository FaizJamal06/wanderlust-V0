import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/UI/Navbar';
import CustomCursor from '@/components/UI/CustomCursor';

export const metadata: Metadata = {
  title: {
    default: 'Wanderlust — Immersive Travel Experiences',
    template: '%s | Wanderlust',
  },
  description: 'Discover extraordinary places to stay with our AI-powered, 3D globe travel platform.',
  keywords: ['travel', 'listings', 'Airbnb', 'accommodation', 'AI travel'],
  authors: [{ name: 'Faiz Jamal' }],
  metadataBase: new URL('http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
