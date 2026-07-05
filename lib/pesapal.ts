// Pesapal API v3 integration
// Docs: https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-overview
//
// One gateway, two rails: Pesapal's checkout page itself offers M-Pesa
// (STK push) and card as payment options to the giver — you do not need
// your own Safaricom Daraja Paybill/Till or consumer key for this.
// If you later want a dedicated church Paybill instead of Pesapal's
// shared pool, ask and we'll swap in direct Daraja STK push.

const PESAPAL_ENV = process.env.PESAPAL_ENV === "live" ? "live" : "sandbox";

const BASE_URL =
  PESAPAL_ENV === "live"
    ? "https://pay.pesapal.com/v3"
    : "https://cybqa.pesapal.com/pesapalv3";

const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET!;

interface AuthTokenResponse {
  token: string;
  expiryDate: string;
  error: unknown;
  status: string;
  message: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAuthToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const res = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: CONSUMER_KEY,
      consumer_secret: CONSUMER_SECRET,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Pesapal auth failed: ${res.status} ${await res.text()}`);
  }

  const data: AuthTokenResponse = await res.json();
  if (!data.token) {
    throw new Error(`Pesapal auth returned no token: ${data.message}`);
  }

  // Pesapal tokens are valid ~5 minutes; cache for 4 to be safe.
  cachedToken = { token: data.token, expiresAt: Date.now() + 4 * 60_000 };
  return data.token;
}

interface RegisterIpnResponse {
  url: string;
  created_date: string;
  ipn_id: string;
  error: unknown;
  status: string;
}

/**
 * One-time setup call — registers your IPN (webhook) URL with Pesapal and
 * returns an ipn_id you store in PESAPAL_IPN_ID. Run this once via the
 * scripts/register-ipn.ts helper, not on every request.
 */
export async function registerIpnUrl(ipnUrl: string): Promise<string> {
  const token = await getAuthToken();
  const res = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url: ipnUrl, ipn_notification_type: "POST" }),
  });

  if (!res.ok) {
    throw new Error(`IPN registration failed: ${res.status} ${await res.text()}`);
  }

  const data: RegisterIpnResponse = await res.json();
  if (!data.ipn_id) {
    throw new Error(`IPN registration returned no ipn_id`);
  }
  return data.ipn_id;
}

export interface SubmitOrderParams {
  merchantReference: string;
  amount: number;
  currency: string;
  description: string;
  callbackUrl: string;
  donorEmail?: string;
  donorPhone?: string;
  donorName?: string;
}

interface SubmitOrderResponse {
  order_tracking_id: string;
  merchant_reference: string;
  redirect_url: string;
  error: { error_type?: string; code?: string; message?: string } | null;
  status: string;
}

export async function submitOrder(
  params: SubmitOrderParams
): Promise<{ orderTrackingId: string; redirectUrl: string }> {
  const token = await getAuthToken();
  const ipnId = process.env.PESAPAL_IPN_ID!;

  const [firstName, ...rest] = (params.donorName || "Friend of Shauri Moyo").split(" ");

  const res = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: params.merchantReference,
      currency: params.currency,
      amount: params.amount,
      description: params.description.slice(0, 100),
      callback_url: params.callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: params.donorEmail || undefined,
        phone_number: params.donorPhone || undefined,
        first_name: firstName,
        last_name: rest.join(" ") || undefined,
        country_code: "KE",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Pesapal order submission failed: ${res.status} ${await res.text()}`);
  }

  const data: SubmitOrderResponse = await res.json();
  if (data.error || !data.redirect_url) {
    throw new Error(`Pesapal order error: ${JSON.stringify(data.error)}`);
  }

  return { orderTrackingId: data.order_tracking_id, redirectUrl: data.redirect_url };
}

export interface TransactionStatus {
  payment_method: string;
  amount: number;
  created_date: string;
  confirmation_code: string;
  payment_status_description: "Completed" | "Failed" | "Pending" | "Reversed" | string;
  description: string;
  message: string;
  payment_account: string;
  status_code: number; // 0 invalid, 1 completed, 2 failed, 3 reversed
  merchant_reference: string;
}

export async function getTransactionStatus(
  orderTrackingId: string
): Promise<TransactionStatus> {
  const token = await getAuthToken();
  const res = await fetch(
    `${BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Pesapal status check failed: ${res.status} ${await res.text()}`);
  }

  return res.json();
}

export function mapStatusCodeToInternal(
  statusCode: number
): "COMPLETED" | "FAILED" | "PENDING" | "REVERSED" {
  switch (statusCode) {
    case 1:
      return "COMPLETED";
    case 2:
      return "FAILED";
    case 3:
      return "REVERSED";
    default:
      return "PENDING";
  }
}
