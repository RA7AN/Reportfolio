export const COMPANY_LOGOS: Record<string, string> = {
  'Revent Lab': '/companies/revent.jpeg',
  'Deccan AI': '/companies/deccan-ai.jpeg',
  'Deccan AI Experts': '/companies/deccan-ai-experts.jpeg',
  'MDS for Computer Systems': '/companies/mds.jpeg',
  'ACIC-CBIT': '/companies/acic-cbit.jpeg',
  'Indian School of Business': '/companies/isb.jpeg',
};

export function companyLogoSrc(company: string) {
  return COMPANY_LOGOS[company] ?? null;
}
