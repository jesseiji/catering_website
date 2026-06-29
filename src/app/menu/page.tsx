'use client';

import { menuItems } from '@/lib/menu-data';
import { MenuItemCard } from '@/components/MenuItemCard';
import Image from 'next/image';

const categories = [
  { key: 'entree' as const, label: 'Entrées' },
  { key: 'appetizer' as const, label: 'Appetizers' },
  { key: 'side' as const, label: 'Sides' },
  { key: 'dessert' as const, label: 'Desserts' },
  { key: 'drink' as const, label: 'Drinks' },
];

export default function MenuPage() {
  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Image src="/images/icon-flame.svg" alt="" width={32} height={32} />
            <h1 className="font-display font-black text-gold text-glow-gold text-4xl sm:text-5xl">
              Our Menu
            </h1>
            <Image src="/images/icon-flame.svg" alt="" width={32} height={32} />
          </div>
          <p className="text-cream-dim text-base max-w-lg mx-auto">
            Fresh weekly rotating menu. Click any item to customize and add to your order.
          </p>
        </div>

        {/* Categories */}
        {categories.map(({ key, label }) => {
          const items = menuItems.filter((item) => item.category === key);
          if (items.length === 0) return null;

          const hasUnavailable = items.every((i) => !i.available);

          return (
            <section key={key} className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
                <h2 className="font-display font-bold text-gold text-2xl sm:text-3xl tracking-wide">
                  {label}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-gold/30 to-transparent" />
                {hasUnavailable && (
                  <span className="text-red text-xs font-semibold uppercase tracking-wider ml-2">
                    Coming Soon
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
