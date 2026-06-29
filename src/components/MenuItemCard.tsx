'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { MenuItem } from '@/lib/menu-data';
import { useCart } from '@/context/CartContext';
import { CustomizationModal } from './CustomizationModal';

interface Props {
  item: MenuItem;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function MenuItemCard({ item, selectable, selected, onToggleSelect }: Props) {
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useCart();

  if (!item.available) {
    return (
      <div className="bg-charcoal rounded-2xl overflow-hidden border border-gold/10 opacity-60">
        <div className="relative h-48 bg-charcoal-light flex items-center justify-center">
          <span className="text-gold/40 font-display text-lg">Coming Soon</span>
        </div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-gold text-lg">{item.name}</h3>
          <p className="text-cream-dim text-sm mt-1">{item.description}</p>
        </div>
      </div>
    );
  }

  const handleAddToOrder = () => {
    if (item.customizations.length > 0) {
      setShowModal(true);
    } else {
      addItem({
        menuItemId: item.id,
        quantity: 1,
        selections: {},
        cartId: crypto.randomUUID(),
      });
    }
  };

  return (
    <>
      <div
        className={`bg-charcoal rounded-2xl overflow-hidden border transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5 ${
          selected ? 'border-gold ring-2 ring-gold/30' : 'border-gold/10'
        }`}
      >
        <div className="relative h-48 sm:h-56 bg-charcoal-light overflow-hidden group">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {item.unitLabel && (
            <span className="absolute top-3 right-3 bg-red text-cream text-xs font-bold px-3 py-1 rounded-full">
              {item.unitLabel}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-cream text-lg leading-tight">{item.name}</h3>
            <span className="text-gold font-display font-bold text-lg shrink-0">${item.price}</span>
          </div>
          <p className="text-cream-dim text-sm mt-2 leading-relaxed">{item.description}</p>

          {item.customizations.length > 0 && (
            <p className="text-gold-dim text-xs mt-2 italic">
              {item.customizations.map((c) => c.label).join(' • ')}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAddToOrder}
              className="flex-1 bg-red hover:bg-red-glow text-cream font-semibold py-2.5 px-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              Add to Order
            </button>
            {selectable && (
              <button
                onClick={() => onToggleSelect?.(item.id)}
                className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all ${
                  selected
                    ? 'border-gold bg-gold text-black'
                    : 'border-gold/30 text-gold/30 hover:border-gold hover:text-gold'
                }`}
                aria-label={selected ? 'Deselect' : 'Select'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CustomizationModal item={item} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
