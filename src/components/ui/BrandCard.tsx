import Image from 'next/image';
import Link from 'next/link';
import type { Brand } from '@/types/brand';

interface BrandCardProps {
  brand: Brand;
  priority?: boolean;
}

export function BrandCard({ brand, priority }: BrandCardProps) {
  return (
    <Link href={`/brands/${brand.id}`} className="group cursor-pointer no-underline">
      <div className="relative aspect-[4/5] bg-bg-input overflow-hidden">
        {brand.imageUrl ? (
          <Image
            src={brand.imageUrl}
            alt={brand.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-400"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">
            {brand.name}
          </div>
        )}
      </div>
      <div className="py-4 max-md:py-3">
        <h3 className="font-display text-sm font-normal text-primary">
          {brand.name}
        </h3>
      </div>
    </Link>
  );
}
