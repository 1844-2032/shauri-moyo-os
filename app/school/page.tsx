import Link from "next/link";

export default function School() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Education</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Shauri Moyo Seventh-day Adventist School</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[520px] mx-auto">
            Christ-centred education for the children of our congregation and the wider community.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[720px] mx-auto text-center">
          <div className="card py-12">
            <span className="eyebrow">Page coming soon</span>
            <h2 className="font-display text-2xl mt-2 mb-3">More details on the way</h2>
            <p className="text-sm text-ink-soft max-w-[440px] mx-auto mb-6">
              We&apos;re building out this page with admissions information, term dates, fees, and
              how to enrol. In the meantime, reach out directly and we&apos;ll point you to the
              right person.
            </p>
            <Link href="/request-meeting" className="btn-primary">Ask about the school &rarr;</Link>
          </div>
        </div>
      </section>
    </>
  );
}
