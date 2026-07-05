import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ok, created, badRequest, serverError } from '@/lib/types';

// ============================================================
// POST /api/attendance/children
// Teacher submits headcount for their class.
// One submission per class per session.
// No individual child records — privacy by design.
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      session_id,
      class_id,
      headcount,
      submitted_by,
      notes,
    }: {
      session_id:    string;
      class_id:      string;
      headcount:     number;
      submitted_by?: string;
      notes?:        string;
    } = body;

    if (!session_id)                   return badRequest('Session ID is required.');
    if (!class_id)                     return badRequest('Class ID is required.');
    if (headcount === undefined || headcount < 0)
                                       return badRequest('Headcount must be zero or more.');

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    // Verify the teacher is authorised for this class
    if (submitted_by) {
      const { data: classRecord } = await supabaseAdmin
        .from('church_classes')
        .select('lead_teacher_id, assistant_teacher_id, class_name')
        .eq('id', class_id)
        .eq('church_id', churchId)
        .single();

      if (!classRecord) return badRequest('Class not found.');

      const isAuthorised =
        classRecord.lead_teacher_id      === submitted_by ||
        classRecord.assistant_teacher_id === submitted_by;

      if (!isAuthorised) {
        return badRequest('You are not registered as a teacher for this class.');
      }
    }

    // Upsert — teacher can correct their submission before deadline
    const { data, error } = await supabaseAdmin
      .from('children_attendance')
      .upsert({
        church_id:    churchId,
        session_id,
        class_id,
        headcount,
        submitted_by: submitted_by ?? null,
        submitted_at: new Date().toISOString(),
        notes:        notes ?? null,
      }, { onConflict: 'session_id,class_id' })
      .select(`
        *,
        church_classes ( class_name, age_range_min, age_range_max )
      `)
      .single();

    if (error) {
      console.error('Children attendance error:', error);
      return serverError('Could not record children\'s attendance.');
    }

    const cls = (data as any).church_classes;

    return created({
      message:   `Attendance for ${cls?.class_name ?? 'class'} recorded: ${headcount} children present.`,
      record:    data,
    });

  } catch (err) {
    console.error('Children attendance POST exception:', err);
    return serverError();
  }
}

// ============================================================
// GET /api/attendance/children
// Returns children's attendance for a session or date range.
// ============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const sessionId = searchParams.get('session_id');
    const dateFrom  = searchParams.get('date_from');
    const dateTo    = searchParams.get('date_to');

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    let query = supabaseAdmin
      .from('children_attendance')
      .select(`
        *,
        church_classes ( class_name, age_range_min, age_range_max ),
        attendance_sessions ( service_date, service_type )
      `)
      .eq('church_id', churchId)
      .order('created_at', { ascending: false });

    if (sessionId) query = query.eq('session_id', sessionId);

    const { data, error } = await query;
    if (error) return serverError('Could not retrieve children\'s attendance.');

    // Filter by date range via the joined session date
    let filtered = data || [];
    if (dateFrom || dateTo) {
      filtered = filtered.filter(r => {
        const sessionDate = (r.attendance_sessions as any)?.service_date;
        if (!sessionDate) return true;
        if (dateFrom && sessionDate < dateFrom) return false;
        if (dateTo   && sessionDate > dateTo)   return false;
        return true;
      });
    }

    const totalChildren = filtered.reduce((sum, r) => sum + (r.headcount ?? 0), 0);

    return ok({
      records:       filtered,
      total_children: totalChildren,
    });

  } catch (err) {
    console.error('Children attendance GET exception:', err);
    return serverError();
  }
}
