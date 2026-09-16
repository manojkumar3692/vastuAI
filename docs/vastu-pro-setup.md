# VastuCheck Pro deployment setup

## 1. Supabase

Open the Supabase SQL Editor and run:

`supabase/migrations/202609160001_vastu_pro.sql`

This creates the private account, session, purchase and report tables, the
private `vastu-reports` storage bucket, and the atomic credit functions.

Configure these environment variables locally and in Vercel Production:

```ini
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_REPLACE_ME
```

The secret key is server-only. Never prefix it with `NEXT_PUBLIC_`, commit it,
or paste it into chat.

## 2. Razorpay Pro Payment Button

Create a dedicated Quick Pay Payment Button with:

- Title: `VastuCheck Pro - 10 Reports`
- Fixed amount: `₹799`
- Required fields: email and phone
- Redirect URL: `https://vastucheck.in/pro/payment-status`

The current production button ID is already included in the app:

`pl_Tcc8NVF7hRYK6a`

An environment variable can still override it later if the button changes:

```ini
NEXT_PUBLIC_RAZORPAY_PRO_BUTTON_ID=pl_REPLACEMENT_BUTTON_ID
```

## 3. Razorpay webhook

The dedicated webhook URL must be:

`https://vastucheck.in/api/webhooks/razorpay-vastu`

Select `payment.captured` and `payment.failed`. Generate a separate random
secret and save the same value in Razorpay and Vercel Production:

```ini
RAZORPAY_VASTU_WEBHOOK_SECRET=REPLACE_WITH_RANDOM_SECRET
```

Do not use the older `houseofeon.in` URL for this deployment.

## 4. Safe launch order

1. Run the Supabase migration.
2. Add all environment variables to Vercel.
3. Create the ₹799 Payment Button and configure its redirect.
4. Update the webhook URL and secret in Razorpay.
5. Deploy this project.
6. Register a test account using a real-format Indian phone number.
7. Complete a Razorpay test payment using the exact same number.
8. Confirm the webhook log returns HTTP 200 and the account receives 10 credits.
9. Generate a report, confirm the balance falls to 9, and confirm the saved PDF
   downloads from My Reports.

## Local end-to-end test without paying

This tests the real local webhook signature validation and credit flow without
contacting Razorpay or moving money.

1. Run the Supabase migration and configure `SUPABASE_URL`,
   `SUPABASE_SECRET_KEY`, and `RAZORPAY_VASTU_WEBHOOK_SECRET` in `.env.local`.
2. Start the app with `npm run dev`.
3. Open `http://localhost:3000/vastu-pro` and register a new account.
4. Keep the account on the payment step. In a second terminal run:

   ```bash
   npm run test:pro-payment -- 9876543210
   ```

   Replace the example with the same mobile number used during registration.
5. Open `http://localhost:3000/pro/payment-status` or `/my-reports`. The balance
   should be 10.
6. Generate one complete report through `/vastu`; the balance should become 9,
   and the saved PDF should be downloadable again from `/my-reports`.

Each run creates a new unique test payment ID. It can only activate an account
whose checkout window is currently pending.
