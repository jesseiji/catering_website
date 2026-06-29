'use client';

import { menuItems } from '@/lib/menu-data';
import { MenuItemCard } from '@/components/MenuItemCard';

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
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-text text-4xl sm:text-5xl">
            Our Menu
          </h1>
          <div className="w-10 h-0.5 bg-amber mx-auto mt-4" />
          <p className="text-text-muted text-sm mt-4 max-w-md mx-auto">
            Fresh weekly rotating menu. Click any item to customize and add to your order.
          </p>
        </div>

        {categories.map(({ key, label }) => {
          const items = menuItems.filter((item) => item.category === key);
          if (items.length === 0) return null;

          const allUnavailable = items.every((i) => !i.available);

          return (
            <section key={key} className="mb-14">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-display font-bold text-text text-2xl sm:text-3xl whitespace-nowrap">
                  {label}
                </h2>
                <div className="h-px flex-1 bg-border" />
                {allUnavailable && (
                  <span className="text-amber-dim text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                    Coming Soon
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
