import { createClient } from "@supabase/supabase-js";

// SERVER-SIDE ONLY. Never import this file from a "use client" component.
// It uses the service role key, which bypasses Row Level Security —
// that's intentional here because the donations table has no public
// policies at all. All access must go through our own API routes.

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export type DonationFund =
  | "tithe_offering"
  | "building_fund"
  | "missions_evangelism";

export type PaymentMethod = "mpesa" | "card";

export interface DonationRecord {
  id: string;
  fund: DonationFund;
  amount: number;
  currency: string;
  donor_name: string | null;
  donor_phone: string | null;
  donor_email: string | null;
  payment_method: PaymentMethod;
  merchant_reference: string;
  pesapal_order_tracking_id: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
  confirmation_code: string | null;
}
