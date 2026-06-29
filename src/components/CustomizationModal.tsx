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

  const toggleOption = (type: string, optionId: string, max: number) => {
    setSelections((prev) => {
      const current = prev[type] || [];
      if (current.includes(optionId)) return { ...prev, [type]: current.filter((id) => id !== optionId) };
      if (current.length >= max) return { ...prev, [type]: [...current.slice(1), optionId] };
      return { ...prev, [type]: [...current, optionId] };
    });
  };

  const isValid = item.customizations.every((c) => {
    const sel = selections[c.type] || [];
    return sel.length >= c.min && sel.length <= c.max;
  });

  const handleAdd = () => {
    if (!isValid) return;
    addItem({ menuItemId: item.id, quantity, selections, cartId: crypto.randomUUID() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-surface rounded-lg border border-border max-w-md w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="font-display font-bold text-text text-xl tracking-wide">{item.name}</h2>
              <p className="text-hot font-display font-bold text-lg mt-1">${item.price} each</p>
            </div>
            <button onClick={onClose} className="text-text-faint hover:text-text p-1 transition-colors" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {item.customizations.map((c) => (
            <div key={c.type} className="mb-5">
              <h3 className="text-text font-medium text-sm mb-3">
                {c.label}
                <span className="text-text-faint font-normal ml-2 text-xs">(select {c.min === c.max ? c.min : `${c.min}–${c.max}`})</span>
              </h3>
              <div className="space-y-2">
                {c.options.map((opt) => {
                  const active = (selections[c.type] || []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleOption(c.type, opt.id, c.max)}
                      className={`w-full text-left px-4 py-3 rounded border transition-colors text-sm ${
                        active ? 'border-gold bg-gold/10 text-gold' : 'border-border bg-surface-hover text-text-muted hover:border-border-hover'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {opt.label}
                        {active && <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="mb-6">
            <h3 className="text-text font-medium text-sm mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded border border-border text-text-muted hover:border-gold hover:text-gold transition-colors flex items-center justify-center">&minus;</button>
              <span className="text-text font-semibold text-lg w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded border border-border text-text-muted hover:border-gold hover:text-gold transition-colors flex items-center justify-center">+</button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={!isValid}
            className={`w-full py-3 rounded font-medium text-sm transition-colors ${
              isValid ? 'bg-hot hover:bg-hot-hover text-white' : 'bg-surface-hover text-text-faint cursor-not-allowed'
            }`}
          >
            Add to Order — ${item.price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}
