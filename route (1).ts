export default function RequestMeeting() {
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
          <form className="card">
            <div className="mb-4">
              <label className="block text-[13px] font-semibold mb-1.5">Who would you like to meet?</label>
              <select className="form-input">
                <option>Senior pastor</option>
                <option>Associate pastor</option>
                <option>Elders&apos; board</option>
                <option>Treasury</option>
                <option>A specific department head</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Full name</label>
                <input type="text" placeholder="Your name" className="form-input" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Phone or email</label>
                <input type="text" placeholder="07XX XXX XXX or email" className="form-input" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Preferred date</label>
                <input type="date" className="form-input" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">Preferred time</label>
                <input type="time" className="form-input" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold mb-1.5">Reason for meeting</label>
              <textarea placeholder="Briefly share what you'd like to discuss" className="form-input min-h-[90px]" />
            </div>
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="w-auto" />
                This is a confidential matter
              </label>
            </div>
            <button type="button" className="btn-primary w-full">Submit request</button>
          </form>

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
