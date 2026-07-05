// ============================================================
// KANISA — SHARED TYPES
// Used across all API routes. Keep in sync with the database schema.
// ============================================================

export type MembershipStatus =
  | 'active'
  | 'inactive'
  | 'transferred_in'
  | 'transferred_out'
  | 'deceased'
  | 'visitor';

export type VisitorType =
  | 'first_time'
  | 'returning_visitor'
  | 'returning_member';

export type ServiceType =
  | 'sabbath_school'
  | 'divine_service'
  | 'afternoon_service'
  | 'midweek_prayer'
  | 'other';

export type RegistrationChannel =
  | 'whatsapp'
  | 'ussd'
  | 'leader'
  | 'teacher'
  | 'manual';

export type PaymentMethod =
  | 'mpesa_pesapal'
  | 'card_pesapal'
  | 'mpesa_paybill'
  | 'bank_transfer'
  | 'cash'
  | 'cheque'
  | 'standing_order';

export type DonationStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED';

export type FundCategory =
  | 'conference'
  | 'local'
  | 'special';

// ---- API response helpers ----

export function ok<T>(data: T) {
  return Response.json(data, { status: 200 });
}

export function created<T>(data: T) {
  return Response.json(data, { status: 201 });
}

export function badRequest(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(message = 'Not found') {
  return Response.json({ error: message }, { status: 404 });
}

export function serverError(message = 'Internal server error') {
  return Response.json({ error: message }, { status: 500 });
}

// ---- Pseudonymisation ----
// All reports and exports use this format: "John M. — SM-0047"
// Full details only available to authorised roles server-side.

export function pseudonymise(
  firstName: string,
  lastName: string,
  memberNumber: string
): string {
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() + '.' : '';
  return `${firstName} ${lastInitial} — ${memberNumber}`;
}

// ---- WhatsApp attendance reply parser ----
// Members reply to Saturday prompt with a single digit.
// Returns the list of services attended.

export function parseAttendanceReply(
  messageBody: string
): ServiceType[] | null {
  const trimmed = messageBody.trim();
  switch (trimmed) {
    case '1':
      return ['sabbath_school'];
    case '2':
      return ['divine_service'];
    case '3':
      return ['sabbath_school', 'divine_service'];
    case '4':
      return ['sabbath_school', 'divine_service', 'afternoon_service'];
    case '0':
      return []; // member was absent — record zero services
    default:
      return null; // unrecognised reply
  }
}

// ---- Date helpers ----

export function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function isSaturday(): boolean {
  return new Date().getDay() === 6;
}
