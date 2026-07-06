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

// ---- Form validation helpers ----
// Shared across public-facing forms (prayer request, meeting request,
// giving) and their API routes, so client and server always agree.

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Accepts Kenyan mobile formats: 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX,
// +2541XXXXXXXX, 2547XXXXXXXX, 2541XXXXXXXX (spaces/dashes ignored).
export function isValidKenyanPhone(value: string): boolean {
  const digits = value.replace(/[\s-]/g, '');
  return /^(?:\+?254|0)(7|1)\d{8}$/.test(digits);
}

// Formats a raw numeric-ish string with thousands separators as the
// user types, e.g. "2000" -> "2,000". Strips non-digit characters first.
export function formatAmountInput(value: string): string {
  const digitsOnly = value.replace(/[^\d]/g, '');
  if (!digitsOnly) return '';
  return Number(digitsOnly).toLocaleString('en-US');
}

export const PRAYER_CATEGORIES: { value: string; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'health', label: 'Health & healing' },
  { value: 'family', label: 'Family' },
  { value: 'financial', label: 'Financial' },
  { value: 'thanksgiving', label: 'Thanksgiving' },
  { value: 'other', label: 'Other' },
];

export const MEETING_MODES: { value: string; label: string }[] = [
  { value: 'in_person', label: 'In person' },
  { value: 'phone_call', label: 'Phone call' },
  { value: 'video_call', label: 'Video call' },
];
