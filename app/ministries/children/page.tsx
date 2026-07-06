import Link from "next/link";

const publications = [
  { title: "Children's Ministry Parent Guide", note: "Coming soon" },
  { title: "Sabbath School Activity Sheets", note: "Coming soon" },
];

export default function ChildrensMinistry() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Ministry</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Children&apos;s Ministry</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Nurturing the faith of our youngest members in a safe, joyful environment.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div className="card">
            <h2 className="text-xl font-display mb-3">What we do</h2>
            <p className="text-sm text-ink-soft mb-4">
              Children&apos;s Ministry runs age-grouped Sabbath school classes, holiday Bible programs,
              and family-friendly events throughout the year. All teachers are vetted volunteers from
              the congregation.
            </p>
            <h2 className="text-xl font-display mb-3 mt-6">Publications</h2>
            <div className="flex flex-col gap-2">
              {publications.map((p) => (
                <div key={p.title} className="flex items-center justify-between gap-3 border-t border-line pt-2.5 first:border-t-0 first:pt-0">
                  <span className="text-sm text-ink-soft">{p.title}</span>
                  <span className="text-[12px] text-sage-deep font-semibold">{p.note}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="card">
              <h3 className="text-base font-display mb-2">Meets</h3>
              <p className="text-sm text-ink-soft">Every Sabbath, 9:00 AM, in the children&apos;s rooms.</p>
            </div>
            <div className="card">
              <h3 className="text-base font-display mb-2">Want to get involved?</h3>
              <p className="text-sm text-ink-soft mb-4">Whether enrolling a child or volunteering to teach, reach out and we&apos;ll help you get started.</p>
              <Link href="/request-meeting" className="btn-primary w-full text-center">Get in touch &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
