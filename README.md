# Swift Commerce

Modern React + Vite storefront with:
- public shop and checkout
- authenticated admin panel (products, orders, settings)
- optional M-Pesa STK flow through edge functions

## Stack

- React 19
- Vite 6
- React Router
- Tailwind CSS
- Supabase JS client

## Project Structure

- `src/` frontend app
- `supabase/migrations/` database schema
- `supabase/functions/` edge functions for M-Pesa flow
- `.env.example` environment template

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create environment file

```bash
cp .env.example .env
```

3. Fill `.env` values (use your real project keys/secrets)

4. Start development server

```bash
npm run dev
```

5. Open the app at the URL shown by Vite (usually `http://localhost:5173`)

## Environment Variables

See `.env.example` for the full template. Main values:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ENABLE_MPESA_PAYMENTS`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `NGROK_URL`

## Database Setup

1. Create a Supabase project
2. Run SQL from `supabase/migrations/20260413_init.sql`
3. (Optional) run `supabase/seed.sql`
4. Ensure `store-assets` bucket exists and is public
5. Create an admin user in Auth

## Admin Login

- Visit `/admin`
- Sign in with your Auth admin account
- Admin routes are protected by session

## Optional M-Pesa Setup

Deploy edge functions in `supabase/functions/`:

- `create-stk-push`
- `mpesa-callback`

Set function secrets in your backend project:

- `SUPABASE_SERVICE_ROLE_KEY`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`

Then set:

```bash
VITE_ENABLE_MPESA_PAYMENTS=true
```

## Build

```bash
npm run build
npm run preview
```

## Deploy (Vercel)

1. Import repository into Vercel
2. Add same environment variables from `.env`
3. Deploy

`vercel.json` already includes SPA rewrites for React Router.
