const resources = [
  { t: "SDA church manual", d: "The official governance reference for local church operations and policy.", href: "https://www.adventist.org/beliefs/documents/church-manual/" },
  { t: "East Kenya Union conference", d: "Our local conference, responsible for pastoral appointments and church land.", href: "#" },
  { t: "General Conference", d: "The worldwide administrative body of the Seventh-day Adventist Church.", href: "https://gc.adventist.org" },
  { t: "Fundamental beliefs", d: "The 28 fundamental beliefs of the Seventh-day Adventist Church.", href: "https://www.adventist.org/beliefs/fundamental-beliefs/" },
  { t: "Sermon archive & livestream", d: "Catch up on past sermons or join this week's service live.", href: "#" },
  { t: "Church calendar", d: "Upcoming services, department activities, and congregation-wide events.", href: "#" },
];

export default function Resources() {
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">Resources</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Governance, beliefs &amp; media</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">Links to denominational governance and our own media archive.</p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-2 gap-4.5">
          {resources.map((r) => (
            <div key={r.t} className="card">
              <h3 className="text-lg mb-1.5 font-display">{r.t}</h3>
              <p className="text-sm text-ink-soft mb-2.5">{r.d}</p>
              <a href={r.href} className="text-[12.5px] font-semibold text-sage-deep">View &rarr;</a>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="px-8 pb-16">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow">Contact</span>
            <h2 className="font-display text-[28px] mt-2">Get in touch</h2>
            <p className="text-ink-soft mt-2.5 text-[15px]">For a specific request, the request a meeting page routes directly to the right person.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4.5">
            <div className="card flex flex-col gap-3 text-sm text-ink-soft">
              <div><strong className="block text-ink text-[13px]">Address</strong>Shauri Moyo, Nairobi, Kenya</div>
              <div><strong className="block text-ink text-[13px]">Phone</strong>+254 7XX XXX XXX</div>
              <div><strong className="block text-ink text-[13px]">Email</strong>hello@shaurimoyosda.org</div>
            </div>
            <div className="card flex flex-col gap-3 text-sm text-ink-soft">
              <div><strong className="block text-ink text-[13px]">Sabbath school</strong>9:00 AM</div>
              <div><strong className="block text-ink text-[13px]">Divine service</strong>10:45 AM</div>
              <div><strong className="block text-ink text-[13px]">Midweek prayer</strong>Wednesday, 6:00 PM</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
