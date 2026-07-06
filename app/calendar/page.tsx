const events = [
  { when: "August 9–15, 2026", title: "Church Business meeting — \"Anchored Hope\"", type: "Annual" },
  { when: "September 2026", type: "Quarterly", title: "Communion Sabbath" },
  { when: "November 2026", type: "Annual", title: "Week of Prayer" },
  { when: "December 2026", type: "Annual", title: "Year-end Thanksgiving Service" },
  { when: "Every Sabbath, 9:00 AM & 10:45 AM", type: "Weekly", title: "Sabbath school & Divine service" },
  { when: "Every Wednesday, 6:00 PM", type: "Weekly", title: "Midweek prayer meeting" },
];

export default function CalendarPage() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Plan ahead</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Church calendar</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Annual meetings, quarterly events, and regular weekly gatherings, all in one place.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[820px] mx-auto flex flex-col gap-3.5">
          {events.map((e) => (
            <div key={e.title} className="card flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[12px] px-3 py-1 rounded-full bg-gold/15 text-gold-deep border border-gold/30 font-semibold">{e.type}</span>
                </div>
                <h3 className="text-base font-display">{e.title}</h3>
              </div>
              <span className="text-[13px] text-ink-soft whitespace-nowrap font-medium">{e.when}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
