# Hot Meals N High Heels x JWB Soul Catering

Soul food catering & food truck website for **Hot Meals N High Heels x JWB Soul Catering** — DC/Maryland area.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS v4
- **Auth & Database:** Supabase (email/password auth, order history)
- **Payments:** Stripe Checkout (hosted payment page with itemized line items)
- **Contact Form:** Resend (server-side API route)

## Setup

### 1. Clone and install

```bash
git clone https://github.com/jesseiji/catering_website.git
cd catering_website
npm install
```

### 2. Configure environment variables

All env vars are set in **Vercel** under Project Settings > Environment Variables. See `.env.example` for the full list.

For local development, create a `.env.local` from the example:

```bash
cp .env.example .env.local
```

**Supabase:** Create a project at [supabase.com](https://supabase.com), then grab the URL, anon key, and service role key from Settings > API.

**Stripe:** Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys). For the webhook secret, create a webhook endpoint pointing to `https://your-domain.vercel.app/api/webhook` listening for `checkout.session.completed` events.

**Resend:** Sign up at [resend.com](https://resend.com), get your API key, and verify a sending domain (or use `onboarding@resend.dev` for testing). Set `CONTACT_EMAIL` to the email address where you want to receive contact form submissions.

### 3. Set up the Supabase database

Run this SQL in your Supabase SQL Editor to create the orders table:

```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  stripe_session_id text,
  total numeric not null,
  status text default 'completed',
  items jsonb not null,
  metadata jsonb,
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view their own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Service role can insert orders"
  on orders for insert
  with check (true);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Images

Food photos in `public/images/` are sourced from [Pexels](https://pexels.com) (free for commercial use, no attribution required). Replace with your own photos for a more authentic look:

| File | Replace With |
|------|-------------|
| `hero-foodtruck-night.jpg` | Your food truck photo at night |
| `menu-meaty-lasagna.jpg` | Your meaty lasagna dish |
| `menu-seafood-lasagna.jpg` | Your seafood lasagna dish |
| `menu-salisbury-steak.jpg` | Your Salisbury steak with sides |
| `menu-tuscan-salmon.jpg` | Your Tuscan salmon & shrimp |
| `menu-shrimp-deviled-eggs.jpg` | Your shrimp deviled eggs |
| `menu-deviled-eggs.jpg` | Your regular deviled eggs |
| `menu-mash-potatoes.jpg` | Your herbal garlic mash potatoes |
| `menu-chef-rice.jpg` | Your chef rice |
| `menu-string-beans.jpg` | Your string beans |

When replacing, keep the same filenames or update the paths in `src/lib/menu-data.ts`.

## Pages

- **/** — Home page with hero, featured items, quick links
- **/menu** — Full menu organized by category
- **/order** — Cart + order form + Stripe Checkout
- **/contact** — Contact form (Resend API)
- **/auth/login** — Sign in
- **/auth/signup** — Create account
- **/account** — Order history + reorder

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in Vercel
3. Add all env vars from `.env.example` under Project Settings > Environment Variables
4. Set the Stripe webhook URL to `https://your-domain.vercel.app/api/webhook`
5. Deploy — Vercel auto-detects Next.js, no build config needed
