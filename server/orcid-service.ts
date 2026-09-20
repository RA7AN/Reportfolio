interface ORCIDWork {
  'put-code': number;
  'work-summary': {
    title: {
      title: {
        value: string;
      };
    };
    'journal-title': {
      value: string;
    } | null;
    'publication-date': {
      year: {
        value: string;
      };
      month?: {
        value: string;
      };
    } | null;
    type: string;
    'external-ids': {
      'external-id': Array<{
        'external-id-type': string;
        'external-id-value': string;
        'external-id-url': {
          value: string;
        } | null;
      }>;
    } | null;
  }[];
}

interface ORCIDResponse {
  'works-summary': {
    group: ORCIDWork[];
  };
}

interface Publication {
  title: string;
  venue: string | null;
  year: string;
  type: string;
  doi?: string;
  url?: string;
  putCode: number;
}

export class ORCIDService {
  private static orcidId = process.env.ORCID_ID || "0009-0008-1838-7713";
  private static baseUrl = "https://pub.orcid.org/v3.0";

  static async fetchORCIDPublications(): Promise<Publication[]> {
    try {
      // Fetch works summary
      const summaryResponse = await fetch(
        `${this.baseUrl}/${this.orcidId}/works`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!summaryResponse.ok) {
        throw new Error(`HTTP error! status: ${summaryResponse.status}`);
      }

      const summaryData: ORCIDResponse = await summaryResponse.json();
      const publications: Publication[] = [];

      // Process each work group
      for (const group of summaryData['works-summary']?.group || []) {
        for (const workSummary of group['work-summary']) {
          const title = workSummary.title?.title?.value;
          const venue = workSummary['journal-title']?.value || null;
          const year = workSummary['publication-date']?.year?.value || 'Unknown';
          const type = workSummary.type || 'publication';

          if (!title) continue;

          // Extract DOI and URL from external IDs
          let doi: string | undefined;
          let url: string | undefined;

          if (workSummary['external-ids']?.['external-id']) {
            for (const externalId of workSummary['external-ids']['external-id']) {
              if (externalId['external-id-type'] === 'doi') {
                doi = externalId['external-id-value'];
                url = `https://doi.org/${doi}`;
              } else if (externalId['external-id-url']) {
                url = url || externalId['external-id-url'].value;
              }
            }
          }

          publications.push({
            title,
            venue,
            year,
            type: this.normalizePublicationType(type),
            doi,
            url,
            putCode: group['put-code']
          });
        }
      }

      // Sort by year (newest first)
      return publications.sort((a, b) => 
        parseInt(b.year) - parseInt(a.year)
      );

    } catch (error) {
      console.error('Failed to fetch ORCID publications:', error);
      return [];
    }
  }

  private static normalizePublicationType(orcidType: string): string {
    const typeMap: Record<string, string> = {
      'journal-article': 'Journal',
      'conference-paper': 'Conference',
      'book': 'Book',
      'book-chapter': 'Book Chapter',
      'working-paper': 'Preprint',
      'report': 'Report',
      'website': 'Blog',
      'other': 'Other'
    };

    return typeMap[orcidType.toLowerCase()] || 'Publication';
  }

  static async getPublicationStats(): Promise<{totalPublications: number, byType: Record<string, number>, years: string[]}> {
    const publications = await this.fetchORCIDPublications();
    
    const byType: Record<string, number> = {};
    const years: Set<string> = new Set();

    for (const pub of publications) {
      byType[pub.type] = (byType[pub.type] || 0) + 1;
      years.add(pub.year);
    }

    return {
      totalPublications: publications.length,
      byType,
      years: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a))
    };
  }
}