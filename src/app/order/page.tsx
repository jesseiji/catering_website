'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getMenuItem, formatCartItemLabel } from '@/lib/menu-data';

export default function OrderPage() {
  const { items, removeItem, updateItem, clearCart } = useCart();
  const { user } = useAuth();
  const [isCatering, setIsCatering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    date: '',
    headcount: '',
    specialRequests: '',
  });

  const cartDetails = items.map((cartItem) => {
    const menuItem = getMenuItem(cartItem.menuItemId);
    return { cartItem, menuItem };
  }).filter((d) => d.menuItem);

  const subtotal = cartDetails.reduce((sum, { cartItem, menuItem }) => {
    return sum + (menuItem!.price * cartItem.quantity);
  }, 0);

  const handleCheckout = async () => {
    if (!user) {
      window.location.href = '/auth/login?redirect=/order';
      return;
    }
    if (!form.name || !form.email || !form.phone || !form.date) return;
    if (items.length === 0) return;

    setLoading(true);
    try {
      const lineItems = cartDetails.map(({ cartItem, menuItem }) => ({
        name: formatCartItemLabel(menuItem!, cartItem.selections),
        price: menuItem!.price,
        quantity: cartItem.quantity,
      }));

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lineItems,
          customerEmail: form.email,
          metadata: {
            customerName: form.name,
            company: form.company,
            phone: form.phone,
            orderDate: form.date,
            headcount: form.headcount,
            specialRequests: form.specialRequests,
            isCatering: isCatering ? 'yes' : 'no',
            userId: user.id,
          },
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-text text-4xl sm:text-5xl">
            {isCatering ? 'Catering Order' : 'Your Order'}
          </h1>
          <div className="w-10 h-0.5 bg-amber mx-auto mt-4" />
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsCatering(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                !isCatering ? 'bg-amber text-bg' : 'bg-surface text-text-muted border border-border hover:border-border-hover'
              }`}
            >
              Regular Order
            </button>
            <button
              onClick={() => setIsCatering(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isCatering ? 'bg-amber text-bg' : 'bg-surface text-text-muted border border-border hover:border-border-hover'
              }`}
            >
              Catering
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-surface rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-text text-xl">
                  Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h2>
                {items.length > 0 && (
                  <button onClick={clearCart} className="text-crimson text-sm hover:text-crimson-hover transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <Image src="/images/icon-flame.svg" alt="" width={32} height={32} className="mx-auto mb-4 opacity-20" />
                  <p className="text-text-muted text-sm">Your cart is empty.</p>
                  <Link href="/menu" className="inline-block mt-3 text-amber hover:text-amber-hover transition-colors text-sm font-medium">
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartDetails.map(({ cartItem, menuItem }) => {
                    if (!menuItem) return null;
                    const label = formatCartItemLabel(menuItem, cartItem.selections);
                    return (
                      <div key={cartItem.cartId} className="flex items-start gap-4 bg-surface-hover rounded-lg p-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-text font-medium text-sm">{label}</p>
                          <p className="text-amber text-sm mt-1">${menuItem.price} each</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              if (cartItem.quantity <= 1) removeItem(cartItem.cartId);
                              else updateItem(cartItem.cartId, { quantity: cartItem.quantity - 1 });
                            }}
                            className="w-8 h-8 rounded border border-border text-text-muted text-sm flex items-center justify-center hover:border-amber hover:text-amber transition-colors"
                          >
                            &minus;
                          </button>
                          <span className="text-text font-medium text-sm w-6 text-center">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateItem(cartItem.cartId, { quantity: cartItem.quantity + 1 })}
                            className="w-8 h-8 rounded border border-border text-text-muted text-sm flex items-center justify-center hover:border-amber hover:text-amber transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(cartItem.cartId)}
                          className="text-text-faint hover:text-crimson transition-colors shrink-0"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-text font-display font-semibold text-lg">Subtotal</span>
                    <span className="text-amber font-display font-bold text-xl">${subtotal}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-surface rounded-xl border border-border p-6 sticky top-24">
              <h2 className="font-display font-semibold text-text text-xl mb-6">Order Details</h2>

              <div className="space-y-4">
                <FormField label="Name" required>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
                </FormField>

                {isCatering && (
                  <>
                    <FormField label="Company / Business">
                      <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Business name" />
                    </FormField>
                    <FormField label="Headcount">
                      <input type="number" min={1} value={form.headcount} onChange={(e) => setForm({ ...form, headcount: e.target.value })} placeholder="Number of guests" />
                    </FormField>
                  </>
                )}

                <FormField label="Email" required>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </FormField>

                <FormField label="Phone" required>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(301) 555-0123" />
                </FormField>

                <FormField label="Pickup / Delivery Date" required>
                  <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <p className="text-text-faint text-xs mt-1">Pickups ~1:00 PM · Deliveries ~2:00 PM</p>
                </FormField>

                <FormField label="Special Requests">
                  <textarea value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} rows={3} placeholder="Allergies, preferences, delivery instructions..." className="resize-none" />
                </FormField>

                {!user && (
                  <div className="bg-amber/5 border border-amber/20 rounded-lg p-4 text-center">
                    <p className="text-text-muted text-sm mb-2">Sign in to checkout and save your order history.</p>
                    <Link href="/auth/login?redirect=/order" className="text-amber font-medium text-sm hover:text-amber-hover transition-colors">
                      Sign In / Create Account
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0 || !form.name || !form.email || !form.phone || !form.date}
                  className={`w-full py-3.5 rounded-lg font-semibold text-base transition-colors ${
                    loading || items.length === 0
                      ? 'bg-surface-hover text-text-faint cursor-not-allowed'
                      : 'bg-crimson hover:bg-crimson-hover text-text'
                  }`}
                >
                  {loading ? 'Processing...' : `Checkout — $${subtotal}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="[&_input]:w-full [&_input]:bg-surface-hover [&_input]:border [&_input]:border-border [&_input]:rounded-lg [&_input]:px-4 [&_input]:py-3 [&_input]:text-text [&_input]:text-sm [&_input]:placeholder-text-faint [&_textarea]:w-full [&_textarea]:bg-surface-hover [&_textarea]:border [&_textarea]:border-border [&_textarea]:rounded-lg [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-text [&_textarea]:text-sm [&_textarea]:placeholder-text-faint">
      <label className="block text-text-muted text-xs font-medium uppercase tracking-wider mb-1.5">
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  );
}
