import { BrandDetail } from '@/components/ui/BrandDetail';

interface BrandPageProps {
  params: Promise<{ id: string }>;
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { id } = await params;
  return <BrandDetail id={Number(id)} />;
}
