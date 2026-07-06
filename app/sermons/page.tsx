// TODO: replace with the church's real YouTube channel URL once available,
// and swap each sermon's `href` for its actual video link.
const YOUTUBE_CHANNEL = "https://www.youtube.com/@ShauriMoyoSDAChurch";

const pastSermons = [
  { date: "June 28, 2026", title: "Anchored in the Storm", speaker: "Senior Pastor", href: YOUTUBE_CHANNEL },
  { date: "June 21, 2026", title: "The Sabbath Rest We're Missing", speaker: "Elders' Board", href: YOUTUBE_CHANNEL },
  { date: "June 14, 2026", title: "Living the Sabbath Rest — Part 3", speaker: "Senior Pastor", href: YOUTUBE_CHANNEL },
  { date: "June 7, 2026", title: "Faith That Moves", speaker: "Guest Speaker", href: YOUTUBE_CHANNEL },
  { date: "May 31, 2026", title: "The God Who Sees", speaker: "Senior Pastor", href: YOUTUBE_CHANNEL },
  { date: "May 24, 2026", title: "Rebuilding After Ruin", speaker: "Elders' Board", href: YOUTUBE_CHANNEL },
];

export default function Sermons() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Media</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Sermons</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Join us live every Sabbath, or catch up on a past sermon below.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="card mb-10 text-center py-12">
            <span className="eyebrow">Not live right now</span>
            <h2 className="font-display text-2xl mt-2 mb-2">Next livestream: Sabbath, 10:45 AM</h2>
            <p className="text-sm text-ink-soft max-w-[440px] mx-auto mb-4">
              Divine service streams live every Sabbath morning. Check back then, or watch a past sermon below in the meantime.
            </p>
            <a
              href={YOUTUBE_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-semibold text-sage-deep"
            >
              Visit our YouTube channel &rarr;
            </a>
          </div>

          <div className="max-w-[560px] mb-6">
            <span className="eyebrow">Archive</span>
            <h2 className="font-display text-[24px] mt-2">Past sermons</h2>
            <p className="text-ink-soft mt-2 text-[14px]">Tap any sermon to watch it on our YouTube channel.</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pastSermons.map((s) => (
              <a
                key={s.title}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex flex-col gap-2 hover:-translate-y-0.5 transition-transform"
              >
                <div className="w-full aspect-video rounded-card bg-gradient-to-br from-green-deep via-green to-sage/60 flex items-center justify-center text-parchment">
                  <span className="text-3xl">&#9658;</span>
                </div>
                <h3 className="text-base font-display mt-1">{s.title}</h3>
                <p className="text-[12.5px] text-ink-soft">{s.date} &middot; {s.speaker}</p>
                <span className="text-[12.5px] font-semibold text-sage-deep">Watch &rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
