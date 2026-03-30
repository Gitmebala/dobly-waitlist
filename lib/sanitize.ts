export function sanitizeText(value: string, maxLength: number) {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function sanitizeEmail(value: string) {
  return sanitizeText(value.toLowerCase(), 255);
}

export function getClientIp(forwardedFor: string | null, realIp: string | null) {
  return forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';
}
