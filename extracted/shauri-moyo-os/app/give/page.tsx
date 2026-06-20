export default function Give() {
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
          {[
            { t: "Tithe & offering", d: "Your regular, faithful return to the work of God.", m: ["M-Pesa", "Card", "Bank"] },
            { t: "Building fund", d: "Toward the new fellowship hall project.", m: ["M-Pesa", "Card"] },
            { t: "Missions & evangelism", d: "Supporting this quarter's outreach campaign.", m: ["M-Pesa", "Card"] },
          ].map((g) => (
            <div key={g.t} className="card">
              <h3 className="text-lg mb-1.5 font-display">{g.t}</h3>
              <p className="text-sm text-ink-soft mb-4.5">{g.d}</p>
              <div className="flex gap-2 flex-wrap">
                {g.m.map((p) => (
                  <span key={p} className="text-[12px] px-3 py-1.5 rounded-full bg-gold/15 text-gold-deep border border-gold/30">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <form className="card max-w-[600px] mx-auto">
          <h2 className="text-xl font-display mb-5">Give now</h2>
          <div className="mb-4">
            <label className="block text-[13px] font-semibold mb-1.5">Fund</label>
            <select className="form-input">
              <option>Tithe &amp; offering</option>
              <option>Building fund</option>
              <option>Missions &amp; evangelism</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Amount (KES)</label>
              <input type="text" placeholder="e.g. 2,000" className="form-input" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">Payment method</label>
              <select className="form-input">
                <option>M-Pesa</option>
                <option>Card</option>
                <option>Bank transfer</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[13px] font-semibold mb-1.5">Phone number (for M-Pesa)</label>
            <input type="text" placeholder="07XX XXX XXX" className="form-input" />
            <p className="text-[12.5px] text-ink-soft mt-1">You&apos;ll receive an STK push prompt to confirm the payment.</p>
          </div>
          <button type="button" className="btn-primary w-full">Give KES &mdash;</button>
        </form>
      </section>
    </>
  );
}
