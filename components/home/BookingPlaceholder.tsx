const days = Array.from({ length: 31 }, (_, i) => i + 1);

export function BookingPlaceholder({ email }: { email: string }) {
  return (
    <section className="pt-28 pb-8" id="work-with-me">
      <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
        work with me
      </p>
      <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-3xl">
        have a product that needs someone who ships?
      </h2>
      <p className="text-muted-foreground mt-2 text-[13px]">
        grab 30 minutes. bring the messy version, that is the fun part.
      </p>
      <div className="border-border mt-8 overflow-hidden rounded-2xl border">
        <div className="grid md:grid-cols-[14rem_1fr_10rem]">
          <div className="border-border border-b p-5 md:border-r md:border-b-0">
            <p className="text-[13px] font-medium">Abdul Jawwad</p>
            <p className="mt-2 text-[16px]">15 Min Meeting</p>
            <p className="text-muted-foreground mt-4 text-[12px]">15m · placeholder call</p>
            <p className="text-muted-foreground mt-1 text-[12px]">Asia/Riyadh</p>
          </div>
          <div className="border-border p-5 md:border-r">
            <p className="mb-4 text-[13px] font-medium">October 2026</p>
            <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-[11px]">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={`${d}-${i}`}>{d}</span>
              ))}
              {days.map((day) => (
                <span
                  key={day}
                  className={
                    day === 1 ? 'bg-foreground text-background rounded-md py-1' : 'rounded-md py-1'
                  }
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          <div className="text-muted-foreground flex items-center justify-center p-5 text-[13px]">
            all booked.
          </div>
        </div>
        <p className="border-border text-muted-foreground border-t py-3 text-center text-[12px]">
          calendar placeholder · not Cal.com
        </p>
      </div>
      <p className="text-muted-foreground mt-4 text-[13px]">
        calendars not your thing?{' '}
        <a className="text-foreground decoration-border underline" href={`mailto:${email}`}>
          {email}
        </a>{' '}
        works just as well.
      </p>
    </section>
  );
}
