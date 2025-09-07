import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scroll Animation App',
  description: 'Next.js app with scroll-driven animations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
