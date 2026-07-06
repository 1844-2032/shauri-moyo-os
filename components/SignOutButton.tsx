"use client";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/staff/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-[13px] font-medium text-cloud hover:text-parchment"
    >
      Sign out
    </button>
  );
}
