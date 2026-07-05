import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { created, badRequest, serverError } from '@/lib/types';

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
      is_confidential = false,
    } = body;

    if (!full_name?.trim()) return badRequest('Full name is required.');
    if (!contact?.trim())   return badRequest('Phone or email is required.');
    if (!reason?.trim())    return badRequest('Please share the reason for the meeting.');

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
