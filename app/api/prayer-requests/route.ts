import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { created, badRequest, serverError } from '@/lib/types';

// ============================================================
// POST /api/prayer-requests
// Creates a new prayer request. Public-facing, no auth required.
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      full_name,
      phone,
      email,
      request_text,
      is_confidential = false,
    } = body;

    if (!request_text?.trim()) {
      return badRequest('Please share what you would like us to pray for.');
    }

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    const { data, error } = await supabaseAdmin
      .from('prayer_requests')
      .insert({
        church_id: churchId,
        full_name: full_name?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim().toLowerCase() || null,
        request_text: request_text.trim(),
        is_confidential,
      })
      .select()
      .single();

    if (error) {
      console.error('Prayer request create error:', error);
      return serverError('Could not submit prayer request.');
    }

    return created({
      message: 'Prayer request received. Our prayer team will be praying with you.',
      request: data,
    });
  } catch (err) {
    console.error('Prayer request POST exception:', err);
    return serverError();
  }
}
