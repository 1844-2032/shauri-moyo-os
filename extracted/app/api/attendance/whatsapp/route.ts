import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  ok, badRequest, serverError,
  parseAttendanceReply
} from '@/lib/types';

// ============================================================
// POST /api/attendance/whatsapp
// Called by Africa's Talking webhook when a member replies
// to the Saturday attendance prompt.
// Parses the reply, matches the member by phone,
// checks the deadline (6:30pm), and records attendance.
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Africa's Talking sends: from, to, text, date, id
    const fromPhone   = (body.from || body.From || '').replace(/\s/g, '');
    const messageBody = (body.text || body.Body || '').trim();
    const rawPayload  = body;

    if (!fromPhone)   return badRequest('Missing sender phone number.');
    if (!messageBody) return badRequest('Missing message body.');

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    // Log the inbound message immediately — even if we cannot process it
    const { data: inboundLog, error: logError } = await supabaseAdmin
      .from('whatsapp_inbound')
      .insert({
        church_id:    churchId,
        from_phone:   fromPhone,
        message_body: messageBody,
        message_type: 'unknown', // will update below
        raw_payload:  rawPayload,
        received_at:  new Date().toISOString(),
      })
      .select()
      .single();

    if (logError) {
      console.error('WhatsApp inbound log error:', logError);
      // Continue processing even if logging fails
    }

    // Parse the reply for attendance
    const parsedServices = parseAttendanceReply(messageBody);

    if (parsedServices === null) {
      // Unrecognised reply — route to general WhatsApp inbox
      await supabaseAdmin
        .from('whatsapp_inbound')
        .update({ message_type: 'unknown', processed: false })
        .eq('id', inboundLog?.id ?? '');

      return ok({
        message: 'Message logged for staff review.',
        action:  'routed_to_inbox',
      });
    }

    // Find the member by phone number
    const { data: member } = await supabaseAdmin
      .from('church_members')
      .select('id, first_name, attendance_prompt_opted_in, prayer_group_id')
      .eq('church_id', churchId)
      .eq('phone', fromPhone)
      .eq('membership_status', 'active')
      .single();

    if (!member) {
      await supabaseAdmin
        .from('whatsapp_inbound')
        .update({
          message_type:      'attendance',
          processed:         false,
          processing_notes:  'Phone number not matched to any active member.',
        })
        .eq('id', inboundLog?.id ?? '');

      return ok({
        message: 'Phone number not found in member database.',
        action:  'unmatched_phone',
      });
    }

    if (!member.attendance_prompt_opted_in) {
      return ok({
        message: 'Member has not opted in to attendance self-registration.',
        action:  'not_opted_in',
      });
    }

    // Check deadline — 6:30pm same day
    const now     = new Date();
    const deadline = new Date();
    deadline.setHours(18, 30, 0, 0);

    if (now > deadline) {
      await supabaseAdmin
        .from('whatsapp_inbound')
        .update({
          message_type:      'attendance',
          member_id:         member.id,
          processed:         false,
          processing_notes:  'Received after 6:30pm deadline.',
        })
        .eq('id', inboundLog?.id ?? '');

      return ok({
        message: 'Reply received after the 6:30pm deadline.',
        action:  'past_deadline',
      });
    }

    // Find today's attendance sessions for this church
    const today = now.toISOString().split('T')[0];
    const { data: sessions } = await supabaseAdmin
      .from('attendance_sessions')
      .select('id, service_type')
      .eq('church_id', churchId)
      .eq('service_date', today)
      .in('service_type', ['sabbath_school', 'divine_service', 'afternoon_service']);

    if (!sessions || sessions.length === 0) {
      await supabaseAdmin
        .from('whatsapp_inbound')
        .update({
          message_type:      'attendance',
          member_id:         member.id,
          processed:         false,
          processing_notes:  'No attendance sessions found for today.',
        })
        .eq('id', inboundLog?.id ?? '');

      return ok({
        message: 'No sessions open for today.',
        action:  'no_sessions',
      });
    }

    // Record attendance for each session
    const attendanceRecords = sessions.map(session => ({
      church_id:              churchId,
      session_id:             session.id,
      member_id:              member.id,
      prayer_group_id:        member.prayer_group_id ?? null,
      is_present:             parsedServices.includes(session.service_type as any),
      registered_by_member:   true,
      registration_channel:   'whatsapp' as const,
      services_attended:      parsedServices,
      marked_at:              now.toISOString(),
    }));

    // Upsert — member may be correcting an earlier submission
    const { error: attendanceError } = await supabaseAdmin
      .from('attendance_records')
      .upsert(attendanceRecords, {
        onConflict: 'session_id,member_id',
        ignoreDuplicates: false,
      });

    if (attendanceError) {
      console.error('Attendance record error:', attendanceError);
      return serverError('Could not record attendance.');
    }

    // Update inbound log
    await supabaseAdmin
      .from('whatsapp_inbound')
      .update({
        message_type:           'attendance',
        member_id:              member.id,
        parsed_services:        parsedServices,
        attendance_session_id:  sessions[0].id,
        attendance_recorded:    true,
        processed:              true,
        processed_at:           now.toISOString(),
        processing_notes:       parsedServices.length === 0
          ? 'Member marked as absent.'
          : `Marked present for: ${parsedServices.join(', ')}`,
      })
      .eq('id', inboundLog?.id ?? '');

    const serviceLabels: Record<string, string> = {
      sabbath_school:  'Sabbath School',
      divine_service:  'Divine Service',
      afternoon_service: 'Afternoon Service',
    };

    const attendedLabels = parsedServices.map(s => serviceLabels[s] ?? s);

    return ok({
      message:   'Attendance recorded successfully.',
      member:    member.first_name,
      attended:  attendedLabels,
      absent:    parsedServices.length === 0,
    });

  } catch (err) {
    console.error('WhatsApp attendance POST exception:', err);
    return serverError();
  }
}
