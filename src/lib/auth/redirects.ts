export type DomainRedirectMap = Record<string, string>;

// Central mapping of email domain -> app route.
// Edit this to fit your needs. Keys are checked case-insensitively.
export const DOMAIN_REDIRECTS: DomainRedirectMap = {
  // Example mappings:
  'foliotechinstitute.com': '/dashboard',
  // 'client.com': '/partner',
  // 'school.edu': '/students',  
};

export function getRedirectPathForEmail(email: string | null | undefined): string {
  if (!email || !email.includes('@')) return '/';
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return '/';
  return DOMAIN_REDIRECTS[domain] ?? '/';
}


