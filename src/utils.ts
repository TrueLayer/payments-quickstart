export function decodeBase64(value?: string): string {
  if (!value) return '';
  return Buffer.from(value, 'base64').toString('utf8');
}
