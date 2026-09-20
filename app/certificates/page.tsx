import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
      <main className="pb-16 md:pb-24">
        <Container>
          <div className="space-y-12 pt-10 md:pt-14">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold">Certificates</h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                Professional certifications and credentials demonstrating continuous learning and
                expertise across various domains.
              </p>
              <div className="text-muted-foreground text-sm">
                {certificates.length} total certificate{certificates.length !== 1 ? 's' : ''}
              </div>
            </div>
            {years.map((year) => (
              <section key={year} className="space-y-6">
                <div className="border-border border-b pb-2">
                  <h2 className="text-2xl font-bold">{year}</h2>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {byYear[year].length} certificate{byYear[year].length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {byYear[year].map((certificate) => (
                    <CertificateCard key={certificate.id} certificate={certificate} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </main>
    </PageShell>
  );
}
