"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"about" | "give" | "ministries" | null>(null);

  const toggle = (menu: "about" | "give" | "ministries") =>
    setOpenMenu((cur) => (cur === menu ? null : menu));

  const closeAll = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  return (
    <>
      <div className="bg-green-deep text-cloud text-[12.5px]">
        <div className="max-w-[1080px] mx-auto px-5 md:px-8 py-2 hidden md:flex gap-5 justify-end flex-wrap">
          <Link href="/give" className="hover:text-parchment">Card giving</Link>
          <Link href="/give" className="hover:text-parchment">M-Pesa giving</Link>
          <Link href="/sermons" className="hover:text-parchment">Sermons</Link>
          <Link href="/prayer-request" className="hover:text-parchment">Prayer request</Link>
          <Link href="/request-meeting" className="hover:text-parchment">Request a meeting</Link>
          <Link href="/announcements" className="hover:text-parchment">Announcements</Link>
          <Link href="/calendar" className="hover:text-parchment">Calendar</Link>
        </div>
      </div>

      <header className="bg-green text-parchment relative z-20">
        <div className="max-w-[1080px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={closeAll}>
            <div className="w-[34px] h-[34px] rounded-full bg-gold flex items-center justify-center font-display font-semibold text-green-deep text-base">S</div>
            <div className="font-display text-[17px] font-medium">
              Shauri Moyo SDA Church
              <span className="block font-sans text-[10.5px] tracking-[0.1em] uppercase text-cloud font-medium">Seventh-day Adventist</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm text-cloud items-center">
            <Link href="/" className="hover:text-parchment py-1.5">Home</Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggle("about")}
                className="flex items-center gap-1 hover:text-parchment py-1.5"
                aria-expanded={openMenu === "about"}
              >
                About
                <span className={`text-[10px] transition-transform ${openMenu === "about" ? "rotate-180" : ""}`}>&#9662;</span>
              </button>
              {openMenu === "about" && (
                <div className="absolute top-full -left-3 bg-green border border-white/10 rounded-card p-2 min-w-[200px] z-30 shadow-lg">
                  <Link href="/about" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Mission &amp; vision</Link>
                  <Link href="/about#pastors" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Our pastors</Link>
                  <Link href="/about#departments" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Departments</Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggle("give")}
                className="flex items-center gap-1 hover:text-parchment py-1.5"
                aria-expanded={openMenu === "give"}
              >
                Donations
                <span className={`text-[10px] transition-transform ${openMenu === "give" ? "rotate-180" : ""}`}>&#9662;</span>
              </button>
              {openMenu === "give" && (
                <div className="absolute top-full -left-3 bg-green border border-white/10 rounded-card p-2 min-w-[200px] z-30 shadow-lg">
                  <Link href="/give" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Give via M-Pesa</Link>
                  <Link href="/give" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Give via card</Link>
                  <Link href="/give" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Bank transfer</Link>
                  <div className="my-1 border-t border-white/10" />
                  <Link href="/give" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment font-medium">All giving options &rarr;</Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => toggle("ministries")}
                className="flex items-center gap-1 hover:text-parchment py-1.5"
                aria-expanded={openMenu === "ministries"}
              >
                Ministries
                <span className={`text-[10px] transition-transform ${openMenu === "ministries" ? "rotate-180" : ""}`}>&#9662;</span>
              </button>
              {openMenu === "ministries" && (
                <div className="absolute top-full -left-3 bg-green border border-white/10 rounded-card p-2 min-w-[200px] z-30 shadow-lg">
                  <Link href="/ministries/women" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Women&apos;s ministries</Link>
                  <Link href="/ministries/men" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Men&apos;s ministries</Link>
                  <Link href="/ministries/youth" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Youth ministries</Link>
                  <Link href="/ministries/children" onClick={closeAll} className="block px-3 py-2 text-[13.5px] rounded hover:bg-white/5 hover:text-parchment">Children&apos;s ministry</Link>
                </div>
              )}
            </div>

            <Link href="/school" className="hover:text-parchment py-1.5">School</Link>
            <Link href="/request-meeting" className="hover:text-parchment py-1.5">Request a meeting</Link>
            <Link href="/resources" className="hover:text-parchment py-1.5">Resources</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/request-meeting" className="btn-primary hidden md:inline-block">Request a meeting</Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-card border border-white/20 text-parchment"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <span className="text-lg leading-none">&#10005;</span>
              ) : (
                <span className="text-lg leading-none">&#9776;</span>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-green-deep px-5 py-4 flex flex-col gap-0.5 text-[14px] text-cloud">
            <Link href="/" onClick={closeAll} className="py-2.5 hover:text-parchment">Home</Link>
            <Link href="/about" onClick={closeAll} className="py-2.5 hover:text-parchment">About &mdash; Mission &amp; vision</Link>
            <Link href="/about#pastors" onClick={closeAll} className="py-2.5 pl-3 hover:text-parchment">Our pastors</Link>
            <Link href="/about#departments" onClick={closeAll} className="py-2.5 pl-3 hover:text-parchment">Departments</Link>
            <Link href="/give" onClick={closeAll} className="py-2.5 hover:text-parchment">Donations</Link>
            <Link href="/ministries/women" onClick={closeAll} className="py-2.5 hover:text-parchment">Ministries &mdash; Women&apos;s</Link>
            <Link href="/ministries/men" onClick={closeAll} className="py-2.5 pl-3 hover:text-parchment">Men&apos;s</Link>
            <Link href="/ministries/youth" onClick={closeAll} className="py-2.5 pl-3 hover:text-parchment">Youth</Link>
            <Link href="/ministries/children" onClick={closeAll} className="py-2.5 pl-3 hover:text-parchment">Children&apos;s</Link>
            <Link href="/school" onClick={closeAll} className="py-2.5 hover:text-parchment">School</Link>
            <Link href="/request-meeting" onClick={closeAll} className="py-2.5 hover:text-parchment">Request a meeting</Link>
            <Link href="/resources" onClick={closeAll} className="py-2.5 hover:text-parchment">Resources</Link>
            <div className="my-2 border-t border-white/10" />
            <Link href="/sermons" onClick={closeAll} className="py-2.5 hover:text-parchment">Sermons</Link>
            <Link href="/prayer-request" onClick={closeAll} className="py-2.5 hover:text-parchment">Prayer request</Link>
            <Link href="/announcements" onClick={closeAll} className="py-2.5 hover:text-parchment">Announcements</Link>
            <Link href="/calendar" onClick={closeAll} className="py-2.5 hover:text-parchment">Calendar</Link>
          </div>
        )}
      </header>
    </>
  );
}
