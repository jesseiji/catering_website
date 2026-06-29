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
      <div className="bg-surface rounded-xl overflow-hidden border border-border opacity-50">
        <div className="relative h-48 bg-surface-hover flex items-center justify-center">
          <span className="text-text-faint font-display text-lg italic">Coming Soon</span>
        </div>
        <div className="p-5">
          <h3 className="font-display font-semibold text-text text-lg">{item.name}</h3>
          <p className="text-text-muted text-sm mt-1">{item.description}</p>
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
        className={`bg-surface rounded-xl overflow-hidden border transition-all duration-200 ${
          selected ? 'border-amber' : 'border-border hover:border-border-hover'
        }`}
      >
        <div className="relative h-48 sm:h-56 bg-surface-hover overflow-hidden">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover hover:scale-[1.03] transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {item.unitLabel && (
            <span className="absolute top-3 right-3 bg-bg/80 backdrop-blur-sm text-amber text-xs font-semibold px-3 py-1 rounded-full border border-border">
              {item.unitLabel}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-text text-lg leading-tight">{item.name}</h3>
            <span className="text-amber font-display font-bold text-lg shrink-0">${item.price}</span>
          </div>
          <p className="text-text-muted text-sm mt-2 leading-relaxed">{item.description}</p>

          {item.customizations.length > 0 && (
            <p className="text-text-faint text-xs mt-2">
              {item.customizations.map((c) => c.label).join(' · ')}
            </p>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleAddToOrder}
              className="flex-1 bg-crimson hover:bg-crimson-hover text-text font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
            >
              Add to Order
            </button>
            {selectable && (
              <button
                onClick={() => onToggleSelect?.(item.id)}
                className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                  selected
                    ? 'border-amber bg-amber text-bg'
                    : 'border-border text-text-faint hover:border-amber hover:text-amber'
                }`}
                aria-label={selected ? 'Deselect' : 'Select'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
