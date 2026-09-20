import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, Calendar, Building, Award } from "lucide-react";

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  dateLabel: string;
  year: string;
  fileUrl: string;
  credentialId?: string;
  verificationUrl?: string;
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border border-gray-200 h-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Certificate Preview */}
          <div className="aspect-[4/3] bg-gray-50 rounded-lg overflow-hidden border">
            {!imageError ? (
              <img
                src={certificate.fileUrl}
                alt={`${certificate.title} certificate`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Award className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Certificate Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {certificate.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Building className="w-4 h-4" />
                <span>{certificate.issuer}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{certificate.dateLabel}</span>
            </div>

            {certificate.credentialId && (
              <div className="space-y-1">
                <Badge variant="secondary" className="text-xs">
                  ID: {certificate.credentialId}
                </Badge>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex-1">
                  View Certificate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>{certificate.title}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <iframe
                    src={certificate.fileUrl}
                    className="w-full h-[70vh] border rounded"
                    title={`${certificate.title} certificate`}
                  />
                </div>
              </DialogContent>
            </Dialog>

            {certificate.verificationUrl && (
              <Button 
                size="sm" 
                variant="outline"
                asChild
              >
                <a 
                  href={certificate.verificationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Verify
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function YearSection({ year, certificates }: { year: string; certificates: Certificate[] }) {
  return (
    <section className="space-y-6">
      <div className="border-b border-gray-200 pb-2">
        <h2 className="text-2xl font-bold text-gray-900">{year}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {certificates.length} certificate{certificates.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((certificate) => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </div>
    </section>
  );
}

export default function CertificatesPage() {
  const { data: certificates, isLoading, error } = useQuery({
    queryKey: ['certificates'],
    queryFn: async (): Promise<Certificate[]> => {
      const response = await fetch('/api/certificates');
      if (!response.ok) {
        throw new Error('Failed to fetch certificates');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Container>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
            <p className="text-gray-600 mt-2">Loading certificates...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-80 animate-pulse">
                <CardContent className="p-6">
                  <div className="bg-gray-200 aspect-[4/3] rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Certificates</h1>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </Container>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <Container>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Certificates</h1>
          <p className="text-gray-600">No certificates found.</p>
        </div>
      </Container>
    );
  }

  // Group certificates by year
  const certificatesByYear = certificates.reduce((acc, cert) => {
    const year = cert.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(cert);
    return acc;
  }, {} as Record<string, Certificate[]>);

  // Sort years in descending order
  const sortedYears = Object.keys(certificatesByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <Container>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Certificates</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional certifications and credentials demonstrating continuous learning 
            and expertise across various domains.
          </p>
          <div className="text-sm text-gray-500">
            {certificates.length} total certificate{certificates.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Certificates by Year */}
        <div className="space-y-12">
          {sortedYears.map((year) => (
            <YearSection 
              key={year} 
              year={year} 
              certificates={certificatesByYear[year]} 
            />
          ))}
        </div>
      </div>
    </Container>
  );
}