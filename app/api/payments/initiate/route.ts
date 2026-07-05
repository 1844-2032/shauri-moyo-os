import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin, DonationFund, PaymentMethod } from "@/lib/supabase";
import { submitOrder } from "@/lib/pesapal";

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

    // --- Create a pending record first, so we never lose track of an
    // attempted gift even if Pesapal or the network fails after this. ----
    const merchantReference = `SMC-${Date.now()}-${randomUUID().slice(0, 8)}`;

    const { error: insertError } = await supabaseAdmin.from("donations").insert({
      fund,
      amount,
      currency: "KES",
      donor_name: donorName || null,
      donor_phone: donorPhone || null,
      donor_email: donorEmail || null,
      payment_method: paymentMethod,
      merchant_reference: merchantReference,
      status: "PENDING",
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
