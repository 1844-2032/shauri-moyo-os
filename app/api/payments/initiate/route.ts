import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin, DonationFund, PaymentMethod } from "@/lib/supabase";
import { submitOrder } from "@/lib/pesapal";
import { isValidEmail, isValidKenyanPhone } from "@/lib/types";

const FUND_LABELS: Record<DonationFund, string> = {
  tithe_offering: "Tithe & Offering",
  building_fund: "Building Fund",
  missions_evangelism: "Missions & Evangelism",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fund,
      amount,
      donorName,
      donorPhone,
      donorEmail,
      paymentMethod,
    }: {
      fund: DonationFund;
      amount: number;
      donorName?: string;
      donorPhone?: string;
      donorEmail?: string;
      paymentMethod: PaymentMethod;
    } = body;

    // --- Validation -----------------------------------------------------
    if (!fund || !FUND_LABELS[fund]) {
      return NextResponse.json({ error: "Invalid fund." }, { status: 400 });
    }
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }
    if (paymentMethod !== "mpesa" && paymentMethod !== "card") {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }
    if (paymentMethod === "mpesa" && !donorPhone) {
      return NextResponse.json(
        { error: "Phone number is required for M-Pesa." },
        { status: 400 }
      );
    }
    if (paymentMethod === "mpesa" && donorPhone && !isValidKenyanPhone(donorPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid Kenyan phone number (e.g. 07XX XXX XXX)." },
        { status: 400 }
      );
    }
    if (donorEmail && !isValidEmail(donorEmail)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Look up the fund's real id — the donations table stores fund_id,
    // not the slug used by the giving form.
    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) {
      return NextResponse.json({ error: "Church ID not configured." }, { status: 500 });
    }

    const { data: fundRow, error: fundError } = await supabaseAdmin
      .from("funds")
      .select("id")
      .eq("church_id", churchId)
      .eq("slug", fund)
      .single();

    if (fundError || !fundRow) {
      console.error("Fund lookup error:", fundError);
      return NextResponse.json({ error: "This fund isn't set up yet. Please contact us." }, { status: 500 });
    }

    // --- Create a pending record first, so we never lose track of an
    // attempted gift even if Pesapal or the network fails after this. ----
    const merchantReference = `SMC-${Date.now()}-${randomUUID().slice(0, 8)}`;

    // The public form only knows "mpesa" / "card" — the donations table's
    // payment_method column expects the more specific Pesapal-rail values.
    const dbPaymentMethod = paymentMethod === "mpesa" ? "mpesa_pesapal" : "card_pesapal";

    const { error: insertError } = await supabaseAdmin.from("donations").insert({
      church_id: churchId,
      fund_id: fundRow.id,
      amount,
      currency: "KES",
      donor_name: donorName || null,
      donor_phone: donorPhone || null,
      donor_email: donorEmail || null,
      payment_method: dbPaymentMethod,
      merchant_reference: merchantReference,
      status: "PENDING",
      entry_method: "automatic",
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ error: "Could not start the gift record." }, { status: 500 });
    }

    // --- Submit the order to Pesapal ------------------------------------
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const { orderTrackingId, redirectUrl } = await submitOrder({
      merchantReference,
      amount,
      currency: "KES",
      description: `${FUND_LABELS[fund]} — Shauri Moyo SDA Church`,
      callbackUrl: `${appUrl}/give/callback?ref=${merchantReference}`,
      donorEmail,
      donorPhone,
      donorName,
    });

    await supabaseAdmin
      .from("donations")
      .update({ pesapal_order_tracking_id: orderTrackingId })
      .eq("merchant_reference", merchantReference);

    return NextResponse.json({ redirectUrl, merchantReference });
  } catch (err) {
    console.error("Payment initiation error:", err);
    return NextResponse.json(
      { error: "Something went wrong starting your gift. Please try again." },
      { status: 500 }
    );
  }
}
