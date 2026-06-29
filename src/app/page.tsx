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
      const defaults: Record<string, string[]> = {};
      item.customizations.forEach((c) => {
        defaults[c.type] = c.options.slice(0, c.min).map((o) => o.id);
      });
      addItem({ menuItemId: item.id, quantity: 1, selections: defaults, cartId: crypto.randomUUID() });
    });
    setSelectedIds(new Set());
    window.location.href = '/order';
  };

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-foodtruck-night.jpg" alt="Soul food platter" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24 pt-40">
          <p className="font-display italic text-hot text-base sm:text-lg tracking-wide mb-4">
            Soul Food on Board
          </p>

          <h1 className="font-display font-bold text-text text-5xl sm:text-6xl md:text-8xl leading-[0.95] tracking-tight max-w-3xl">
            Hot Meals N{' '}
            <span className="text-gold">High Heels</span>
          </h1>

          <p className="font-display text-text-muted text-lg sm:text-xl mt-4 tracking-wide">
            <span className="text-text-faint">&times;</span> JWB Soul Catering
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/menu" className="bg-gold hover:bg-gold-hover text-bg font-semibold py-3.5 px-10 rounded text-sm tracking-wide transition-colors text-center">
              View Menu
            </Link>
            <Link href="/order" className="bg-hot hover:bg-hot-hover text-white font-semibold py-3.5 px-10 rounded text-sm tracking-wide transition-colors text-center">
              Start an Order
            </Link>
          </div>

          <a
            href="https://www.instagram.com/hotmealsnhighheelsxjwbsoul/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-text-faint hover:text-gold transition-colors text-xs tracking-wide"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            @hotmealsnhighheelsxjwbsoul
          </a>
        </div>
      </section>

      {/* Featured */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="text-hot text-xs font-medium uppercase tracking-[0.2em] mb-3">This Week</p>
            <h2 className="font-display font-bold text-text text-3xl sm:text-4xl tracking-tight">
              Featured Dishes
            </h2>
            <p className="text-text-faint mt-3 text-sm max-w-md">
              Select your favorites, then order them all at once.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item) => (
              <MenuItemCard key={item.id} item={item} selectable selected={selectedIds.has(item.id)} onToggleSelect={toggleSelect} />
            ))}
          </div>

          {selectedIds.size > 0 && (
            <div className="mt-8">
              <button onClick={handleOrderSelected} className="bg-gold hover:bg-gold-hover text-bg font-semibold py-3.5 px-10 rounded text-sm tracking-wide transition-colors">
                Order Selected ({selectedIds.size})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Links */}
      <section className="py-10 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8">
          <Link href="/menu" className="text-text-faint hover:text-gold transition-colors text-xs tracking-wider uppercase font-medium">Full Menu</Link>
          <Link href="/order" className="text-text-faint hover:text-gold transition-colors text-xs tracking-wider uppercase font-medium">Catering</Link>
          <a href="https://www.instagram.com/hotmealsnhighheelsxjwbsoul/" target="_blank" rel="noopener noreferrer" className="text-text-faint hover:text-gold transition-colors text-xs tracking-wider uppercase font-medium">Instagram</a>
          <Link href="/contact" className="text-text-faint hover:text-gold transition-colors text-xs tracking-wider uppercase font-medium">Contact</Link>
        </div>
      </section>
    </>
  );
}
