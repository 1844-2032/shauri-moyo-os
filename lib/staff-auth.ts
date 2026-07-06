import { createSupabaseServerAuthClient } from "@/lib/supabase-server-auth";
import { supabaseAdmin } from "@/lib/supabase";

export type RoleCategory =
  | "pastoral"
  | "treasury"
  | "administrative"
  | "departmental"
  | "prayer_group"
  | "elder"
  | "deacon";

export interface StaffMember {
  id: string;
  full_name: string;
  email: string | null;
  roles: RoleCategory[];
}

// Looks up the signed-in staff member (if any) and their current,
// active role categories. Returns null if there's no session or the
// signed-in user isn't linked to a church_members row.
export async function getCurrentStaff(): Promise<StaffMember | null> {
  const supabaseAuth = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) return null;

  const { data: member, error: memberError } = await supabaseAdmin
    .from("church_members")
    .select("id, first_name, last_name, email")
    .eq("auth_user_id", user.id)
    .single();

  if (memberError || !member) return null;

  const { data: roleRows } = await supabaseAdmin
    .from("member_roles")
    .select("role_category")
    .eq("member_id", member.id)
    .eq("is_current", true);

  return {
    id: member.id,
    full_name: `${member.first_name} ${member.last_name}`.trim(),
    email: member.email,
    roles: (roleRows ?? []).map((r) => r.role_category as RoleCategory),
  };
}

export function hasAnyRole(staff: StaffMember | null, allowed: RoleCategory[]): boolean {
  if (!staff) return false;
  return staff.roles.some((r) => allowed.includes(r));
}
