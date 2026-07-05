"use client";
import { useState } from "react";

export default function PrayerRequest() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requestText, setRequestText] = useState("");
  const [confidential, setConfidential] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!requestText.trim()) return setError("Please share what you'd like us to pray for.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName || undefined,
          phone: phone || undefined,
          email: email || undefined,
          request_text: requestText,
          is_confidential: confidential,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSuccess(data.message);
      setFullName(""); setPhone(""); setEmail(""); setRequestText(""); setConfidential(false);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Prayer ministry</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Request prayer</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            &ldquo;Is anyone among you suffering? Let him pray.&rdquo; Share what&apos;s on your heart &mdash; our prayer team will carry it with you.
          </p>
        </div>
      </section>

      <section className="py-12 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div className="card">
            {success ? (
              <div className="text-[13.5px] text-green-800 bg-green-50 border border-green-200 rounded-card px-4 py-4">
                {success}
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-card px-3 py-2.5">
                    {error}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold mb-1.5">What would you like us to pray for?</label>
                  <textarea placeholder="Share as much or as little as you'd like" className="form-input min-h-[110px]" value={requestText} onChange={(e) => setRequestText(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Full name (optional)</label>
                    <input type="text" placeholder="Your name" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Phone (optional)</label>
                    <input type="text" placeholder="07XX XXX XXX" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold mb-1.5">Email (optional)</label>
                  <input type="email" placeholder="you@example.com" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-auto" checked={confidential} onChange={(e) => setConfidential(e.target.checked)} />
                    Keep this confidential (shared with pastoral staff only)
                  </label>
                </div>
                <button type="button" className="btn-primary w-full disabled:opacity-60" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? "Submitting…" : "Submit prayer request"}
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="card">
              <h3 className="text-base font-display mb-2">What happens next</h3>
              <p className="text-sm text-ink-soft">Your request goes directly to our prayer ministry team. Confidential requests are never shared beyond pastoral staff.</p>
            </div>
            <div className="card">
              <h3 className="text-base font-display mb-2">Prayer meets weekly</h3>
              <p className="text-sm text-ink-soft">Join us for midweek prayer, Wednesdays at 6:00 PM &mdash; or reach out any time via the contact details below.</p>
              <div className="flex flex-col gap-3 text-sm text-ink-soft mt-4">
                <div><strong className="block text-ink text-[13px]">Phone</strong>+254 7XX XXX XXX</div>
                <div><strong className="block text-ink text-[13px]">Email</strong>hello@shaurimoyosda.org</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
