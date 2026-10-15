'use client';

import { useEffect, useRef, useState } from 'react';
import { HandNote } from '@/components/layout/SiteIcons';

const JEDDAH: [number, number] = [21.5433, 39.1728];

// the places strung across this map, jeddah first so it keeps the amber pin.
// "lift" floats a name higher above its pin: madinah and doha land close enough
// on the globe that their pills would stack on top of each other otherwise.
const CITIES: { name: string; at: [number, number]; lift: number }[] = [
  { name: 'jeddah', at: JEDDAH, lift: 0 },
  { name: 'madinah', at: [24.4686, 39.6142], lift: 18 },
  { name: 'doha', at: [25.2854, 51.531], lift: 36 },
  { name: 'hyderabad', at: [17.385, 78.4867], lift: 0 },
];

// cobe draws the sphere at ~84% of the canvas half-width (its scale option is
// 1.05 here), so anchoring a pin with the full [-1, 1] projection leaves it
// floating well outside the globe at the limb. Measured off a rendered frame:
// silhouette 177px against a 210px canvas half-width.
const GLOBE_RADIUS = 0.84;

type Tone = 'amber' | 'white' | 'violet';

const PIN_COLOR: Record<Tone, string> = {
  amber: '#e8b923',
  white: '#edebe6',
  violet: '#7c6cf5',
};

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
): { x: number; y: number; z: number } {
  const cosT = Math.cos(theta);
  const cosP = Math.cos(phi);
  const sinT = Math.sin(theta);
  const sinP = Math.sin(phi);
  const x = cosP * xyz[0] + sinP * xyz[2];
  const y = sinP * sinT * xyz[0] + cosT * xyz[1] - cosP * sinT * xyz[2];
  const z = -sinP * cosT * xyz[0] + sinT * xyz[1] + cosP * cosT * xyz[2];
  return {
    x: (x / aspect + 1) / 2,
    y: (-y + 1) / 2,
    z,
  };
}

// 0 at edge0, 1 at edge1, eased — used to fade a marker in as it comes round
function smoothstep(value: number, edge0: number, edge1: number) {
  const t = Math.min(Math.max((value - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

// a pin planted on the globe: the drop tip sits exactly on the city, the pulse
// radiates from that tip, and the name rides above it. The loop drives the
// container's position/opacity/scale and the pill's opacity, nothing else here.
function Marker({
  label,
  lat,
  lon,
  tone,
  lift = 0,
}: {
  label: string;
  lat: number;
  lon: number;
  tone: Tone;
  lift?: number;
}) {
  const color = PIN_COLOR[tone];
  return (
    <span
      data-pin
      data-lat={lat}
      data-lon={lon}
      className="absolute flex flex-col items-center"
      style={{ opacity: 0 }}
    >
      <span
        data-pill
        className="text-foreground mb-1 flex max-w-36 items-center gap-1.5 rounded-full border border-white/10 bg-[#131313]/92 py-1 pr-1 pl-1 whitespace-nowrap"
        style={{ opacity: 0, marginBottom: lift + 5 }}
      >
        <span className="size-4 shrink-0 rounded-full" style={{ backgroundColor: color }} />
        <span className="min-w-0 truncate font-mono text-[11px] leading-4">{label}</span>
        <span className="grid size-4 shrink-0 place-items-center rounded-full bg-white/10 text-[9px] leading-none text-white/60">
          ?
        </span>
      </span>
      <span className="relative flex flex-col items-center">
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <span
            className="dot-ping block size-2.5 rounded-full opacity-50"
            style={{ backgroundColor: color }}
          />
        </span>
        <svg viewBox="0 0 16 22" className="h-4 w-3" aria-hidden>
          <path
            fill={color}
            d="M8 0C3.58 0 0 3.58 0 8c0 5.5 8 14 8 14s8-8.5 8-14c0-4.42-3.58-8-8-8Z"
          />
          <circle cx="8" cy="8" r="3" fill="#0a0a0a" />
        </svg>
      </span>
    </span>
  );
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
    let disposed = false;
    let phi = 2.35;
    const theta = 0.28;
    let dragging = false;
    let lastX = 0;
    let width = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // every city is a dom pin drop, so cobe only draws the globe itself

    // the pill inside a pin is looked up once per node instead of every frame
    const pills = new WeakMap<HTMLElement, HTMLElement | null>();
    const pillOf = (node: HTMLElement) => {
      let pill = pills.get(node);
      if (pill === undefined) {
        pill = node.querySelector<HTMLElement>('[data-pill]');
        pills.set(node, pill);
      }
      return pill;
    };

    const paint = () => {
      if (!overlayRef.current) return;
      const nodes = overlayRef.current.querySelectorAll<HTMLElement>('[data-pin]');
      for (const node of nodes) {
        const lat = Number(node.dataset.lat);
        const lon = Number(node.dataset.lon);
        const p = project(toXYZ(lat, lon), phi, theta, 1);
        // a marker comes round the limb before it faces us: the pin and its pulse
        // fade in off the edge, and the name only lands once the city is fronting up
        const approach = smoothstep(p.z, -0.22, 0.08);
        const named = smoothstep(p.z, 0.06, 0.42);
        // pull the anchor in to the drawn sphere so an edge pin sits on the globe
        node.style.left = `${(0.5 + (p.x - 0.5) * GLOBE_RADIUS) * 100}%`;
        node.style.top = `${(0.5 + (p.y - 0.5) * GLOBE_RADIUS) * 100}%`;
        node.style.opacity = `${approach}`;
        node.style.transform = `translate(-50%, -100%) scale(${(0.84 + 0.16 * approach).toFixed(3)})`;
        // depth sort so a pin in front covers the one behind it in a cluster
        node.style.zIndex = String(200 + Math.round(p.z * 100));
        const pill = pillOf(node);
        if (pill) {
          pill.style.opacity = `${named}`;
          // a pill at partial opacity would still paint a ghost of the name over
          // its neighbours in the gulf cluster, so keep it out of the layer until it lands
          pill.style.visibility = named > 0.02 ? 'visible' : 'hidden';
        }
      }
    };

    let visible = true;
    const tick = () => {
      if (!visible) {
        raf = 0;
        return;
      }
      if (!dragging && !reduce) phi += 0.003;
      globe?.update({ phi, theta });
      if (width > 0) paint();
      raf = window.requestAnimationFrame(tick);
    };

    const start = async () => {
      const { default: createGlobe } = await import('cobe');
      // the visitor lookup can land while cobe is still being imported, which
      // re-runs this effect and disposes the pass that started the import. bail
      // out here so a stale pass never builds a second globe on the same canvas:
      // two cobe instances share one WebGL context and fight over its buffers,
      // which is what raises "drawArrays: no buffer is bound to enabled attribute".
      if (disposed) return;
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
        // every city is a dom pin drop, so cobe paints no circular markers of its
        // own — its options type still wants a default colour set
        markerColor: [0.91, 0.72, 0.14],
        glowColor: [0.12, 0.12, 0.12],
        scale: 1.05,
      });
      // the intersection observer may already be driving the loop; only kick it
      // off here if nothing is running yet, so we never end up with two chains.
      if (!raf) raf = window.requestAnimationFrame(tick);
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible && !raf) raf = window.requestAnimationFrame(tick);
      },
      { rootMargin: '80px' },
    );
    observer.observe(wrap);

    return () => {
      disposed = true;
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
      globe?.destroy();
    };
  }, []);

  return (
    <section
      className="scroll-mt-20 py-20 sm:py-24"
      id="globe"
      data-nerd="globe: cobe webgl, dom pin drops with pulse + name pills, ipwho.is + open-meteo"
    >
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="text-muted-foreground mb-2 font-mono text-xs tracking-widest uppercase">
            right now
          </p>
          <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">two dots on a globe</h2>
          <p className="text-muted-foreground mt-4 max-w-sm text-lg leading-7">
            you are somewhere on this globe, that much I know.
          </p>
          <p className="text-muted-foreground mt-3 max-w-sm text-lg leading-7">
            I am in <span className="text-foreground">jeddah</span>
            {temp != null ? (
              <>
                , where it is <span className="text-foreground">{temp}°C</span>
              </>
            ) : null}
            . small world.
          </p>
          <HandNote arrow="down-right" className="mt-8">
            give it a spin
          </HandNote>
        </div>
        <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[420px]">
          <canvas
            ref={canvasRef}
            className="aspect-square h-full w-full cursor-grab touch-none active:cursor-grabbing"
            aria-label="a globe with pins for jeddah, madinah, dammam, doha, hyderabad, chennai, and where you are right now"
          />
          <div ref={overlayRef} className="pointer-events-none absolute inset-0" aria-hidden>
            {CITIES.map((city) => (
              <Marker
                key={city.name}
                label={city.name}
                lat={city.at[0]}
                lon={city.at[1]}
                tone={city.name === 'jeddah' ? 'amber' : 'white'}
                lift={city.lift}
              />
            ))}
            {visitor ? (
              <Marker
                key="you"
                label={visitor.city}
                lat={visitor.lat}
                lon={visitor.lon}
                tone="violet"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
