import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="bg-green-deep text-cloud text-[12.5px]">
        <div className="max-w-[1080px] mx-auto px-8 py-2 flex gap-5 justify-end flex-wrap">
          <Link href="/give" className="hover:text-parchment">Card giving</Link>
          <Link href="/give" className="hover:text-parchment">M-Pesa giving</Link>
          <Link href="/live" className="hover:text-parchment">Live stream</Link>
          <Link href="/prayer-request" className="hover:text-parchment">Prayer request</Link>
          <Link href="/request-meeting" className="hover:text-parchment">Request a meeting</Link>
          <Link href="/announcements" className="hover:text-parchment">Announcements</Link>
        </div>
      </div>

      <header className="bg-green text-parchment">
        <div className="max-w-[1080px] mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-full bg-gold flex items-center justify-center font-display font-semibold text-green-deep text-base">S</div>
            <div className="font-display text-[17px] font-medium">
              Shauri Moyo SDA Church
              <span className="block font-sans text-[10.5px] tracking-[0.1em] uppercase text-cloud font-medium">Seventh-day Adventist</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm text-cloud">
            <Link href="/" className="hover:text-parchment py-1.5">Home</Link>
            <div className="relative group">
              <Link href="/about" className="hover:text-parchment py-1.5">About</Link>
              <div className="hidden group-hover:block absolute top-full -left-3 bg-green border border-white/10 rounded-card p-2 min-w-[200px] z-10">
                <Link href="/about" className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Mission &amp; vision</Link>
                <Link href="/about#pastors" className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Our pastors</Link>
                <Link href="/about#departments" className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Departments</Link>
              </div>
            </div>
            <Link href="/give" className="hover:text-parchment py-1.5">Donations</Link>
            <Link href="/request-meeting" className="hover:text-parchment py-1.5">Request a meeting</Link>
            <Link href="/resources" className="hover:text-parchment py-1.5">Resources</Link>
          </nav>

          <Link href="/request-meeting" className="btn-primary">Request a meeting</Link>
        </div>
      </header>
    </>
  );
}
