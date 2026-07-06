import { supabaseAdmin } from '@/lib/supabase';
import { ok, serverError } from '@/lib/types';

// ============================================================
// GET /api/prayer-groups
// Lists active prayer groups for the church. Public-facing,
// read-only, no sensitive data — safe to expose without auth.
// ============================================================

export async function GET() {
  try {
    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    const { data, error } = await supabaseAdmin
      .from('prayer_groups')
      .select('id, name, area, meeting_day, meeting_time, meeting_location, whatsapp_group_link')
      .eq('church_id', churchId)
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Prayer groups list error:', error);
      return serverError('Could not load prayer groups.');
    }

    return ok({ groups: data ?? [] });
  } catch (err) {
    console.error('Prayer groups GET exception:', err);
    return serverError();
  }
}
