import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTransactionStatus, mapStatusCodeToInternal } from "@/lib/pesapal";

// Pesapal calls this URL directly (not the browser), so there is no session
// or cookie to trust — we re-fetch the authoritative status from Pesapal's
// API ourselves rather than trusting whatever fields arrive on the request.
export async function POST(req: NextRequest) {
  return handleIpn(req);
}

// Pesapal may also ping the IPN URL as a GET in some configurations.
export async function GET(req: NextRequest) {
  return handleIpn(req);
}

async function handleIpn(req: NextRequest) {
  try {
    let orderTrackingId: string | null = null;
    let orderMerchantReference: string | null = null;

    if (req.method === "GET") {
      orderTrackingId = req.nextUrl.searchParams.get("OrderTrackingId");
      orderMerchantReference = req.nextUrl.searchParams.get("OrderMerchantReference");
    } else {
      const body = await req.json().catch(() => ({}));
      orderTrackingId = body.OrderTrackingId || body.order_tracking_id || null;
      orderMerchantReference =
        body.OrderMerchantReference || body.order_merchant_reference || null;
    }

    if (!orderTrackingId) {
      return NextResponse.json({ error: "Missing OrderTrackingId" }, { status: 400 });
    }

    const txStatus = await getTransactionStatus(orderTrackingId);
    const internalStatus = mapStatusCodeToInternal(txStatus.status_code);
    const ref = orderMerchantReference || txStatus.merchant_reference;

    const { error } = await supabaseAdmin
      .from("donations")
      .update({
        status: internalStatus,
        confirmation_code: txStatus.confirmation_code || null,
        raw_ipn_payload: txStatus,
      })
      .eq("merchant_reference", ref);

    if (error) {
      console.error("IPN: failed to update donation:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    // Pesapal expects this exact echo shape to acknowledge receipt.
    return NextResponse.json({
      orderNotificationType: "IPNCHANGE",
      orderTrackingId,
      orderMerchantReference: ref,
      status: 200,
    });
  } catch (err) {
    console.error("IPN handling error:", err);
    return NextResponse.json({ error: "IPN processing failed" }, { status: 500 });
  }
}
