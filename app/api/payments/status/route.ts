import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTransactionStatus, mapStatusCodeToInternal } from "@/lib/pesapal";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  const { data: donation, error } = await supabaseAdmin
    .from("donations")
    .select("status, amount, pesapal_order_tracking_id, confirmation_code, funds(name)")
    .eq("merchant_reference", ref)
    .single();

  if (error || !donation) {
    return NextResponse.json({ error: "Gift record not found." }, { status: 404 });
  }

  // If the IPN hasn't landed yet, double-check directly with Pesapal so the
  // giver isn't stuck looking at "pending" longer than necessary.
  if (donation.status === "PENDING" && donation.pesapal_order_tracking_id) {
    try {
      const txStatus = await getTransactionStatus(donation.pesapal_order_tracking_id);
      const internalStatus = mapStatusCodeToInternal(txStatus.status_code);
      if (internalStatus !== "PENDING") {
        await supabaseAdmin
          .from("donations")
          .update({
            status: internalStatus,
            confirmation_code: txStatus.confirmation_code || null,
            raw_ipn_payload: txStatus,
          })
          .eq("merchant_reference", ref);
        donation.status = internalStatus;
        donation.confirmation_code = txStatus.confirmation_code;
      }
    } catch (err) {
      console.error("Status re-check against Pesapal failed:", err);
      // Fall through and return whatever we have in Supabase.
    }
  }

  return NextResponse.json(donation);
}
