'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  metadata: Record<string, string>;
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?redirect=/account');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [user]);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        menuItemId: item.name.split(' — ')[0].toLowerCase().replace(/\s+/g, '-'),
        quantity: item.quantity,
        selections: {},
        cartId: crypto.randomUUID(),
      });
    });
    router.push('/order');
  };

  if (authLoading) {
    return (
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <p className="text-cream-dim">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-gold text-glow-gold text-3xl sm:text-4xl">
              My Account
            </h1>
            <p className="text-cream-dim text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-charcoal border border-gold/20 text-cream-dim px-5 py-2 rounded-full text-sm hover:border-gold/40 hover:text-cream transition-all"
          >
            Sign Out
          </button>
        </div>

        <h2 className="font-display font-semibold text-cream text-xl mb-6">Order History</h2>

        {loadingOrders ? (
          <p className="text-cream-dim">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-charcoal rounded-2xl border border-gold/10 p-10 text-center">
            <Image src="/images/icon-high-heel.svg" alt="" width={32} height={32} className="mx-auto mb-4 opacity-30" />
            <p className="text-cream-dim mb-2">No orders yet.</p>
            <a href="/menu" className="text-gold text-sm font-medium hover:text-gold-bright transition-colors">
              Browse the menu to get started
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-charcoal rounded-2xl border border-gold/10 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-cream font-medium text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-gold font-display font-bold text-lg mt-0.5">${order.total}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                      order.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                      order.status === 'pending' ? 'bg-gold/10 text-gold' :
                      'bg-charcoal-light text-cream-dim'
                    }`}>
                      {order.status}
                    </span>
                    <button
                      onClick={() => handleReorder(order)}
                      className="text-gold text-sm font-medium hover:text-gold-bright transition-colors"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-cream-dim text-sm">
                      {item.quantity}x {item.name} — ${item.price * item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
