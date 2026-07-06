import { redirect } from "next/navigation";
import { getCurrentStaff, hasAnyRole } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PastoralDashboard() {
  const staff = await getCurrentStaff();
  if (!hasAnyRole(staff, ["pastoral", "elder"])) redirect("/dashboard");

  const churchId = process.env.SHAURI_MOYO_CHURCH_ID;

  const [{ data: prayerRequests }, { data: meetingRequests }, { count: memberCount }] = await Promise.all([
    supabaseAdmin
      .from("prayer_requests")
      .select("id, full_name, phone, email, request_text, category, is_confidential, status, created_at")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabaseAdmin
      .from("meeting_requests")
      .select("id, requested_with, full_name, contact, meeting_mode, preferred_date, preferred_time, reason, is_confidential, status, created_at")
      .eq("church_id", churchId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabaseAdmin
      .from("church_members")
      .select("id", { count: "exact", head: true })
      .eq("church_id", churchId)
      .eq("membership_status", "active"),
  ]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div>
      <h1 className="font-display text-2xl mb-1">Pastoral dashboard</h1>
      <p className="text-sm text-ink-soft mb-8">Prayer requests, meeting requests, and membership at a glance.</p>

      <div className="card mb-8 max-w-[260px]">
        <p className="text-[12px] text-ink-soft uppercase tracking-wide mb-1">Active members</p>
        <p className="text-2xl font-display">{memberCount ?? 0}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-base font-display mb-3">Prayer requests</h2>
          {!prayerRequests || prayerRequests.length === 0 ? (
            <p className="text-sm text-ink-soft">No prayer requests yet.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
              {prayerRequests.map((r) => (
                <div key={r.id} className="border border-line rounded-card p-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gold/15 text-gold-deep border border-gold/30 capitalize">
                      {r.category}
                    </span>
                    <span className="text-[11px] text-ink-soft">{formatDate(r.created_at)}</span>
                  </div>
                  <p className="text-sm mb-2">{r.request_text}</p>
                  <div className="text-[12px] text-ink-soft">
                    {r.is_confidential ? (
                      <span className="font-medium text-ink">Confidential request</span>
                    ) : (
                      <span>{r.full_name || "Anonymous"}{r.phone ? ` · ${r.phone}` : ""}{r.email ? ` · ${r.email}` : ""}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-base font-display mb-3">Meeting requests</h2>
          {!meetingRequests || meetingRequests.length === 0 ? (
            <p className="text-sm text-ink-soft">No meeting requests yet.</p>
          ) : (
            <div className="flex flex-col gap-3 max-h-[520px] overflow-y-auto pr-1">
              {meetingRequests.map((m) => (
                <div key={m.id} className="border border-line rounded-card p-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-green/10 text-green-800 border border-green/30 capitalize">
                      {m.requested_with.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] text-ink-soft">{formatDate(m.created_at)}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{m.full_name}{m.is_confidential ? " · Confidential" : ""}</p>
                  <p className="text-sm text-ink-soft mb-2">{m.reason}</p>
                  <div className="text-[12px] text-ink-soft flex flex-wrap gap-x-3">
                    <span>{m.contact}</span>
                    <span className="capitalize">{m.meeting_mode.replace(/_/g, " ")}</span>
                    {m.preferred_date && <span>Preferred: {m.preferred_date}{m.preferred_time ? ` ${m.preferred_time}` : ""}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
