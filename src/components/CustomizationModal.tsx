'use client';

import { useState } from 'react';
import type { MenuItem } from '@/lib/menu-data';
import { useCart } from '@/context/CartContext';

interface Props {
  item: MenuItem;
  onClose: () => void;
}

export function CustomizationModal({ item, onClose }: Props) {
  const { addItem } = useCart();
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  const toggleOption = (customizationType: string, optionId: string, max: number) => {
    setSelections((prev) => {
      const current = prev[customizationType] || [];
      if (current.includes(optionId)) {
        return { ...prev, [customizationType]: current.filter((id) => id !== optionId) };
      }
      if (current.length >= max) {
        return { ...prev, [customizationType]: [...current.slice(1), optionId] };
      }
      return { ...prev, [customizationType]: [...current, optionId] };
    });
  };

  const isValid = item.customizations.every((c) => {
    const selected = selections[c.type] || [];
    return selected.length >= c.min && selected.length <= c.max;
  });

  const handleAdd = () => {
    if (!isValid) return;
    addItem({
      menuItemId: item.id,
      quantity,
      selections,
      cartId: crypto.randomUUID(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-charcoal rounded-2xl border border-gold/20 max-w-md w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-gold text-xl">{item.name}</h2>
              <p className="text-cream-dim text-sm mt-1">${item.price} each</p>
            </div>
            <button onClick={onClose} className="text-cream-dim hover:text-cream p-1" aria-label="Close">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {item.customizations.map((customization) => (
            <div key={customization.type} className="mb-5">
              <h3 className="text-cream font-semibold text-sm mb-3">
                {customization.label}
                <span className="text-cream-dim font-normal ml-2">
                  (select {customization.min === customization.max ? customization.min : `${customization.min}-${customization.max}`})
                </span>
              </h3>
              <div className="space-y-2">
                {customization.options.map((option) => {
                  const isSelected = (selections[customization.type] || []).includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(customization.type, option.id, customization.max)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                        isSelected
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-charcoal-light bg-charcoal-light text-cream-dim hover:border-gold/30'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {option.label}
                        {isSelected && (
                          <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-cream font-semibold text-sm mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition flex items-center justify-center text-xl"
              >
                -
              </button>
              <span className="text-cream font-bold text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!isValid}
            className={`w-full py-3 rounded-xl font-semibold text-base transition-all ${
              isValid
                ? 'bg-red hover:bg-red-glow text-cream hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-charcoal-light text-cream-dim/40 cursor-not-allowed'
            }`}
          >
            Add to Order — ${item.price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}
