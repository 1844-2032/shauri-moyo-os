import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  ok, created, badRequest, serverError,
  type PaymentMethod
} from '@/lib/types';
import { randomUUID } from 'crypto';

// ============================================================
// POST /api/treasurer/giving
// Records a manual gift (cash, cheque, bank transfer, Paybill).
// Treasurer enters these from the dashboard.
// For split-rule funds (Combined Offering), two rows are created.
// ============================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      member_id,
      fund_id,
      amount,
      currency          = 'KES',
      payment_method,
      reference_number,
      date_received,
      entered_by,       // treasurer's member_id
      notes,
      send_receipt_override,
    }: {
      member_id?:            string;
      fund_id:               string;
      amount:                number;
      currency?:             string;
      payment_method:        PaymentMethod;
      reference_number?:     string;
      date_received?:        string;
      entered_by?:           string;
      notes?:                string;
      send_receipt_override?: boolean;
    } = body;

    // Validation
    if (!fund_id)        return badRequest('Fund is required.');
    if (!amount || amount <= 0) return badRequest('Amount must be greater than zero.');
    if (!payment_method) return badRequest('Payment method is required.');

    const manualMethods: PaymentMethod[] = [
      'mpesa_paybill', 'bank_transfer', 'cash', 'cheque', 'standing_order'
    ];
    if (!manualMethods.includes(payment_method)) {
      return badRequest(
        `Payment method "${payment_method}" cannot be entered manually. ` +
        `Pesapal payments are recorded automatically.`
      );
    }

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    // Look up the fund to check for split rule
    const { data: fund, error: fundError } = await supabaseAdmin
      .from('funds')
      .select('id, name, category, has_split_rule, split_local_percent, split_conference_percent, forwarded_to_conference')
      .eq('id', fund_id)
      .eq('church_id', churchId)
      .single();

    if (fundError || !fund) return badRequest('Fund not found.');

    // Look up member to check digital receipt preference
    let digitalReceiptOptedIn = false;
    if (member_id) {
      const { data: member } = await supabaseAdmin
        .from('church_members')
        .select('digital_statements_opted_in, phone')
        .eq('id', member_id)
        .eq('church_id', churchId)
        .single();

      digitalReceiptOptedIn = member?.digital_statements_opted_in ?? false;
    }

    const shouldSendReceipt = send_receipt_override ?? digitalReceiptOptedIn;
    const merchantReference = `MAN-${Date.now()}-${randomUUID().slice(0, 8)}`;

    // ---- Handle Combined Offering split rule ----
    if (fund.has_split_rule) {
      const localPercent      = Number(fund.split_local_percent) / 100;
      const conferencePercent = Number(fund.split_conference_percent) / 100;
      const localAmount       = Math.round(amount * localPercent * 100) / 100;
      const conferenceAmount  = Math.round(amount * conferencePercent * 100) / 100;

      // Find local fund (Local Church Budget)
      const { data: localFund } = await supabaseAdmin
        .from('funds')
        .select('id')
        .eq('church_id', churchId)
        .eq('name', 'Combined Offering — Local Church Budget')
        .single();

      // Insert parent record (total amount, Combined Offering fund)
      const { data: parentDonation, error: parentError } = await supabaseAdmin
        .from('donations')
        .insert({
          church_id:           churchId,
          fund_id,
          member_id:           member_id ?? null,
          amount,
          currency,
          payment_method,
          merchant_reference:  merchantReference,
          status:              'COMPLETED',
          entry_method:        'manual',
          entered_by:          entered_by ?? null,
          confirmation_code:   reference_number ?? null,
          digital_receipt_sent: false,
          send_receipt_override: shouldSendReceipt,
          is_split_child:      false,
          raw_ipn_payload:     notes ? { notes } : null,
          created_at:          date_received
            ? new Date(date_received).toISOString()
            : new Date().toISOString(),
        })
        .select()
        .single();

      if (parentError) {
        console.error('Split parent donation error:', parentError);
        return serverError('Could not record the Combined Offering gift.');
      }

      // Insert local portion child record
      await supabaseAdmin.from('donations').insert({
        church_id:          churchId,
        fund_id:            localFund?.id ?? fund_id,
        member_id:          member_id ?? null,
        amount:             localAmount,
        currency,
        payment_method,
        merchant_reference: `${merchantReference}-LOCAL`,
        status:             'COMPLETED',
        entry_method:       'manual',
        entered_by:         entered_by ?? null,
        is_split_child:     true,
        split_parent_id:    parentDonation.id,
        forwarded_to_conference: false,
        digital_receipt_sent: false,
      });

      // Insert conference portion child record
      await supabaseAdmin.from('donations').insert({
        church_id:          churchId,
        fund_id,
        member_id:          member_id ?? null,
        amount:             conferenceAmount,
        currency,
        payment_method,
        merchant_reference: `${merchantReference}-CONF`,
        status:             'COMPLETED',
        entry_method:       'manual',
        entered_by:         entered_by ?? null,
        is_split_child:     true,
        split_parent_id:    parentDonation.id,
        forwarded_to_conference: false, // pending remittance
        digital_receipt_sent: false,
      });

      return created({
        message: `Combined Offering of KES ${amount.toLocaleString()} recorded. ` +
                 `KES ${localAmount.toLocaleString()} credited to local church, ` +
                 `KES ${conferenceAmount.toLocaleString()} pending Union remittance.`,
        donation:        parentDonation,
        split: {
          local_amount:      localAmount,
          conference_amount: conferenceAmount,
        },
        receipt_queued: shouldSendReceipt,
      });
    }

    // ---- Standard fund (no split) ----
    const { data: donation, error: donationError } = await supabaseAdmin
      .from('donations')
      .insert({
        church_id:           churchId,
        fund_id,
        member_id:           member_id ?? null,
        amount,
        currency,
        payment_method,
        merchant_reference:  merchantReference,
        status:              'COMPLETED',
        entry_method:        'manual',
        entered_by:          entered_by ?? null,
        confirmation_code:   reference_number ?? null,
        forwarded_to_conference: fund.forwarded_to_conference,
        digital_receipt_sent: false,
        send_receipt_override: shouldSendReceipt,
        is_split_child:      false,
        raw_ipn_payload:     notes ? { notes } : null,
        created_at:          date_received
          ? new Date(date_received).toISOString()
          : new Date().toISOString(),
      })
      .select()
      .single();

    if (donationError) {
      console.error('Manual donation error:', donationError);
      return serverError('Could not record the gift.');
    }

    return created({
      message: `Gift of KES ${amount.toLocaleString()} to ${fund.name} recorded successfully.`,
      donation,
      receipt_queued: shouldSendReceipt,
    });

  } catch (err) {
    console.error('Manual giving POST exception:', err);
    return serverError();
  }
}

// ============================================================
// GET /api/treasurer/giving
// Returns giving ledger with filters.
// ============================================================

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const fundId     = searchParams.get('fund_id');
    const memberId   = searchParams.get('member_id');
    const method     = searchParams.get('payment_method');
    const status     = searchParams.get('status') ?? 'COMPLETED';
    const dateFrom   = searchParams.get('date_from');
    const dateTo     = searchParams.get('date_to');
    const reportMode = searchParams.get('report') === 'true';
    const limit      = parseInt(searchParams.get('limit') ?? '100');
    const offset     = parseInt(searchParams.get('offset') ?? '0');

    const churchId = process.env.SHAURI_MOYO_CHURCH_ID;
    if (!churchId) return serverError('Church ID not configured.');

    let query = supabaseAdmin
      .from('donations')
      .select(`
        id,
        amount,
        currency,
        payment_method,
        entry_method,
        status,
        confirmation_code,
        is_split_child,
        forwarded_to_conference,
        forwarded_date,
        forwarding_reference,
        digital_receipt_sent,
        created_at,
        fund_id,
        funds ( name, category, forwarded_to_conference ),
        member_id,
        church_members ( first_name, last_name, member_number, phone )
      `, { count: 'exact' })
      .eq('church_id', churchId)
      .eq('is_split_child', false) // only show parent records
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fundId)   query = query.eq('fund_id', fundId);
    if (memberId) query = query.eq('member_id', memberId);
    if (method)   query = query.eq('payment_method', method);
    if (status)   query = query.eq('status', status);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo)   query = query.lte('created_at', dateTo + 'T23:59:59Z');

    const { data, error, count } = await query;
    if (error) {
      console.error('Giving ledger GET error:', error);
      return serverError('Could not retrieve giving ledger.');
    }

    // Report mode: pseudonymise member names
    const records = (data || []).map(d => {
      const member = d.church_members as any;
      return {
        ...d,
        church_members: reportMode && member
          ? {
              display_name: `${member.first_name} ${member.last_name.charAt(0)}.`,
              member_number: member.member_number,
            }
          : member,
      };
    });

    // Fund balance summary
    const { data: balances } = await supabaseAdmin
      .from('donations')
      .select('fund_id, amount, funds(name, category)')
      .eq('church_id', churchId)
      .eq('status', 'COMPLETED')
      .eq('is_split_child', false);

    const fundTotals: Record<string, { name: string; category: string; total: number }> = {};
    (balances || []).forEach(b => {
      const fund = b.funds as any;
      if (!fundTotals[b.fund_id]) {
        fundTotals[b.fund_id] = { name: fund?.name, category: fund?.category, total: 0 };
      }
      fundTotals[b.fund_id].total += Number(b.amount);
    });

    return ok({
      records,
      total_count: count ?? 0,
      fund_totals: fundTotals,
    });

  } catch (err) {
    console.error('Giving ledger GET exception:', err);
    return serverError();
  }
}
