/**
 * Run this ONCE after deploying, whenever your IPN URL changes (e.g. first
 * deploy, or switching from sandbox to live).
 *
 * Usage:
 *   npx tsx scripts/register-ipn.ts
 *
 * Requires these env vars to already be set (.env.local or shell):
 *   PESAPAL_CONSUMER_KEY, PESAPAL_CONSUMER_SECRET, PESAPAL_ENV, NEXT_PUBLIC_APP_URL
 *
 * It prints an ipn_id — copy that into PESAPAL_IPN_ID in your environment
 * variables (.env.local locally, and your host's env settings in production).
 */
import { registerIpnUrl } from "../lib/pesapal";

async function main() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    throw new Error("Set NEXT_PUBLIC_APP_URL first, e.g. https://shaurimoyosda.vercel.app");
  }

  const ipnUrl = `${appUrl}/api/payments/ipn`;
  console.log(`Registering IPN URL: ${ipnUrl}`);

  const ipnId = await registerIpnUrl(ipnUrl);
  console.log("\n✅ Success. Add this to your environment variables:\n");
  console.log(`PESAPAL_IPN_ID=${ipnId}\n`);
}

main().catch((err) => {
  console.error("❌ IPN registration failed:", err);
  process.exit(1);
});
