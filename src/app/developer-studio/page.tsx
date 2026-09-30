import type { Metadata } from 'next';
import Studio from '@/components/developer-studio/Studio';
export const metadata: Metadata = {
  title: 'Plot Studio — Land Development Workspace',
  description: 'Explore land development concepts, plot schedules and financial feasibility in VastuCheck Plot Studio.',
  alternates: { canonical: '/developer-studio' },
  robots: { index: false, follow: true },
};
export default function DeveloperStudioPage() { return <Studio />; }
