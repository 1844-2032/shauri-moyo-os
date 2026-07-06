import Link from "next/link";
import SabbathCountdown from "@/components/SabbathCountdown";
import { supabaseAdmin } from "@/lib/supabase";

type PrayerGroup = {
  id: string;
  name: string;
  area: string | null;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_location: string | null;
};

async function getPrayerGroups(): Promise<PrayerGroup[]> {
  const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
  if (!churchId) return [];
  const { data, error } = await supabaseAdmin
    .from("prayer_groups")
    .select("id, name, area, meeting_day, meeting_time, meeting_location")
    .eq("church_id", churchId)
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

function capitalize(s: string | null) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function Home() {
  const prayerGroups = await getPrayerGroups();
  return (
    <>
      <section className="bg-green text-parchment py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <span className="eyebrow text-cloud">Welcome home</span>
            <h1 className="font-display text-[38px] my-3.5 text-parchment">A place to rest, worship, and belong</h1>
            <p className="text-[15px] text-cloud italic mb-7">&quot;Seek the Lord while He may be found&quot; &mdash; Isaiah 55:6</p>
            <div className="flex gap-3.5 flex-wrap">
              <Link href="/sermons" className="btn-primary">Watch live</Link>
              <Link href="/give" className="btn-ghost">Donate today</Link>
            </div>
          </div>
          <div className="relative h-[320px] rounded-lg2 overflow-hidden shadow-[0_8px_24px_rgba(14,41,34,0.2)]"
               style={{ background: "linear-gradient(135deg, #163C2D 0%, #3C8463 55%, #9C7C18 130%)" }}>
            <span className="absolute bottom-3.5 left-4 text-[11px] text-white/65 uppercase tracking-[0.06em] z-[1]">
              Sabbath fellowship &middot; Shauri Moyo
            </span>
            <div className="absolute bottom-4 right-4 left-4">
              <SabbathCountdown compact />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="bg-gradient-to-br from-green-deep via-green to-green-mid rounded-lg2 p-7 flex flex-col md:flex-row md:items-center gap-5 text-parchment shadow-[0_8px_24px_rgba(14,41,34,0.15)]">
            <div className="flex-1 min-w-[200px]">
              <span className="eyebrow text-gold">Save the date</span>
              <h3 className="font-display text-xl text-parchment mb-1 mt-1">Church Business meeting</h3>
              <p className="text-cloud text-[13.5px]">&quot;Anchored Hope&quot; &mdash; a week of revival, fellowship, and renewed commitment.</p>
            </div>
            <div className="flex items-center gap-5 flex-wrap">
              <div className="bg-white/10 border border-white/20 rounded-card px-4.5 py-2.5 text-center text-[13px] text-parchment shrink-0">
                <strong className="block font-display text-lg text-gold">9&ndash;15</strong>
                August
              </div>
              <Link href="/request-meeting" className="btn-primary shrink-0">Reserve a seat</Link>
            </div>
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
          <Link href="/give" className="btn-primary mt-7 inline-block">Go to donations page &rarr;</Link>
        </div>
      </section>

      <section id="prayer-groups" className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow">Prayer ministry</span>
            <h2 className="font-display text-[28px] mt-2">Join a neighbourhood prayer group</h2>
            <p className="text-ink-soft mt-2.5 text-[15px]">Small groups meet weekly across Shauri Moyo and nearby estates. Find one near you and ask to join.</p>
          </div>
          {prayerGroups.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4.5">
              {prayerGroups.map((g) => (
                <div key={g.id} className="card flex flex-col gap-2">
                  <h3 className="text-[15px] font-semibold font-display">{g.name}</h3>
                  {g.area && <p className="text-[13px] text-ink-soft">{g.area}</p>}
                  {g.meeting_day && (
                    <p className="text-[12.5px] text-sage-deep font-semibold uppercase tracking-wide">
                      {capitalize(g.meeting_day)}{g.meeting_time ? ` · ${g.meeting_time.slice(0, 5)}` : ""}
                    </p>
                  )}
                  {g.meeting_location && <p className="text-[12.5px] text-ink-soft">{g.meeting_location}</p>}
                  <Link
                    href={`/prayer-request?group=${encodeURIComponent(g.name)}`}
                    className="text-[12.5px] font-semibold text-sage-deep mt-2"
                  >
                    Ask to join &rarr;
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-ink-soft text-[15px]">Prayer group listings are being updated. Please check back soon, or <Link href="/prayer-request" className="text-sage-deep font-semibold">request prayer here</Link>.</p>
          )}
        </div>
      </section>

      <section id="departments" className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow">Get involved</span>
            <h2 className="font-display text-[28px] mt-2">Find your place at Shauri Moyo</h2>
            <p className="text-ink-soft mt-2.5 text-[15px]">Every department welcomes new hands. Tap one to ask about joining.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {[
              { name: "Personal ministries", href: "/request-meeting" },
              { name: "Adventist men", href: "/ministries/men" },
              { name: "Women's ministries", href: "/ministries/women" },
              { name: "Adventist youth", href: "/ministries/youth" },
              { name: "Children's ministry", href: "/ministries/children" },
              { name: "Pathfinders & adventurers", href: "/request-meeting" },
              { name: "Music ministry & choir", href: "/request-meeting" },
              { name: "Evangelism", href: "/request-meeting" },
              { name: "Sabbath school", href: "/request-meeting" },
            ].map((d) => (
              <Link key={d.name} href={d.href} className="card flex flex-col gap-2.5 hover:-translate-y-0.5 transition-transform">
                <div className="w-9 h-9 rounded-lg bg-sage/15 flex items-center justify-center text-sage-deep font-display">&#10047;</div>
                <h3 className="text-[15px] font-semibold">{d.name}</h3>
                <span className="text-[12.5px] font-semibold text-sage-deep mt-auto">Join this unit &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
