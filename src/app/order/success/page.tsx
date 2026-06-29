'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function OrderSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display font-bold text-text text-3xl sm:text-4xl mb-4">
          Order Confirmed
        </h1>
        <p className="text-text-muted text-sm leading-relaxed mb-2">
          Your payment was successful. A receipt has been sent to your email.
        </p>
        <p className="text-text-faint text-sm mb-8">
          Pickup at 2645 Shadyside Avenue, Suitland, MD 20746
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account" className="bg-amber hover:bg-amber-hover text-bg font-medium py-3 px-8 rounded-lg transition-colors text-sm">
            View Order History
          </Link>
          <Link href="/menu" className="bg-surface border border-border text-text font-medium py-3 px-8 rounded-lg transition-colors hover:border-border-hover text-sm">
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
