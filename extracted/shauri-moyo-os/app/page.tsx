import Link from "next/link";
import SabbathCountdown from "@/components/SabbathCountdown";

export default function Home() {
  return (
    <>
      <section className="bg-green text-parchment py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <span className="eyebrow text-cloud">Welcome home</span>
            <h1 className="font-display text-[38px] my-3.5 text-parchment">A place to rest, worship, and belong</h1>
            <p className="text-[15px] text-cloud italic mb-7">&quot;Seek the Lord while He may be found&quot; &mdash; Isaiah 55:6</p>
            <div className="flex gap-3.5 flex-wrap">
              <a href="#" className="btn-primary">Watch live</a>
              <Link href="/give" className="btn-ghost">Give today</Link>
            </div>
          </div>
          <div className="relative h-[320px] rounded-lg2 overflow-hidden shadow-[0_8px_24px_rgba(14,41,34,0.2)]"
               style={{ background: "linear-gradient(135deg, #163C2D 0%, #3C8463 55%, #9C7C18 130%)" }}>
            <span className="absolute bottom-3.5 left-4 text-[11px] text-white/65 uppercase tracking-[0.06em] z-[1]">
              Sunday fellowship &middot; Shauri Moyo
            </span>
            <div className="absolute bottom-4 right-4 left-4">
              <SabbathCountdown compact />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="bg-gradient-to-br from-green-deep via-green to-green-mid rounded-lg2 p-7 flex items-center justify-between flex-wrap gap-4 text-parchment shadow-[0_8px_24px_rgba(14,41,34,0.15)]">
            <div>
              <span className="eyebrow text-gold">Save the date</span>
              <h3 className="font-display text-xl text-parchment mb-1 mt-1">Quarterly camp meeting</h3>
              <p className="text-cloud text-[13.5px]">&quot;Anchored Hope&quot; &mdash; a week of revival, fellowship, and renewed commitment.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-card px-4.5 py-2.5 text-center text-[13px] text-parchment">
              <strong className="block font-display text-lg text-gold">9&ndash;15</strong>
              August
            </div>
            <Link href="/request-meeting" className="btn-primary">Reserve a seat</Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow">This week</span>
            <h2 className="font-display text-[28px] mt-2">At a glance</h2>
            <p className="text-ink-soft mt-2.5 text-[15px]">Everything happening at Shauri Moyo this Sabbath, in one place.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4.5">
            <div className="card">
              <div className="text-[12px] text-sage-deep font-semibold uppercase tracking-wide">Sabbath school</div>
              <h3 className="font-display text-lg my-1.5">9:00 AM</h3>
              <p className="text-sm text-ink-soft">Lesson 12 &mdash; &quot;Living the Sabbath Rest.&quot; All age groups meet in their usual rooms.</p>
            </div>
            <div className="card">
              <div className="text-[12px] text-sage-deep font-semibold uppercase tracking-wide">Divine service</div>
              <h3 className="font-display text-lg my-1.5">10:45 AM</h3>
              <p className="text-sm text-ink-soft">Sermon: &quot;Anchored Hope&quot; with the Shauri Moyo pastoral team. Special item from the youth choir.</p>
            </div>
            <div className="card">
              <div className="text-[12px] text-sage-deep font-semibold uppercase tracking-wide">Fellowship</div>
              <h3 className="font-display text-lg my-1.5">1:00 PM</h3>
              <p className="text-sm text-ink-soft">Potluck lunch in the fellowship hall, hosted by Adventist Women&apos;s Ministries this month.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-green text-parchment py-16 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow text-gold">Stewardship</span>
            <h2 className="font-display text-[28px] mt-2 text-parchment">Give toward what matters to you</h2>
            <p className="text-cloud mt-2.5 text-[15px]">Every gift is recorded against its fund, so you always know where it goes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4.5">
            {[
              { t: "Tithe & offering", d: "Your regular, faithful return.", m: ["M-Pesa", "Card", "Bank"] },
              { t: "Building fund", d: "Toward the new fellowship hall.", m: ["M-Pesa", "Card"] },
              { t: "Missions & evangelism", d: "Supporting this quarter's outreach.", m: ["M-Pesa", "Card"] },
            ].map((g) => (
              <div key={g.t} className="bg-white/5 border border-white/10 rounded-card p-6">
                <h3 className="text-lg text-parchment mb-1.5">{g.t}</h3>
                <p className="text-[13px] text-cloud mb-4.5">{g.d}</p>
                <div className="flex gap-2 flex-wrap">
                  {g.m.map((p) => (
                    <span key={p} className="text-[12px] px-3 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/30">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link href="/give" className="btn-primary mt-7 inline-block">Go to giving page &rarr;</Link>
        </div>
      </section>

      <section id="departments" className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow">Get involved</span>
            <h2 className="font-display text-[28px] mt-2">Find your place at Shauri Moyo</h2>
            <p className="text-ink-soft mt-2.5 text-[15px]">Every department welcomes new hands. Tap one to ask about joining.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {[
              "Personal ministries", "Adventist men", "Women's ministries", "Adventist youth",
              "Pathfinders & adventurers", "Music ministry & choir", "Evangelism", "Sabbath school",
            ].map((d) => (
              <div key={d} className="card flex flex-col gap-2.5 hover:-translate-y-0.5 transition-transform">
                <div className="w-9 h-9 rounded-lg bg-sage/15 flex items-center justify-center text-sage-deep font-display">&#10047;</div>
                <h3 className="text-[15px] font-semibold">{d}</h3>
                <span className="text-[12.5px] font-semibold text-sage-deep mt-auto">Join this unit &rarr;</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
