# Payments setup guide — M-Pesa & Card via Pesapal

This connects the "Give" page to real money movement. Givers see one
checkout page where they choose M-Pesa (STK push to their phone) or card —
Pesapal handles both, so you do **not** need your own Safaricom Daraja
Paybill/Till or API keys to get started.

Work through this in order. Total time: 30–45 minutes.

---

## 1. Create your Supabase project (10 min)

1. Go to [supabase.com](https://supabase.com) → sign up → **New project**.
2. Name it `shauri-moyo-os`, choose a region close to Kenya (e.g. `eu-central` or `eu-west`), set a database password (save it somewhere safe — you won't need it for this integration, but keep it).
3. Once created, go to **SQL Editor** → **New query**, paste the contents of `supabase/schema.sql` from this project, and run it. This creates the `donations` table.
4. Go to **Settings → API**. Copy two values:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role secret** (NOT `anon public`) → this is `SUPABASE_SERVICE_ROLE_KEY`

   ⚠️ The service role key bypasses all access rules. Never put it in a file that ships to the browser, never commit it to a public GitHub repo. It only belongs in environment variables on your server/hosting provider.

5. Install the Supabase client library:
   ```
   npm install @supabase/supabase-js
   ```

---

## 2. Create your Pesapal merchant account (10–15 min)

1. Go to [pesapal.com](https://www.pesapal.com) → **Sign up** as a merchant (choose Kenya).
2. You'll need: church/organization name, a contact email and phone, and basic KYC details (some accounts ask for a certificate of registration or similar — a church can usually register as a non-profit/organization; if Pesapal asks for documents you don't have yet, you can complete sandbox testing while that's pending).
3. For **testing first** (recommended): Pesapal provides a sandbox environment automatically — register at [developer.pesapal.com](https://developer.pesapal.com) to get sandbox credentials immediately, separate from your live merchant approval. This lets you build and test the whole flow today, before your live account is even approved.
4. Once logged in (sandbox or live), go to **Account Settings → API Keys** and copy:
   - **Consumer Key** → `PESAPAL_CONSUMER_KEY`
   - **Consumer Secret** → `PESAPAL_CONSUMER_SECRET`

---

## 3. Set environment variables

1. Copy `.env.example` to `.env.local` in the project root.
2. Fill in everything you have so far:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   PESAPAL_CONSUMER_KEY=...
   PESAPAL_CONSUMER_SECRET=...
   PESAPAL_ENV=sandbox
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
   Leave `PESAPAL_IPN_ID` blank for now — next step fills it in.

---

## 4. Register your IPN (webhook) URL — one time

Pesapal needs to know where to notify you when a payment completes. Locally this requires a public URL (Pesapal can't reach `localhost`), so do this step **after your first deploy to Vercel**, using your live Vercel URL.

1. Deploy to Vercel first (push to GitHub, import to Vercel as before — the README in this repo covers that). Set all the environment variables above in **Vercel → Project → Settings → Environment Variables** too.
2. Once deployed, update `NEXT_PUBLIC_APP_URL` (both locally and in Vercel) to your real URL, e.g. `https://shaurimoyosda.vercel.app`.
3. Run, with your env vars loaded:
   ```
   npx tsx scripts/register-ipn.ts
   ```
4. It prints something like:
   ```
   PESAPAL_IPN_ID=8a2b1c3d-...
   ```
   Copy that value into `PESAPAL_IPN_ID` in **both** `.env.local` and Vercel's environment variables, then redeploy (Vercel → Deployments → Redeploy) so the new value takes effect.

If you ever change your domain, repeat this step — IPN URLs are tied to the domain you registered.

---

## 5. Test end-to-end (sandbox)

1. With `PESAPAL_ENV=sandbox`, visit `/give` on your deployed site.
2. Fill in an amount, choose M-Pesa or Card, submit.
3. You'll be redirected to Pesapal's sandbox checkout. Use Pesapal's published sandbox test credentials (sandbox card numbers / test M-Pesa numbers — these are listed in the Pesapal developer docs under "Testing") to simulate a payment.
4. You should land back on `/give/callback`, see "Confirming your gift…", then either a success or failure message within a few seconds.
5. Check **Supabase → Table Editor → donations** — you should see a row with `status = COMPLETED` (or `FAILED`) and a `confirmation_code`.

If the callback page hangs on "Confirming" indefinitely, the most common cause is the IPN URL not registered correctly, or `PESAPAL_IPN_ID` not matching what you registered — re-run step 4.

---

## 6. Go live

1. Get your Pesapal merchant account fully verified (live KYC approval).
2. Get live API keys from your live Pesapal dashboard (same place as sandbox, different environment).
3. Update environment variables in Vercel:
   ```
   PESAPAL_ENV=live
   PESAPAL_CONSUMER_KEY=<live key>
   PESAPAL_CONSUMER_SECRET=<live secret>
   ```
4. Re-run `scripts/register-ipn.ts` against the live environment to get a **new** `PESAPAL_IPN_ID` (sandbox and live IPN registrations are separate) and update it.
5. Redeploy. Do one small real test gift yourself (e.g. KES 10) before announcing to the congregation.

---

## What this gives you operationally

- Every attempted gift is recorded in Supabase the moment the giver clicks "Give," even before payment completes — so you can always reconcile, follow up on abandoned payments, or investigate a dispute.
- Treasury can query the `donations` table directly in Supabase (Table Editor, or SQL) filtered by `fund`, `status = 'COMPLETED'`, and date range for reporting — this is also the foundation for the Treasurer dashboard in the next phase.
- Nothing here requires you to handle card numbers or M-Pesa PINs directly — Pesapal's hosted checkout does that, which keeps you out of PCI-DSS scope.

## Suggested next step

Once this is tested and live, the natural follow-on is the **Treasurer dashboard** (login-gated view of the `donations` table — totals by fund, date filters, CSV export) since the data is now flowing in. Say the word when you're ready and we'll build that next.
