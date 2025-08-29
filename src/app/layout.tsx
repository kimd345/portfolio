// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dan Kim | 김동혁',
  description: 'Creative portfolio showcasing projects and journey',
};

// Root layout - minimal setup to avoid hydration issues
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
