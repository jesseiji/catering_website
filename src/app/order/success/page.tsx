'use client';

import Link from 'next/link';
import Image from 'next/image';
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
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
            <Image src="/images/icon-flame.svg" alt="" width={40} height={40} />
          </div>
        </div>

        <h1 className="font-display font-bold text-gold text-glow-gold text-3xl sm:text-4xl mb-4">
          Order Confirmed!
        </h1>
        <p className="text-cream-dim text-base leading-relaxed mb-2">
          Your payment was successful. A receipt has been sent to your email.
        </p>
        <p className="text-cream-dim text-sm mb-8">
          Pickup at <span className="text-cream">2645 Shadyside Avenue, Suitland, MD 20746</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account"
            className="bg-gold hover:bg-gold-bright text-black font-semibold py-3 px-8 rounded-full transition-all hover:scale-105"
          >
            View Order History
          </Link>
          <Link
            href="/menu"
            className="bg-charcoal border border-gold/20 text-cream font-semibold py-3 px-8 rounded-full transition-all hover:border-gold/40"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
