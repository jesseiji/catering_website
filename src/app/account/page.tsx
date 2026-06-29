'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  metadata: Record<string, string>;
}

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { addItem } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/login?redirect=/account');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data);
        setLoadingOrders(false);
      });
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
    return <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>;
  }
  if (!user) return null;

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-text text-3xl sm:text-4xl">My Account</h1>
            <p className="text-text-faint text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-surface border border-border text-text-muted px-5 py-2 rounded-lg text-sm hover:border-border-hover hover:text-text transition-colors"
          >
            Sign Out
          </button>
        </div>

        <h2 className="font-display font-semibold text-text text-xl mb-6">Order History</h2>

        {loadingOrders ? (
          <p className="text-text-muted text-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-surface rounded-xl border border-border p-10 text-center">
            <p className="text-text-muted text-sm mb-2">No orders yet.</p>
            <a href="/menu" className="text-amber text-sm font-medium hover:text-amber-hover transition-colors">Browse the menu</a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-surface rounded-xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-text font-medium text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-amber font-display font-bold text-lg mt-0.5">${order.total}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider ${
                      order.status === 'completed' ? 'bg-green-900/20 text-green-400' :
                      order.status === 'pending' ? 'bg-amber/10 text-amber' :
                      'bg-surface-hover text-text-muted'
                    }`}>{order.status}</span>
                    <button onClick={() => handleReorder(order)} className="text-amber text-sm font-medium hover:text-amber-hover transition-colors">
                      Reorder
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-text-muted text-sm">{item.quantity}x {item.name} — ${item.price * item.quantity}</p>
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
