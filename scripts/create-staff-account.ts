/**
 * Creates (or links) a staff login for the treasurer, pastoral, or elder
 * dashboards. Run this once per staff member — there is no public
 * self-signup for these accounts by design.
 *
 * Usage:
 *   npx tsx scripts/create-staff-account.ts \
 *     --email="treasurer@shaurimoyosda.org" \
 *     --password="ChooseAStrongTempPassword1!" \
 *     --member-name="Jane Wanjiru" \
 *     --role=treasury \
 *     --role-label="Church Treasurer"
 *
 * --role must be one of: pastoral, treasury, elder, administrative,
 * departmental, prayer_group, deacon
 *
 * --member-name must exactly match an existing church_members row
 * (first_name + " " + last_name). Create the member record first if
 * it doesn't exist yet.
 *
 * Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and
 * SHAURI_MOYO_CHURCH_ID to already be set in your environment.
 */
import { supabaseAdmin } from "../lib/supabase";

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const match = process.argv.find((a) => a.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

const VALID_ROLES = [
  "pastoral",
  "treasury",
  "elder",
  "administrative",
  "departmental",
  "prayer_group",
  "deacon",
];

async function main() {
  const email = getArg("email");
  const password = getArg("password");
  const memberName = getArg("member-name");
  const role = getArg("role");
  const roleLabel = getArg("role-label") || role;

  if (!email || !password || !memberName || !role) {
    throw new Error(
      "Missing required args. Need --email, --password, --member-name, --role (see file header for usage)."
    );
  }
  if (!VALID_ROLES.includes(role)) {
    throw new Error(`--role must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
  if (!churchId) throw new Error("SHAURI_MOYO_CHURCH_ID is not set.");

  const [firstName, ...rest] = memberName.trim().split(" ");
  const lastName = rest.join(" ");

  const { data: member, error: memberError } = await supabaseAdmin
    .from("church_members")
    .select("id, auth_user_id")
    .eq("church_id", churchId)
    .ilike("first_name", firstName)
    .ilike("last_name", lastName)
    .single();

  if (memberError || !member) {
    throw new Error(
      `Could not find a church_members row matching "${memberName}". Create the member record first.`
    );
  }

  console.log(`Found member record ${member.id} for ${memberName}.`);

  let authUserId = member.auth_user_id as string | null;

  if (!authUserId) {
    console.log(`Creating login for ${email}…`);
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      throw new Error(`Failed to create auth user: ${createError?.message}`);
    }
    authUserId = created.user.id;

    const { error: linkError } = await supabaseAdmin
      .from("church_members")
      .update({ auth_user_id: authUserId, email })
      .eq("id", member.id);
    if (linkError) throw new Error(`Failed to link auth user to member: ${linkError.message}`);
  } else {
    console.log(`${memberName} already has a login — skipping account creation.`);
  }

  const { error: roleError } = await supabaseAdmin.from("member_roles").insert({
    church_id: churchId,
    member_id: member.id,
    role_name: roleLabel,
    role_category: role,
    is_current: true,
  });
  if (roleError) throw new Error(`Failed to assign role: ${roleError.message}`);

  console.log(`\n✅ Done. ${memberName} can now sign in at /staff/login with ${email}.`);
  console.log(`   Role assigned: ${roleLabel} (${role})`);
}

main().catch((err) => {
  console.error("❌", err.message || err);
  process.exit(1);
});
