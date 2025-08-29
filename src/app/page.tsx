// src/app/page.tsx
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

// This page handles the root route and redirects to default locale
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
