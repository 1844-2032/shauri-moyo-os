import { redirect } from "next/navigation";
import { getCurrentStaff, hasAnyRole } from "@/lib/staff-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface DonationRow {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  donor_name: string | null;
  created_at: string;
  forwarded_to_conference: boolean;
  funds: { name: string; category: string; forwarded_to_conference: boolean } | null;
}

export default async function TreasurerDashboard() {
  const staff = await getCurrentStaff();
  if (!hasAnyRole(staff, ["treasury"])) redirect("/dashboard");

  const churchId = process.env.SHAURI_MOYO_CHURCH_ID;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfQuarter = new Date();
  const quarterMonth = Math.floor(startOfQuarter.getMonth() / 3) * 3;
  startOfQuarter.setMonth(quarterMonth, 1);
  startOfQuarter.setHours(0, 0, 0, 0);

  const { data: donations } = await supabaseAdmin
    .from("donations")
    .select("id, amount, status, payment_method, donor_name, created_at, forwarded_to_conference, funds(name, category, forwarded_to_conference)")
    .eq("church_id", churchId)
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (donations ?? []) as unknown as DonationRow[];
  const completed = rows.filter((d) => d.status === "COMPLETED");

  const sumSince = (since: Date) =>
    completed
      .filter((d) => new Date(d.created_at) >= since)
      .reduce((sum, d) => sum + Number(d.amount), 0);

  const totalMonth = sumSince(startOfMonth);
  const totalQuarter = sumSince(startOfQuarter);
  const totalAllTime = completed.reduce((sum, d) => sum + Number(d.amount), 0);

  const byFund = new Map<string, number>();
  completed.forEach((d) => {
    const name = d.funds?.name || "Unassigned";
    byFund.set(name, (byFund.get(name) || 0) + Number(d.amount));
  });

  const pendingForwarding = completed.filter(
    (d) => d.funds?.forwarded_to_conference && !d.forwarded_to_conference
  );

  const recent = rows.slice(0, 15);

  const fmt = (n: number) => `KES ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

  return (
    <div>
      <h1 className="font-display text-2xl mb-1">Treasurer dashboard</h1>
      <p className="text-sm text-ink-soft mb-8">Giving summary for Shauri Moyo SDA Church.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <p className="text-[12px] text-ink-soft uppercase tracking-wide mb-1">This month</p>
          <p className="text-2xl font-display">{fmt(totalMonth)}</p>
        </div>
        <div className="card">
          <p className="text-[12px] text-ink-soft uppercase tracking-wide mb-1">This quarter</p>
          <p className="text-2xl font-display">{fmt(totalQuarter)}</p>
        </div>
        <div className="card">
          <p className="text-[12px] text-ink-soft uppercase tracking-wide mb-1">All time (last 200 records)</p>
          <p className="text-2xl font-display">{fmt(totalAllTime)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-base font-display mb-3">Giving by fund</h2>
          {byFund.size === 0 ? (
            <p className="text-sm text-ink-soft">No completed gifts yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {Array.from(byFund.entries()).map(([name, total]) => (
                <div key={name} className="flex justify-between text-sm border-b border-line pb-2 last:border-0">
                  <span>{name}</span>
                  <span className="font-semibold">{fmt(total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-base font-display mb-3">Conference forwarding</h2>
          {pendingForwarding.length === 0 ? (
            <p className="text-sm text-ink-soft">Nothing pending forwarding right now.</p>
          ) : (
            <>
              <p className="text-sm text-ink-soft mb-2">
                {pendingForwarding.length} completed gift{pendingForwarding.length === 1 ? "" : "s"} not yet marked as forwarded.
              </p>
              <p className="text-xl font-display">
                {fmt(pendingForwarding.reduce((s, d) => s + Number(d.amount), 0))}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-base font-display mb-3">Recent transactions</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-ink-soft">No transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[12px] text-ink-soft uppercase tracking-wide border-b border-line">
                  <th className="py-2 pr-3">Date</th>
                  <th className="py-2 pr-3">Fund</th>
                  <th className="py-2 pr-3">Donor</th>
                  <th className="py-2 pr-3">Method</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((d) => (
                  <tr key={d.id} className="border-b border-line last:border-0">
                    <td className="py-2 pr-3 whitespace-nowrap">
                      {new Date(d.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-2 pr-3">{d.funds?.name || "—"}</td>
                    <td className="py-2 pr-3">{d.donor_name || "Anonymous"}</td>
                    <td className="py-2 pr-3">{d.payment_method}</td>
                    <td className="py-2 pr-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full ${
                          d.status === "COMPLETED"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : d.status === "PENDING"
                            ? "bg-gold/15 text-gold-deep border border-gold/30"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="py-2 text-right font-medium">{fmt(Number(d.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
