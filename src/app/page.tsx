'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { getFeaturedItems, getMenuItem } from '@/lib/menu-data';
import { useCart } from '@/context/CartContext';
import { MenuItemCard } from '@/components/MenuItemCard';

export default function HomePage() {
  const featured = getFeaturedItems();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOrderSelected = () => {
    selectedIds.forEach((id) => {
      const item = getMenuItem(id);
      if (!item) return;
      const defaultSelections: Record<string, string[]> = {};
      item.customizations.forEach((c) => {
        defaultSelections[c.type] = c.options.slice(0, c.min).map((o) => o.id);
      });
      addItem({
        menuItemId: item.id,
        quantity: 1,
        selections: defaultSelections,
        cartId: crypto.randomUUID(),
      });
    });
    setSelectedIds(new Set());
    window.location.href = '/order';
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-foodtruck-night.jpg"
            alt="Food truck at night"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/50 to-bg" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-20 pb-32">
          <p className="text-amber font-display italic text-base sm:text-lg mb-6 tracking-wide">
            Soul Food on Board
          </p>

          <h1 className="font-display font-bold text-text text-5xl sm:text-6xl md:text-7xl leading-[1.1] tracking-tight">
            Hot Meals N{' '}
            <span className="text-amber">High Heels</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-10 bg-border-hover" />
            <span className="text-text-faint font-display text-lg">&times;</span>
            <div className="h-px w-10 bg-border-hover" />
          </div>

          <h2 className="font-display text-text-muted text-xl sm:text-2xl mt-3 tracking-wide">
            JWB Soul Catering
          </h2>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/menu"
              className="w-full sm:w-auto bg-amber hover:bg-amber-hover text-bg font-semibold py-3.5 px-10 rounded-lg text-base transition-colors"
            >
              View Menu
            </Link>
            <Link
              href="/order"
              className="w-full sm:w-auto bg-crimson hover:bg-crimson-hover text-text font-semibold py-3.5 px-10 rounded-lg text-base transition-colors"
            >
              Start an Order
            </Link>
          </div>

          <a
            href="https://www.instagram.com/hotmealsnhighheelsxjwbsoul/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-text-faint hover:text-amber transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @hotmealsnhighheelsxjwbsoul
          </a>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-text text-3xl sm:text-4xl">
              This Week&apos;s Favorites
            </h2>
            <div className="w-10 h-0.5 bg-amber mx-auto mt-4" />
            <p className="text-text-muted mt-4 text-sm max-w-md mx-auto">
              Select your favorites below, then order them all at once.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                selectable
                selected={selectedIds.has(item.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>

          {selectedIds.size > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleOrderSelected}
                className="bg-amber hover:bg-amber-hover text-bg font-semibold py-3.5 px-10 rounded-lg text-base transition-colors"
              >
                Order Selected Items ({selectedIds.size})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Links */}
      <section className="py-10 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8">
          <Link href="/menu" className="flex items-center gap-2 text-text-muted hover:text-amber transition-colors text-sm">
            <Image src="/images/icon-flame.svg" alt="" width={16} height={16} />
            Full Menu
          </Link>
          <Link href="/order" className="text-text-muted hover:text-amber transition-colors text-sm">
            Catering
          </Link>
          <a href="https://www.instagram.com/hotmealsnhighheelsxjwbsoul/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-amber transition-colors text-sm">
            Instagram
          </a>
          <Link href="/contact" className="text-text-muted hover:text-amber transition-colors text-sm">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
