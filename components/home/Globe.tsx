'use client';

import { useEffect, useRef, useState } from 'react';

const JEDDAH: [number, number] = [21.5433, 39.1728];

type Visitor = { lat: number; lon: number; city: string };

function toXYZ(lat: number, lon: number): [number, number, number] {
  const φ = (lat * Math.PI) / 180;
  const λ = (lon * Math.PI) / 180 - Math.PI;
  const c = Math.cos(φ);
  return [-c * Math.cos(λ), Math.sin(φ), c * Math.sin(λ)];
}

function project(
  xyz: [number, number, number],
  phi: number,
  theta: number,
  aspect: number,
): { x: number; y: number; visible: boolean } {
  const cosT = Math.cos(theta);
  const cosP = Math.cos(phi);
  const sinT = Math.sin(theta);
  const sinP = Math.sin(phi);
  const x = cosP * xyz[0] + sinP * xyz[2];
  const y = sinP * sinT * xyz[0] + cosT * xyz[1] - cosP * sinT * xyz[2];
  const z = -sinP * cosT * xyz[0] + sinT * xyz[1] + cosP * cosT * xyz[2];
  const visible = z >= 0 || x * x + y * y >= 0.64;
  return {
    x: (x / aspect + 1) / 2,
    y: (-y + 1) / 2,
    visible,
  };
}

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [temp, setTemp] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('https://ipwho.is/')
      .then((res) => res.json())
      .then((data: { success?: boolean; latitude?: number; longitude?: number; city?: string }) => {
        if (cancelled || !data?.success || data.latitude == null || data.longitude == null) return;
        setVisitor({
          lat: data.latitude,
          lon: data.longitude,
          city: (data.city || 'you').toLowerCase(),
        });
      })
      .catch(() => undefined);
    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=21.5433&longitude=39.1728&current=temperature_2m',
    )
      .then((res) => res.json())
      .then((data: { current?: { temperature_2m?: number } }) => {
        if (cancelled || data.current?.temperature_2m == null) return;
        setTemp(Math.round(data.current.temperature_2m));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    let globe: { update: (state: object) => void; destroy: () => void } | null = null;
    let raf = 0;
    let phi = 2.35;
    const theta = 0.28;
    let dragging = false;
    let lastX = 0;
    let width = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const markers = [
      {
        id: 'jeddah',
        location: JEDDAH,
        size: 0.06,
        color: [0.91, 0.48, 0.18] as [number, number, number],
      },
      ...(visitor
        ? [
            {
              id: 'you',
              location: [visitor.lat, visitor.lon] as [number, number],
              size: 0.07,
              color: [0.45, 0.32, 0.95] as [number, number, number],
            },
          ]
        : []),
    ];

    const tick = () => {
      if (!dragging && !reduce) phi += 0.003;
      globe?.update({ phi, theta, markers });
      if (width > 0 && overlayRef.current) {
        const aspect = 1;
        const nodes = overlayRef.current.querySelectorAll<HTMLElement>('[data-pin]');
        for (const node of nodes) {
          const lat = Number(node.dataset.lat);
          const lon = Number(node.dataset.lon);
          const p = project(toXYZ(lat, lon), phi, theta, aspect);
          node.style.left = `${p.x * 100}%`;
          node.style.top = `${p.y * 100}%`;
          node.style.opacity = p.visible ? '1' : '0';
        }
      }
      raf = window.requestAnimationFrame(tick);
    };

    const start = async () => {
      const { default: createGlobe } = await import('cobe');
      width = wrap.clientWidth;
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi,
        theta,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 20000,
        mapBrightness: 4.2,
        mapBaseBrightness: 0.04,
        baseColor: [1, 1, 1],
        markerColor: [0.91, 0.48, 0.18],
        glowColor: [0.12, 0.12, 0.12],
        markers,
        scale: 1.05,
      });
      tick();
    };

    void start();

    const onDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!dragging) return;
      phi += (event.clientX - lastX) * 0.005;
      lastX = event.clientX;
    };
    const onUp = () => {
      dragging = false;
    };
    const onResize = () => {
      width = wrap.clientWidth;
      globe?.update({ width, height: width });
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      globe?.destroy();
    };
  }, [visitor]);

  return (
    <section className="pt-20" id="globe">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-muted-foreground mb-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            right now
          </p>
          <h2 className="text-[1.65rem] leading-tight tracking-tight sm:text-3xl">
            two dots on a globe
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[#c4c2ba]">
            you are somewhere on this globe, that much I know.
          </p>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[#c4c2ba]">
            I am in <span className="text-foreground">jeddah</span>
            {temp != null ? (
              <>
                , where it is <span className="text-foreground">{temp}°C</span>
              </>
            ) : null}
            . small world.
          </p>
          <p className="font-hand text-note mt-6 text-xl">give it a spin</p>
        </div>
        <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[420px]">
          <canvas
            ref={canvasRef}
            className="aspect-square h-full w-full cursor-grab touch-none active:cursor-grabbing"
            aria-label="a globe marking where you and I are right now"
          />
          <div ref={overlayRef} className="pointer-events-none absolute inset-0" aria-hidden>
            <span
              data-pin
              data-lat={JEDDAH[0]}
              data-lon={JEDDAH[1]}
              className="text-foreground absolute flex -translate-x-1/2 -translate-y-full items-center gap-1.5 text-[11px]"
              style={{ zIndex: 20 }}
            >
              <span className="inline-block size-3.5 rounded-full bg-[#e07a2f] shadow-[0_0_0_3px_rgba(10,10,10,0.55)]" />
              jeddah
            </span>
            {visitor ? (
              <span
                data-pin
                data-lat={visitor.lat}
                data-lon={visitor.lon}
                className="text-foreground absolute flex -translate-x-1/2 -translate-y-full items-center gap-1.5 text-[11px]"
                style={{ zIndex: 30 }}
              >
                <span className="inline-block size-3.5 rounded-full bg-[#7c6cf5] shadow-[0_0_0_3px_rgba(10,10,10,0.55)]" />
                {visitor.city}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
