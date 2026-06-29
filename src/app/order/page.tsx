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
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display font-black text-gold text-glow-gold text-4xl sm:text-5xl">
            {isCatering ? 'Catering Order' : 'Your Order'}
          </h1>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setIsCatering(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !isCatering ? 'bg-gold text-black' : 'bg-charcoal text-cream-dim border border-gold/20 hover:border-gold/40'
              }`}
            >
              Regular Order
            </button>
            <button
              onClick={() => setIsCatering(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                isCatering ? 'bg-gold text-black' : 'bg-charcoal text-cream-dim border border-gold/20 hover:border-gold/40'
              }`}
            >
              Catering
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Cart */}
          <div className="lg:col-span-3">
            <div className="bg-charcoal rounded-2xl border border-gold/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-cream text-xl">
                  Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h2>
                {items.length > 0 && (
                  <button onClick={clearCart} className="text-red text-sm hover:text-red-glow transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12">
                  <Image src="/images/icon-flame.svg" alt="" width={40} height={40} className="mx-auto mb-4 opacity-30" />
                  <p className="text-cream-dim">Your cart is empty.</p>
                  <Link href="/menu" className="inline-block mt-4 text-gold hover:text-gold-bright transition-colors text-sm font-medium">
                    Browse the menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartDetails.map(({ cartItem, menuItem }) => {
                    if (!menuItem) return null;
                    const label = formatCartItemLabel(menuItem, cartItem.selections);
                    return (
                      <div key={cartItem.cartId} className="flex items-start gap-4 bg-charcoal-light rounded-xl p-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-cream font-medium text-sm">{label}</p>
                          <p className="text-gold text-sm mt-1">${menuItem.price} each</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              if (cartItem.quantity <= 1) {
                                removeItem(cartItem.cartId);
                              } else {
                                updateItem(cartItem.cartId, { quantity: cartItem.quantity - 1 });
                              }
                            }}
                            className="w-8 h-8 rounded-lg border border-gold/20 text-gold text-sm flex items-center justify-center hover:bg-gold/10 transition"
                          >
                            -
                          </button>
                          <span className="text-cream font-semibold text-sm w-6 text-center">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateItem(cartItem.cartId, { quantity: cartItem.quantity + 1 })}
                            className="w-8 h-8 rounded-lg border border-gold/20 text-gold text-sm flex items-center justify-center hover:bg-gold/10 transition"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(cartItem.cartId)}
                          className="text-cream-dim hover:text-red transition-colors shrink-0"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}

                  <div className="flex justify-between items-center pt-4 border-t border-gold/10">
                    <span className="text-cream font-display font-semibold text-lg">Subtotal</span>
                    <span className="text-gold font-display font-bold text-xl">${subtotal}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Details Form */}
          <div className="lg:col-span-2">
            <div className="bg-charcoal rounded-2xl border border-gold/10 p-6 sticky top-24">
              <h2 className="font-display font-semibold text-cream text-xl mb-6">Order Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40"
                    placeholder="Your full name"
                  />
                </div>

                {isCatering && (
                  <>
                    <div>
                      <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                        Company / Business
                      </label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40"
                        placeholder="Business name"
                      />
                    </div>
                    <div>
                      <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                        Headcount
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={form.headcount}
                        onChange={(e) => setForm({ ...form, headcount: e.target.value })}
                        className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40"
                        placeholder="Number of guests"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40"
                    placeholder="(301) 555-0123"
                  />
                </div>

                <div>
                  <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                    Pickup / Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm"
                  />
                  <p className="text-cream-dim/60 text-xs mt-1">Pickups ~1:00 PM, Deliveries ~2:00 PM</p>
                </div>

                <div>
                  <label className="block text-cream-dim text-xs font-medium uppercase tracking-wider mb-1.5">
                    Special Requests
                  </label>
                  <textarea
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full bg-charcoal-light border border-gold/10 rounded-xl px-4 py-3 text-cream text-sm placeholder-cream-dim/40 resize-none"
                    placeholder="Allergies, preferences, delivery instructions..."
                  />
                </div>

                {!user && (
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 text-center">
                    <p className="text-cream-dim text-sm mb-2">Sign in to checkout and save your order history.</p>
                    <Link href="/auth/login?redirect=/order" className="text-gold font-semibold text-sm hover:text-gold-bright transition-colors">
                      Sign In / Create Account
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0 || !form.name || !form.email || !form.phone || !form.date}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    loading || items.length === 0
                      ? 'bg-charcoal-light text-cream-dim/40 cursor-not-allowed'
                      : 'bg-red hover:bg-red-glow text-cream hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-red/20'
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
