"use client";
import { useState } from "react";
import { formatAmountInput, isValidEmail, isValidKenyanPhone } from "@/lib/types";

type Fund = "tithe_offering" | "building_fund" | "missions_evangelism";
type Method = "mpesa" | "card";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const FUNDS: { value: Fund; label: string; desc: string; methods: string[] }[] = [
  { value: "tithe_offering", label: "Tithe & offering", desc: "Your regular, faithful return to the work of God.", methods: ["M-Pesa", "Card"] },
  { value: "building_fund", label: "Building fund", desc: "Toward the new fellowship hall project.", methods: ["M-Pesa", "Card"] },
  { value: "missions_evangelism", label: "Missions & evangelism", desc: "Supporting this quarter's outreach campaign.", methods: ["M-Pesa", "Card"] },
];

export default function Give() {
  const [fund, setFund] = useState<Fund>("tithe_offering");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Method>("mpesa");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setFieldError(null);
    const numericAmount = Number(amount.replace(/,/g, ""));

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (method === "mpesa" && !phone.trim()) {
      setError("Please enter your M-Pesa phone number.");
      return;
    }
    if (method === "mpesa" && phone.trim() && !isValidKenyanPhone(phone)) {
      setFieldError("Please enter a valid Kenyan phone number (e.g. 07XX XXX XXX).");
      return;
    }
    if (email.trim() && !isValidEmail(email)) {
      setFieldError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fund,
          amount: numericAmount,
          paymentMethod: method,
          donorName: name || undefined,
          donorPhone: phone || undefined,
          donorEmail: email || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      // Send the giver to Pesapal's hosted checkout (shows M-Pesa STK push
      // or card entry depending on what they choose there).
      window.location.href = data.redirectUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Stewardship</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Give toward what matters to you</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Every gift is recorded against its fund, so you and the church always know where it goes.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-3 gap-4.5 mb-10">
          {FUNDS.map((g) => (
            <div key={g.value} className="card">
              <h3 className="text-lg mb-1.5 font-display">{g.label}</h3>
              <p className="text-sm text-ink-soft mb-4.5">{g.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {g.methods.map((m) => (
                  <span key={m} className="text-[12px] px-3 py-1.5 rounded-full bg-gold/15 text-gold-deep border border-gold/30">{m}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card max-w-[600px] mx-auto">
          <h2 className="text-xl font-display mb-5">Give now</h2>

          {(error || fieldError) && (
            <div className="mb-4 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-card px-3 py-2.5">
              {error || fieldError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[13px] font-semibold mb-1.5">Fund</label>
            <select className="form-input" value={fund} onChange={(e) => setFund(e.target.value as Fund)}>
              {FUNDS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Amount (KES)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 2,000"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(formatAmountInput(e.target.value))}
              />
              <div className="flex gap-2 flex-wrap mt-2">
                {QUICK_AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className="text-[12px] px-3 py-1.5 rounded-full border border-line hover:border-gold hover:bg-gold/10 transition-colors"
                    onClick={() => setAmount(a.toLocaleString("en-US"))}
                  >
                    {a.toLocaleString("en-US")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Payment method</label>
              <select className="form-input" value={method} onChange={(e) => setMethod(e.target.value as Method)}>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
              </select>
            </div>
          </div>

          {method === "mpesa" && (
            <div className="mb-4">
              <label className="block text-[13px] font-semibold mb-1.5">Phone number (for M-Pesa)</label>
              <input
                type="text"
                placeholder="07XX XXX XXX"
                className="form-input"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (fieldError) setFieldError(null); }}
              />
              <p className="text-[12.5px] text-ink-soft mt-1">You&apos;ll receive an STK push prompt to confirm the payment.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Full name (optional)</label>
              <input type="text" placeholder="Your name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Email (optional)</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="form-input"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (fieldError) setFieldError(null); }}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn-primary w-full disabled:opacity-60"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Redirecting to secure checkout…" : `Give KES ${amount || "—"}`}
          </button>
        </div>
      </section>
    </>
  );
}
