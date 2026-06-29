import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata || {};

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    const items = lineItems.data.map((li) => ({
      name: li.description || '',
      price: (li.amount_total || 0) / 100,
      quantity: li.quantity || 1,
    }));

    const total = (session.amount_total || 0) / 100;

    if (metadata.userId) {
      await supabaseAdmin.from('orders').insert({
        user_id: metadata.userId,
        stripe_session_id: session.id,
        total,
        status: 'completed',
        items,
        metadata: {
          customerName: metadata.customerName,
          company: metadata.company,
          phone: metadata.phone,
          orderDate: metadata.orderDate,
          headcount: metadata.headcount,
          specialRequests: metadata.specialRequests,
          isCatering: metadata.isCatering,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
