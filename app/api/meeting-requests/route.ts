import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { created, badRequest, serverError, isValidEmail, isValidKenyanPhone, MEETING_MODES } from '@/lib/types';

const VALID_MODES = MEETING_MODES.map((m) => m.value);

// ============================================================
// POST /api/meeting-requests
// Creates a new pastoral meeting request. Public-facing.
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      requested_with,
      full_name,
      contact,
      preferred_date,
      preferred_time,
      reason,
      meeting_mode = 'in_person',
      is_confidential = false,
    } = body;

    if (!full_name?.trim()) return badRequest('Full name is required.');
    if (!contact?.trim())   return badRequest('Phone or email is required.');
    if (!isValidEmail(contact) && !isValidKenyanPhone(contact)) {
      return badRequest('Please enter a valid phone number or email address.');
    }
    if (!reason?.trim())    return badRequest('Please share the reason for the meeting.');
    if (!VALID_MODES.includes(meeting_mode)) {
      return badRequest('Please select a valid meeting mode.');
    }

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    const { data, error } = await supabaseAdmin
      .from('meeting_requests')
      .insert({
        church_id: churchId,
        requested_with: requested_with || 'senior_pastor',
        full_name: full_name.trim(),
        contact: contact.trim(),
        preferred_date: preferred_date || null,
        preferred_time: preferred_time || null,
        reason: reason.trim(),
        meeting_mode,
        is_confidential,
      })
      .select()
      .single();

    if (error) {
      console.error('Meeting request create error:', error);
      return serverError('Could not submit meeting request.');
    }

    return created({
      message: 'Meeting request received. You will get a confirmation once a time is accepted.',
      request: data,
    });
  } catch (err) {
    console.error('Meeting request POST exception:', err);
    return serverError();
  }
}
