import { companyLogoSrc } from '@/components/home/company-logos';
import { cn } from '@/lib/utils';
import Image from 'next/image';

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function CompanyMark({
  company,
  className,
  imgClassName,
  current = false,
}: {
  company: string;
  className?: string;
  imgClassName?: string;
  current?: boolean;
}) {
  const src = companyLogoSrc(company);

  return (
    <span className={cn('relative z-10 shrink-0', className)}>
      <span className="bg-muted flex size-full items-center justify-center overflow-hidden rounded-[10px] text-[10px] font-medium">
        {src ? (
          <Image
            src={src}
            alt=""
            width={36}
            height={36}
            className={cn('size-full object-contain', imgClassName)}
          />
        ) : (
          initials(company)
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
