import type { Metadata } from 'next';
import Link from 'next/link';
import { CertificateCard } from '@/components/certificates/CertificateCard';
import { Container } from '@/components/layout/Container';
import { PageShell } from '@/components/layout/PageShell';
import { getCertificates } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Certificates',
  description: 'Professional certifications and credentials.',
};

export default function CertificatesPage() {
  const certificates = getCertificates();
  const byYear = certificates.reduce<Record<string, typeof certificates>>((acc, cert) => {
    (acc[cert.year] ??= []).push(cert);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <PageShell>
      <main>
        <Container className="max-w-5xl pt-12 pb-24">
          <h1 className="font-mono text-[11px] tracking-[0.22em] uppercase">Certificates</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            {certificates.length} credential{certificates.length === 1 ? '' : 's'}.
          </p>
          {years.map((year) => (
            <section key={year} className="mt-12">
              <h2 className="font-mono text-[11px] tracking-[0.16em] uppercase">{year}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {byYear[year].map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
            </section>
          ))}
          <Link
            href="/resume"
            className="text-muted-foreground hover:text-foreground mt-10 inline-block font-mono text-[11px] tracking-[0.16em] uppercase"
          >
            Back to CV
          </Link>
        </Container>
      </main>
    </PageShell>
  );
}
