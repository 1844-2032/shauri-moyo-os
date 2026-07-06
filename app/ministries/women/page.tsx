import Link from "next/link";

const publications = [
  { title: "Women's Ministry Quarterly Newsletter", note: "Coming soon" },
  { title: "Prayer & Fellowship Guide", note: "Coming soon" },
];

export default function WomensMinistry() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Ministry</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Adventist Women&apos;s Ministries</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Encouraging, equipping, and connecting the women of Shauri Moyo through fellowship and service.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div className="card">
            <h2 className="text-xl font-display mb-3">What we do</h2>
            <p className="text-sm text-ink-soft mb-4">
              Adventist Women&apos;s Ministries hosts monthly fellowship gatherings, community outreach
              projects, and the fellowship-hall potluck lunch held every first Sabbath of the month.
              New members are always welcome, whatever season of life you&apos;re in.
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
              <p className="text-sm text-ink-soft">First Sabbath of the month, after the potluck lunch, in the fellowship hall.</p>
            </div>
            <div className="card">
              <h3 className="text-base font-display mb-2">Want to join?</h3>
              <p className="text-sm text-ink-soft mb-4">Tell us a bit about yourself and we&apos;ll connect you with the ministry leader.</p>
              <Link href="/request-meeting" className="btn-primary w-full text-center">Join this ministry &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
