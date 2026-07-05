import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  ok, created, badRequest, serverError,
  type ServiceType
} from '@/lib/types';

// ============================================================
// POST /api/attendance/session
// Creates attendance sessions for a given date.
// Clerk or system creates these before members can self-register.
// On Sabbath, creates sabbath_school, divine_service,
// and afternoon_service automatically.
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      service_date,
      service_types,      // array of service types to create
      has_online_stream = false,
      youtube_stream_id,
      notes,
    }: {
      service_date:      string;
      service_types:     ServiceType[];
      has_online_stream?: boolean;
      youtube_stream_id?: string;
      notes?:            string;
    } = body;

    if (!service_date)         return badRequest('Service date is required.');
    if (!service_types?.length) return badRequest('At least one service type is required.');

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    const sessions = service_types.map(type => ({
      church_id:         churchId,
      service_date,
      service_type:      type,
      has_online_stream: type === 'divine_service' ? has_online_stream : false,
      youtube_stream_id: type === 'divine_service' ? youtube_stream_id ?? null : null,
      recording_method:  'prayer_group_rollcall' as const,
      notes:             notes ?? null,
    }));

    const { data, error } = await supabaseAdmin
      .from('attendance_sessions')
      .upsert(sessions, { onConflict: 'church_id,service_date,service_type' })
      .select();

    if (error) {
      console.error('Session create error:', error);
      return serverError('Could not create attendance sessions.');
    }

    return created({
      message:  `${data?.length ?? 0} attendance session(s) created for ${service_date}.`,
      sessions: data,
    });

  } catch (err) {
    console.error('Session POST exception:', err);
    return serverError();
  }
}

// ============================================================
// GET /api/attendance/session
// Returns attendance sessions with submission status.
// ============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const dateFrom = searchParams.get('date_from');
    const dateTo   = searchParams.get('date_to');
    const type     = searchParams.get('service_type');

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    let query = supabaseAdmin
      .from('attendance_sessions')
      .select('*')
      .eq('church_id', churchId)
      .order('service_date', { ascending: false })
      .order('service_type', { ascending: true });

    if (dateFrom) query = query.gte('service_date', dateFrom);
    if (dateTo)   query = query.lte('service_date', dateTo);
    if (type)     query = query.eq('service_type', type);

    const { data: sessions, error } = await query;
    if (error) return serverError('Could not retrieve sessions.');

    // For each session, get the submission counts
    const sessionIds = (sessions || []).map(s => s.id);
    const { data: recordCounts } = await supabaseAdmin
      .from('attendance_records')
      .select('session_id, is_present')
      .in('session_id', sessionIds);

    const countMap: Record<string, { present: number; absent: number }> = {};
    (recordCounts || []).forEach(r => {
      if (!countMap[r.session_id]) countMap[r.session_id] = { present: 0, absent: 0 };
      if (r.is_present) countMap[r.session_id].present++;
      else              countMap[r.session_id].absent++;
    });

    const enriched = (sessions || []).map(s => ({
      ...s,
      present_count: countMap[s.id]?.present ?? 0,
      absent_count:  countMap[s.id]?.absent  ?? 0,
    }));

    return ok({ sessions: enriched });

  } catch (err) {
    console.error('Session GET exception:', err);
    return serverError();
  }
}
