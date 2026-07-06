import Link from "next/link";

export default function About() {
  const departments = [
    { name: "Personal ministries", href: "/request-meeting" },
    { name: "Adventist men", href: "/ministries/men" },
    { name: "Women's ministries", href: "/ministries/women" },
    { name: "Adventist youth", href: "/ministries/youth" },
    { name: "Pathfinders & adventurers", href: "/request-meeting" },
    { name: "Music ministry & choir", href: "/request-meeting" },
    { name: "Evangelism", href: "/request-meeting" },
    { name: "Sabbath school", href: "/request-meeting" },
    { name: "Family life ministry", href: "/request-meeting" },
    { name: "Children's ministry", href: "/ministries/children" },
    { name: "Elders' board", href: "/request-meeting" },
    { name: "Treasury", href: "/request-meeting" },
  ];
  return (
    <>
      <section className="bg-green text-parchment py-12 px-8 text-center">
        <div className="max-w-[1080px] mx-auto">
          <span className="eyebrow text-cloud">About us</span>
          <h1 className="font-display text-[32px] mt-2 text-parchment">Who we are &amp; why we gather</h1>
          <p className="text-cloud mt-2.5 text-[14.5px] max-w-[480px] mx-auto">
            Shauri Moyo SDA Church is a congregation devoted to helping people understand the Bible and find freedom, healing, and hope in Jesus.
          </p>
        </div>
      </section>

      <section className="py-16 px-8">
        <div className="max-w-[1080px] mx-auto grid md:grid-cols-2 gap-4.5">
          <div className="card">
            <h3 className="text-lg mb-2 font-display">Vision</h3>
            <p className="text-sm text-ink-soft">In harmony with Bible revelation, we see as the climax of God&apos;s plan the restoration of all His creation to full harmony with His perfect will and righteousness.</p>
          </div>
          <div className="card">
            <h3 className="text-lg mb-2 font-display">Mission</h3>
            <p className="text-sm text-ink-soft">To make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel, in preparation for His soon return.</p>
          </div>
        </div>
      </section>

      <section id="pastors" className="px-8 pb-16">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow">Leadership</span>
            <h2 className="font-display text-[28px] mt-2">Our pastoral team</h2>
            <p className="text-ink-soft mt-2.5 text-[15px]">Reach out any time &mdash; or use the request a meeting page to book time directly.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4.5">
            <div className="card">
              <h3 className="text-lg mb-2 font-display">Senior pastor</h3>
              <p className="text-sm text-ink-soft">Leads worship planning, preaching, and overall spiritual direction for the congregation.</p>
            </div>
            <div className="card">
              <h3 className="text-lg mb-2 font-display">Elders&apos; board</h3>
              <p className="text-sm text-ink-soft">Supports pastoral care, member visitation, and department coordination alongside the senior pastor.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="departments" className="px-8 pb-16">
        <div className="max-w-[1080px] mx-auto">
          <div className="max-w-[560px] mb-9">
            <span className="eyebrow">Get involved</span>
            <h2 className="font-display text-[28px] mt-2">Church ministries &amp; departments</h2>
            <p className="text-ink-soft mt-2.5 text-[15px]">Tap one to ask about joining, or use the request a meeting page to speak with a department head directly.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            {departments.map((d) => (
              <Link key={d.name} href={d.href} className="card block hover:-translate-y-0.5 transition-transform">
                <h3 className="text-[15px] font-semibold mb-1">{d.name}</h3>
                <span className="text-[12.5px] font-semibold text-sage-deep">Join this unit &rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
