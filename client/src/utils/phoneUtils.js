export function normalizePhoneForWhatsApp(phone, { defaultCountryCode = '54' } = {}) {
  if (!phone && phone !== 0) return null;
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (!digits.startsWith(String(defaultCountryCode))) {
    digits = `${defaultCountryCode}${digits}`;
  }
  return digits;
}

export function buildWhatsAppUrl(phone, { message, defaultCountryCode = '54' } = {}) {
  const normalized = normalizePhoneForWhatsApp(phone, { defaultCountryCode });
  if (!normalized) return null;
  const url = new URL(`https://wa.me/${normalized}`);
  if (message) url.searchParams.set('text', message);
  return url.toString();
}
