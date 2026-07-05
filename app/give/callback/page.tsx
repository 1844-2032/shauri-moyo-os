"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "PENDING" | "COMPLETED" | "FAILED" | "REVERSED" | "loading" | "error";

export default function GiveCallback() {
  return (
    <Suspense
      fallback={
        <section className="py-20 px-8 min-h-[60vh] flex items-center justify-center">
          <div className="card max-w-[480px] w-full text-center">
            <h1 className="text-xl font-display mb-2">Confirming your gift&hellip;</h1>
          </div>
        </section>
      }
    >
      <GiveCallbackInner />
    </Suspense>
  );
}

function GiveCallbackInner() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") || searchParams.get("OrderMerchantReference");
  const [status, setStatus] = useState<Status>("loading");
  const [details, setDetails] = useState<{ amount?: number; fund?: string; confirmation_code?: string }>({});

  useEffect(() => {
    if (!ref) {
      setStatus("error");
      return;
    }

    let attempts = 0;
    const poll = async () => {
      try {
        const res = await fetch(`/api/payments/status?ref=${encodeURIComponent(ref)}`);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setDetails(data);
        setStatus(data.status);

        // Keep polling while pending — IPN can take a few seconds to land.
        attempts += 1;
        if (data.status === "PENDING" && attempts < 10) {
          setTimeout(poll, 3000);
        }
      } catch {
        setStatus("error");
      }
    };

    poll();
  }, [ref]);

  return (
    <section className="py-20 px-8 min-h-[60vh] flex items-center justify-center">
      <div className="card max-w-[480px] w-full text-center">
        {status === "loading" || status === "PENDING" ? (
          <>
            <h1 className="text-xl font-display mb-2">Confirming your gift&hellip;</h1>
            <p className="text-sm text-ink-soft">
              This usually takes a few seconds. Please don&apos;t close this page.
            </p>
          </>
        ) : status === "COMPLETED" ? (
          <>
            <h1 className="text-xl font-display mb-2 text-sage-deep">Thank you!</h1>
            <p className="text-sm text-ink-soft mb-1">
              Your gift of KES {details.amount?.toLocaleString()} has been received.
            </p>
            {details.confirmation_code && (
              <p className="text-[12.5px] text-ink-soft">
                Confirmation: {details.confirmation_code}
              </p>
            )}
            <Link href="/" className="btn-primary mt-5 inline-block">Back to home</Link>
          </>
        ) : status === "FAILED" || status === "REVERSED" ? (
          <>
            <h1 className="text-xl font-display mb-2">Payment not completed</h1>
            <p className="text-sm text-ink-soft mb-5">
              Your gift wasn&apos;t processed. No charge was made. You can try again.
            </p>
            <Link href="/give" className="btn-primary inline-block">Try again</Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-display mb-2">Something went wrong</h1>
            <p className="text-sm text-ink-soft mb-5">
              We couldn&apos;t find this gift record. If you were charged, please contact us.
            </p>
            <Link href="/resources#contact" className="btn-primary inline-block">Contact us</Link>
          </>
        )}
      </div>
    </section>
  );
}
