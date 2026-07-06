const pastSermons = [
  { date: "June 28, 2026", title: "Anchored in the Storm", speaker: "Senior Pastor" },
  { date: "June 21, 2026", title: "The Sabbath Rest We're Missing", speaker: "Elders' Board" },
  { date: "June 14, 2026", title: "Living the Sabbath Rest — Part 3", speaker: "Senior Pastor" },
  { date: "June 7, 2026", title: "Faith That Moves", speaker: "Guest Speaker" },
];

export default function Live() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Media</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Sermon archive &amp; livestream</h1>
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
            <p className="text-sm text-ink-soft max-w-[440px] mx-auto">
              Divine service streams live every Sabbath morning. Check back then, or watch a past sermon below in the meantime.
            </p>
          </div>

          <div className="max-w-[560px] mb-6">
            <span className="eyebrow">Archive</span>
            <h2 className="font-display text-[24px] mt-2">Past sermons</h2>
          </div>
          <div className="flex flex-col gap-3">
            {pastSermons.map((s) => (
              <div key={s.title} className="card flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="text-base font-display mb-1">{s.title}</h3>
                  <p className="text-[12.5px] text-ink-soft">{s.date} &middot; {s.speaker}</p>
                </div>
                <span className="text-[12.5px] font-semibold text-sage-deep whitespace-nowrap">Watch &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
