'use client';

import { useState } from 'react';
import { Award, Building, Calendar, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Certificate } from '@/lib/content/schemas';

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="border-border bg-card h-full rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
      <div className="space-y-4">
        <div className="bg-muted aspect-[4/3] overflow-hidden rounded-lg border">
          {!imageError && !certificate.fileUrl.endsWith('.pdf') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={certificate.fileUrl}
              alt={`${certificate.title} certificate`}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
              <Award className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg leading-tight font-semibold">{certificate.title}</h3>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
              <Building className="h-4 w-4" />
              <span>{certificate.issuer}</span>
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{certificate.dateLabel}</span>
          </div>
          {certificate.credentialId && <Badge>ID: {certificate.credentialId}</Badge>}
        </div>
        <div className="flex gap-2 pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1">
                View Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl">
              <DialogHeader>
                <DialogTitle>{certificate.title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <iframe
                  src={certificate.fileUrl}
                  className="h-[70vh] w-full rounded border"
                  title={`${certificate.title} certificate`}
                />
              </div>
            </DialogContent>
          </Dialog>
          {certificate.verificationUrl && (
            <Button size="sm" variant="outline" asChild>
              <a
                href={certificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Verify
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
