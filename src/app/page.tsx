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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-red-dark/20 via-transparent to-red-dark/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
          <div className="flex justify-center mb-6">
            <Image src="/images/icon-flame.svg" alt="" width={56} height={56} className="animate-pulse" />
          </div>

          <h1 className="font-display font-black text-gold text-glow-gold-strong text-4xl sm:text-5xl md:text-7xl leading-tight tracking-tight">
            Hot Meals N<br />High Heels
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold-dim font-display text-sm sm:text-base tracking-[0.3em] uppercase">x</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="font-display font-semibold text-cream text-xl sm:text-2xl md:text-3xl mt-2 tracking-wide">
            JWB Soul Catering
          </h2>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Image src="/images/icon-high-heel.svg" alt="" width={20} height={20} />
            <p className="text-red font-display italic text-lg sm:text-xl">Soul Food on Board!</p>
            <Image src="/images/icon-flame.svg" alt="" width={20} height={20} />
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              className="w-full sm:w-auto bg-gold hover:bg-gold-bright text-black font-bold py-4 px-10 rounded-full text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98]"
            >
              View Menu
            </Link>
            <Link
              href="/order"
              className="w-full sm:w-auto bg-red hover:bg-red-glow text-cream font-bold py-4 px-10 rounded-full text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-red/20 active:scale-[0.98]"
            >
              Start an Order
            </Link>
          </div>

          <a
            href="https://www.instagram.com/hotmealsnhighheelsxjwbsoul/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-cream-dim hover:text-gold transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            @hotmealsnhighheelsxjwbsoul
          </a>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Featured Foods */}
      <section className="relative py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-gold text-glow-gold text-3xl sm:text-4xl">
              This Week&apos;s Favorites
            </h2>
            <p className="text-cream-dim mt-3 text-base max-w-lg mx-auto">
              Select your favorites below, then order them all at once.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="bg-gold hover:bg-gold-bright text-black font-bold py-4 px-10 rounded-full text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-gold/20 active:scale-[0.98]"
              >
                Order Selected Items ({selectedIds.size})
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick links strip */}
      <section className="py-12 border-t border-b border-gold/10">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-6 sm:gap-10">
          <Link href="/menu" className="flex items-center gap-2 text-cream-dim hover:text-gold transition-colors group">
            <Image src="/images/icon-flame.svg" alt="" width={20} height={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-display text-base tracking-wide">Full Menu</span>
          </Link>
          <Link href="/order" className="flex items-center gap-2 text-cream-dim hover:text-gold transition-colors group">
            <Image src="/images/icon-high-heel.svg" alt="" width={20} height={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-display text-base tracking-wide">Catering</span>
          </Link>
          <a href="https://www.instagram.com/hotmealsnhighheelsxjwbsoul/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream-dim hover:text-gold transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            <span className="font-display text-base tracking-wide">Instagram</span>
          </a>
          <Link href="/contact" className="flex items-center gap-2 text-cream-dim hover:text-gold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="font-display text-base tracking-wide">Contact Us</span>
          </Link>
        </div>
      </section>
    </>
  );
}
