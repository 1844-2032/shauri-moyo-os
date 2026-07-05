"use client";
import { useEffect, useState } from "react";

function nextSabbathBoundaries(now: Date) {
  const day = now.getDay();
  const fri18 = new Date(now);
  fri18.setHours(18, 30, 0, 0);
  const daysToFri = (5 - day + 7) % 7;
  fri18.setDate(now.getDate() + daysToFri);

  const sat18 = new Date(fri18);
  sat18.setDate(fri18.getDate() + 1);

  if (now >= fri18 && now < sat18) return { state: "during" as const, target: sat18 };
  if (daysToFri === 0 && now >= sat18) {
    const nextFri = new Date(fri18);
    nextFri.setDate(fri18.getDate() + 7);
    return { state: "before" as const, target: nextFri };
  }
  return { state: "before" as const, target: fri18 };
}

function pad(n: number) {
  return n < 10 ? "0" + n : "" + n;
}

export default function SabbathCountdown({ compact = false }: { compact?: boolean }) {
  const [label, setLabel] = useState("Sabbath begins in");
  const [time, setTime] = useState("--:--:--");
  const [sub, setSub] = useState("Friday, 6:30 PM \u00B7 Nairobi");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const b = nextSabbathBoundaries(now);
      const diff = Math.max(0, b.target.getTime() - now.getTime());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      if (b.state === "during") {
        setLabel("Sabbath rest \u2014 ends in");
        setSub("Until sunset Saturday");
      } else {
        setLabel("Sabbath begins in");
        setSub("Friday, 6:30 PM \u00B7 Nairobi");
      }
      setTime(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="inline-flex flex-col items-start gap-1.5 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
      <div className="text-[13px] text-cloud">{label}</div>
      <div className={`font-display font-semibold text-gold tabular-nums ${compact ? "text-[32px]" : "text-[46px]"}`}>{time}</div>
      <div className="text-[13px] text-cloud">{sub}</div>
    </div>
  );
}
