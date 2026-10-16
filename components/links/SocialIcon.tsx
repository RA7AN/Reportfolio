import {
  Facebook,
  Github,
  IdCard,
  Instagram,
  Linkedin,
  Mail,
  Rss,
  Twitter,
  Youtube,
} from 'lucide-react';
import type { SocialIconName } from '@/lib/content/schemas';
import type { ComponentType } from 'react';

// every name in socialIconNames needs an entry here — the Record type makes a
// missing one a compile error rather than a blank spot on the page
const ICONS: Record<SocialIconName, ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  // lucide has no ORCID mark; an ID card stands in for the researcher identifier
  orcid: IdCard,
  mail: Mail,
  rss: Rss,
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
};

export function SocialIcon({
  name,
  className = 'size-[18px]',
}: {
  name: SocialIconName;
  className?: string;
}) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
