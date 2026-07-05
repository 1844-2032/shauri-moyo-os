const announcements = [
  {
    date: "August 9–15",
    title: "Quarterly camp meeting — \"Anchored Hope\"",
    body: "A week of revival, fellowship, and renewed commitment. Reserve your seat at the welcome desk or via the request a meeting page.",
    tag: "Event",
  },
  {
    date: "This Sabbath",
    title: "Building fund push continues",
    body: "We're at 68% of this quarter's target for the new fellowship hall. Every gift toward the building fund brings us closer — give via M-Pesa or card on the Give page.",
    tag: "Stewardship",
  },
  {
    date: "Ongoing",
    title: "New members' class starts this month",
    body: "Interested in baptism or transferring your membership? Speak to the associate pastor after service or request a meeting online.",
    tag: "Discipleship",
  },
  {
    date: "Every Wednesday",
    title: "Midweek prayer moves to 6:00 PM",
    body: "Join the prayer ministry team for midweek prayer meeting, now starting at 6:00 PM in the main sanctuary.",
    tag: "Prayer",
  },
];

export default function Announcements() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Announcements</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">What&apos;s happening at Shauri Moyo</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Stay current with church-wide news, events, and reminders.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[820px] mx-auto flex flex-col gap-4.5">
          {announcements.map((a) => (
            <div key={a.title} className="card">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[12px] px-3 py-1 rounded-full bg-gold/15 text-gold-deep border border-gold/30 font-semibold">{a.tag}</span>
                <span className="text-[12.5px] text-ink-soft">{a.date}</span>
              </div>
              <h3 className="text-lg mb-1.5 font-display">{a.title}</h3>
              <p className="text-sm text-ink-soft">{a.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
