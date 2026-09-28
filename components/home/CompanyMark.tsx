import { companyLogoSrc } from '@/components/home/company-logos';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .filter((char) => /[a-z0-9]/i.test(char))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function CompanyMark({
  company,
  src: srcOverride,
  size = 36,
  className,
  imgClassName,
  current = false,
}: {
  company: string;
  src?: string | null;
  size?: number;
  className?: string;
  imgClassName?: string;
  current?: boolean;
}) {
  const src = srcOverride ?? companyLogoSrc(company);

  return (
    <span className={cn('relative z-10 shrink-0', className)}>
      <span className="bg-muted flex size-full items-center justify-center overflow-hidden rounded-[10px] font-medium">
        {src ? (
          <Image
            src={src}
            alt=""
            width={size}
            height={size}
            className={cn('size-full object-contain', imgClassName)}
          />
        ) : (
          <span style={{ fontSize: Math.max(10, Math.round(size * 0.28)) }}>
            {initials(company)}
          </span>
        )}
      </span>
      {current ? (
        <span
          aria-hidden
          className="ring-background absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#3dba6a] ring-2"
        />
      ) : null}
    </span>
  );
}
