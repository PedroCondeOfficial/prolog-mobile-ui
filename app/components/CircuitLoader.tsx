// Animated "circuit connecting" modal shown while the API call is in flight.
// Traces are drawn with stroke-dashoffset, sparks travel along them with
// SVG <animateMotion>, and solder pads light up as each lead connects.

const TRACES = [
  "M20 100 H70 L90 80 H130",
  "M20 40 H50 L70 60 H100 V80",
  "M20 160 H60 L80 140 H110 V120",
  "M280 100 H230 L210 120 H170",
  "M280 40 H240 V70 L220 90 H180 V80",
  "M280 160 H250 L230 140 H190 V120",
  "M150 10 V50 L140 60 V80",
  "M150 190 V150 L160 140 V120",
];

const PADS: [number, number][] = [
  [20, 100], [20, 40], [20, 160],
  [280, 100], [280, 40], [280, 160],
  [150, 10], [150, 190],
];

export default function CircuitLoader({ label = "Connecting to Prolog API" }: { label?: string }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={label}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm animate-[fade-in_200ms_ease-out]"
    >
      <div className="w-full max-w-sm rounded-2xl border border-emerald-500/30 bg-zinc-950 p-6 shadow-[0_0_60px_-10px_rgba(16,185,129,0.5)]">
        <svg viewBox="0 0 300 200" className="w-full" aria-hidden="true">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Dim board traces */}
          <g stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {TRACES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>

          {/* Energised leads drawing in */}
          <g
            stroke="#34d399"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          >
            {TRACES.map((d, i) => (
              <path
                key={d}
                d={d}
                pathLength={1}
                className="circuit-trace"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
          </g>

          {/* Sparks travelling the leads toward the chip */}
          {TRACES.map((d, i) => (
            <circle key={d} r="2.6" fill="#ecfdf5" filter="url(#glow)" opacity="0">
              <animateMotion dur="1.6s" begin={`${i * 0.18}s`} repeatCount="indefinite" path={d} />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.1;0.85;1"
                dur="1.6s"
                begin={`${i * 0.18}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Solder pads */}
          {PADS.map(([cx, cy], i) => (
            <circle
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              r="5"
              className="circuit-pad"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}

          {/* Central chip */}
          <g className="circuit-chip">
            <rect x="100" y="70" width="100" height="60" rx="6" fill="#022c22" stroke="#10b981" strokeWidth="2" />
            {[0, 1, 2, 3, 4].map((n) => (
              <g key={n} fill="#10b981">
                <rect x={110 + n * 18} y="64" width="6" height="6" />
                <rect x={110 + n * 18} y="130" width="6" height="6" />
              </g>
            ))}
            <text
              x="150"
              y="105"
              textAnchor="middle"
              className="fill-emerald-300 font-mono text-[11px] tracking-[0.3em]"
            >
              API
            </text>
          </g>
        </svg>

        <p className="mt-4 text-center font-mono text-sm tracking-wide text-emerald-300">
          {label}
          <span className="circuit-dots" />
        </p>
      </div>
    </div>
  );
}
