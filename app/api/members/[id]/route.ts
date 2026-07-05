import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ok, badRequest, notFound, serverError } from '@/lib/types';

// ============================================================
// GET /api/members/[id]
// Returns full member profile including family unit,
// prayer group, roles, departments, giving summary,
// and attendance summary.
// ============================================================

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    // Full member profile
    const { data: member, error: memberError } = await supabaseAdmin
      .from('church_members')
      .select(`
        *,
        family_units!church_members_family_unit_id_fkey (
          id, family_name, physical_address,
          prayer_groups ( id, name, area )
        ),
        prayer_groups ( id, name, area, meeting_day, meeting_time, meeting_location )
      `)
      .eq('id', id)
      .eq('church_id', churchId)
      .single();

    if (memberError || !member) return notFound('Member not found.');

    // Leadership roles
    const { data: roles } = await supabaseAdmin
      .from('member_roles')
      .select('*')
      .eq('member_id', id)
      .eq('is_current', true)
      .order('date_appointed', { ascending: false });

    // Department memberships
    const { data: departments } = await supabaseAdmin
      .from('member_departments')
      .select('*')
      .eq('member_id', id)
      .eq('is_current', true);

    // Giving summary (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

    const { data: givingSummary } = await supabaseAdmin
      .from('donations')
      .select('amount, fund_id, funds(name, category), payment_method, created_at')
      .eq('member_id', id)
      .eq('status', 'COMPLETED')
      .eq('is_split_child', false)
      .gte('created_at', twelveMonthsAgo.toISOString())
      .order('created_at', { ascending: false });

    // Total given this year
    const currentYear = new Date().getFullYear();
    const yearStart = `${currentYear}-01-01`;
    const { data: yearTotal } = await supabaseAdmin
      .from('donations')
      .select('amount')
      .eq('member_id', id)
      .eq('status', 'COMPLETED')
      .eq('is_split_child', false)
      .gte('created_at', yearStart);

    const totalThisYear = (yearTotal || []).reduce(
      (sum, d) => sum + Number(d.amount), 0
    );

    // Attendance summary (last 8 Sabbaths)
    const { data: recentAttendance } = await supabaseAdmin
      .from('attendance_records')
      .select(`
        is_present,
        registration_channel,
        services_attended,
        attendance_sessions ( service_date, service_type )
      `)
      .eq('member_id', id)
      .order('created_at', { ascending: false })
      .limit(24); // last 8 Sabbaths × 3 services

    // Member health score calculation
    // Combines attendance trend + giving trend
    const attendanceScore  = calculateAttendanceScore(recentAttendance || []);
    const givingScore      = calculateGivingScore(givingSummary || []);
    const healthScore      = Math.round((attendanceScore + givingScore) / 2);
    const healthFlag       = healthScore >= 70 ? 'green'
                           : healthScore >= 40 ? 'amber'
                           : 'red';

    return ok({
      member,
      roles:           roles || [],
      departments:     departments || [],
      giving: {
        last_12_months: givingSummary || [],
        total_this_year: totalThisYear,
      },
      attendance: {
        recent: recentAttendance || [],
      },
      health: {
        score:           healthScore,
        flag:            healthFlag,
        attendance_score: attendanceScore,
        giving_score:    givingScore,
      },
    });

  } catch (err) {
    console.error('Member GET [id] exception:', err);
    return serverError();
  }
}

// ============================================================
// PUT /api/members/[id]
// Updates a member record.
// Only provided fields are updated (partial update).
// ============================================================

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }   = await params;
    const body     = await req.json();
    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    // Verify member belongs to this church
    const { data: existing } = await supabaseAdmin
      .from('church_members')
      .select('id')
      .eq('id', id)
      .eq('church_id', churchId)
      .single();

    if (!existing) return notFound('Member not found.');

    // Strip fields that must never be updated directly
    const { id: _id, church_id: _cid, member_number: _mn, created_at: _ca, ...updateFields } = body;

    if (Object.keys(updateFields).length === 0) {
      return badRequest('No fields to update.');
    }

    const { data, error } = await supabaseAdmin
      .from('church_members')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Member update error:', error);
      return serverError('Could not update member record.');
    }

    return ok({ message: 'Member updated successfully.', member: data });

  } catch (err) {
    console.error('Member PUT exception:', err);
    return serverError();
  }
}

// ============================================================
// HEALTH SCORE HELPERS
// ============================================================

function calculateAttendanceScore(records: any[]): number {
  if (!records.length) return 0;
  const present = records.filter(r => r.is_present).length;
  return Math.round((present / records.length) * 100);
}

function calculateGivingScore(giving: any[]): number {
  if (!giving.length) return 0;
  // Score based on recency and consistency
  // Last 3 months of giving = full score
  // 3-6 months = partial
  // Over 6 months or nothing = low
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recentGiving = giving.filter(
    g => new Date(g.created_at) >= threeMonthsAgo
  );
  if (recentGiving.length >= 3) return 100;
  if (recentGiving.length >= 1) return 60;
  return 20;
}
