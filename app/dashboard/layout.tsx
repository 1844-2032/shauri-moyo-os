import Link from "next/link";
import { getCurrentStaff } from "@/lib/staff-auth";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff();

  return (
    <div className="min-h-screen bg-parchment">
      <header className="bg-green text-parchment">
        <div className="max-w-[1080px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="font-display text-[16px]">
            Shauri Moyo SDA &mdash; Staff dashboard
          </Link>
          <div className="flex items-center gap-4">
            {staff && <span className="text-[13px] text-cloud hidden sm:inline">{staff.full_name}</span>}
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-[1080px] mx-auto px-5 md:px-8 py-10">{children}</main>
    </div>
  );
}
