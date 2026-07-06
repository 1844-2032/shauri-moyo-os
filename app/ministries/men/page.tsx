import Link from "next/link";

const publications = [
  { title: "Men's Ministry Bulletin", note: "Coming soon" },
  { title: "Discipleship Study Guide", note: "Coming soon" },
];

export default function MensMinistry() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Ministry</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Adventist Men&apos;s Ministries</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Building men of faith and integrity through discipleship, service, and brotherhood.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div className="card">
            <h2 className="text-xl font-display mb-3">What we do</h2>
            <p className="text-sm text-ink-soft mb-4">
              Adventist Men&apos;s Ministries runs discipleship studies, community service projects, and
              practical support for church maintenance and events. It&apos;s a place to grow in faith
              alongside other men of the congregation.
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
              <p className="text-sm text-ink-soft">Second Sabbath of the month, in the fellowship hall.</p>
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
