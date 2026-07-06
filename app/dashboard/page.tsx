import { redirect } from "next/navigation";
import { getCurrentStaff, hasAnyRole } from "@/lib/staff-auth";

// Landing spot after login — routes each staff member to the dashboard
// that matches their current role. If someone is signed in but has no
// role assigned yet, show a plain message instead of a dead end.
export default async function DashboardHome() {
  const staff = await getCurrentStaff();

  if (hasAnyRole(staff, ["treasury"])) redirect("/dashboard/treasurer");
  if (hasAnyRole(staff, ["pastoral", "elder"])) redirect("/dashboard/pastoral");

  return (
    <div className="card max-w-[560px]">
      <h1 className="font-display text-xl mb-2">No dashboard assigned yet</h1>
      <p className="text-sm text-ink-soft">
        {staff
          ? `${staff.full_name}, your account isn't linked to a treasurer, pastoral, or elder role yet. Contact the church admin to have a role assigned.`
          : "You need to sign in to view a dashboard."}
      </p>
    </div>
  );
}
