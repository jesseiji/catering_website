# Hot Meals N High Heels x JWB Soul Catering

Soul food catering & food truck website for **Hot Meals N High Heels x JWB Soul Catering** — DC/Maryland area.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS v4
- **Auth & Database:** Supabase (email/password auth, order history)
- **Payments:** Stripe Checkout (hosted payment page with itemized line items)
- **Contact Form:** Formspree

## Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/catering_website.git
cd catering_website
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

**Supabase:** Create a project at [supabase.com](https://supabase.com), then grab the URL, anon key, and service role key from Settings > API.

**Stripe:** Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys). For the webhook secret, create a webhook endpoint pointing to `https://your-domain.com/api/webhook` listening for `checkout.session.completed` events.

**Formspree:** Create a form at [formspree.io](https://formspree.io) and paste the full endpoint URL.

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

## Placeholder Images

All images in `public/images/` are SVG placeholders. Replace these with real photos:

| File | Replace With |
|------|-------------|
| `hero-foodtruck-night.svg` | Food truck photo at night, city lights/neon vibe |
| `menu-meaty-lasagna.svg` | Photo of meaty lasagna dish |
| `menu-seafood-lasagna.svg` | Photo of seafood lasagna dish |
| `menu-salisbury-steak.svg` | Photo of Salisbury steak with sides |
| `menu-tuscan-salmon.svg` | Photo of Tuscan salmon & shrimp |
| `menu-shrimp-deviled-eggs.svg` | Photo of shrimp deviled eggs |
| `menu-deviled-eggs.svg` | Photo of regular deviled eggs |
| `menu-mash-potatoes.svg` | Photo of herbal garlic mash potatoes |
| `menu-chef-rice.svg` | Photo of chef rice |
| `menu-string-beans.svg` | Photo of string beans |
| `menu-coming-soon.svg` | Generic "coming soon" or dessert/drink teaser |

When replacing, update the file extensions in `src/lib/menu-data.ts` (change `.svg` to `.jpg` or `.webp`).

The brand SVG icons (`icon-flame.svg`, `icon-high-heel.svg`) can stay as-is or be replaced with custom brand assets.

## Pages

- **/** — Home page with hero, featured items, quick links
- **/menu** — Full menu organized by category
- **/order** — Cart + order form + Stripe Checkout
- **/contact** — Formspree contact form
- **/auth/login** — Sign in
- **/auth/signup** — Create account
- **/account** — Order history + reorder

## Deployment

Deploy to [Vercel](https://vercel.com) for the easiest setup:

1. Push to GitHub
2. Import the repo in Vercel
3. Add all env vars from `.env.example`
4. Set the Stripe webhook URL to `https://your-domain.vercel.app/api/webhook`
