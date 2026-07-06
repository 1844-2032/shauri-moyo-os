"use client";
import { useState } from "react";
import { isValidEmail, isValidKenyanPhone, MEETING_MODES } from "@/lib/types";

const WITH_OPTIONS: { value: string; label: string }[] = [
  { value: "senior_pastor", label: "Senior pastor" },
  { value: "elders_board", label: "Elders' board" },
  { value: "treasury", label: "Treasury" },
  { value: "department_head", label: "A specific department head" },
];

const todayISO = () => new Date().toISOString().split("T")[0];

export default function RequestMeeting() {
  const [requestedWith, setRequestedWith] = useState(WITH_OPTIONS[0].value);
  const [fullName, setFullName] = useState("");
  const [contact, setContact] = useState("");
  const [meetingMode, setMeetingMode] = useState(MEETING_MODES[0].value);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [reason, setReason] = useState("");
  const [confidential, setConfidential] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setContactError(null);
    if (!fullName.trim()) return setError("Please enter your full name.");
    if (!contact.trim()) return setError("Please enter a phone number or email.");
    if (!isValidEmail(contact) && !isValidKenyanPhone(contact)) {
      setContactError("Please enter a valid phone number or email address.");
      return;
    }
    if (!reason.trim()) return setError("Please share what you'd like to discuss.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/meeting-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requested_with: requestedWith,
          full_name: fullName,
          contact,
          meeting_mode: meetingMode,
          preferred_date: preferredDate || undefined,
          preferred_time: preferredTime || undefined,
          reason,
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
      setFullName(""); setContact(""); setPreferredDate("");
      setPreferredTime(""); setReason(""); setConfidential(false);
      setMeetingMode(MEETING_MODES[0].value);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForSubmitAnother = () => {
    setSuccess(null);
    setError(null);
    setContactError(null);
  };

  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Pastoral care</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Request a meeting</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Whether it&apos;s pastoral counsel, a department matter, or a board request &mdash; tell us what you need and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <section className="py-12 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div className="card">
            {success ? (
              <div>
                <div className="text-[13.5px] text-green-800 bg-green-50 border border-green-200 rounded-card px-4 py-4 mb-4">
                  {success}
                </div>
                <button type="button" className="btn-secondary w-full" onClick={resetForSubmitAnother}>
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-4 text-[13px] text-red-700 bg-red-50 border border-red-200 rounded-card px-3 py-2.5">
                    {error}
                  </div>
                )}
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold mb-1.5">Who would you like to meet?</label>
                  <select className="form-input" value={requestedWith} onChange={(e) => setRequestedWith(e.target.value)}>
                    {WITH_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold mb-1.5">How would you like to meet?</label>
                  <select className="form-input" value={meetingMode} onChange={(e) => setMeetingMode(e.target.value)}>
                    {MEETING_MODES.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Full name</label>
                    <input type="text" placeholder="Your name" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Phone or email</label>
                    <input
                      type="text"
                      placeholder="07XX XXX XXX or email"
                      className="form-input"
                      value={contact}
                      onChange={(e) => { setContact(e.target.value); if (contactError) setContactError(null); }}
                    />
                    {contactError && <p className="text-[12px] text-red-600 mt-1">{contactError}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Preferred date</label>
                    <input type="date" min={todayISO()} className="form-input" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold mb-1.5">Preferred time</label>
                    <input type="time" className="form-input" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[13px] font-semibold mb-1.5">Reason for meeting</label>
                  <textarea placeholder="Briefly share what you'd like to discuss" className="form-input min-h-[90px]" value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="w-auto" checked={confidential} onChange={(e) => setConfidential(e.target.checked)} />
                    This is a confidential matter
                  </label>
                </div>
                <button type="button" className="btn-primary w-full disabled:opacity-60" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? "Submitting…" : "Submit request"}
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="card">
              <h3 className="text-base font-display mb-2">What happens next</h3>
              <p className="text-sm text-ink-soft">Your request is routed directly to the person or department you selected. You&apos;ll get a confirmation once they accept a time.</p>
            </div>
            <div className="card">
              <h3 className="text-base font-display mb-2">Other ways to reach us</h3>
              <div className="flex flex-col gap-3 text-sm text-ink-soft mt-2">
                <div><strong className="block text-ink text-[13px]">Phone</strong>+254 7XX XXX XXX</div>
                <div><strong className="block text-ink text-[13px]">Email</strong>hello@shaurimoyosda.org</div>
                <div><strong className="block text-ink text-[13px]">Address</strong>Shauri Moyo, Nairobi</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
