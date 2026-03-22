import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PublicProfileView } from '@/features/profile/PublicProfileView';

interface Props { params: { slug: string }; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `@${params.slug} — Digital Footprint Analyzer`,
    description: `View ${params.slug}'s developer profile and AI insights`,
  };
}

export default function PublicProfilePage({ params }: Props) {
  return <PublicProfileView slug={params.slug} />;
}
