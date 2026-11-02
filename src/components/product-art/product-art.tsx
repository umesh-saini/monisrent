import type { ReactNode } from 'react';
import type { DeskId, ProductId } from '@/lib/catalog';
import styles from './product-art.module.css';

const DESK_ART_COLORS: Record<DeskId, { top: string; edge: string; frame: string }> = {
  'electric-desk': { top: '#f5f3ec', edge: '#d5d6cf', frame: '#3f4644' },
  'mechanical-desk': { top: '#d6af80', edge: '#bd8e60', frame: '#e8e6df' },
  'dual-motor-desk': { top: '#6b5040', edge: '#4d392d', frame: '#23282a' },
};

function DeskArt({ id }: { id: DeskId }) {
  const { top, edge, frame } = DESK_ART_COLORS[id];
  return (
    <g strokeLinejoin="round">
      <path d="M68 72v50M172 72v50" stroke={frame} strokeWidth="9" />
      <path
        d="M48 124h40M152 124h40"
        stroke={frame}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="m36 58 112-24 62 24-112 28z" fill={top} />
      <path d="m36 58 62 28 112-28v7L98 93 36 65z" fill={edge} />
      {id === 'mechanical-desk' && (
        <path d="m48 58 108-18M60 63l105-20M75 69l104-20" stroke="#fff" opacity=".2" />
      )}
      {id === 'mechanical-desk' && (
        <path d="M190 72v14h12" stroke="#8a8f8b" strokeWidth="3" fill="none" />
      )}
      {id === 'electric-desk' && (
        <rect x="150" y="70" width="18" height="6" fill="#1d2120" />
      )}
      {id === 'dual-motor-desk' && (
        <path d="M68 104h0M172 104h0" stroke={frame} strokeWidth="14" />
      )}
    </g>
  );
}

function ErgonomicChairArt() {
  return (
    <g>
      <path
        d="M116 93v30m0-1-31 10m31-10 34 10m-34-10 13 16"
        stroke="#5b615c"
        strokeWidth="5"
      />
      <path d="M94 29q20-12 44 0l-2 49H96z" fill="#3e4948" />
      <path d="M91 76q27-10 53 0l8 17q-33 16-67 0z" fill="#56625e" />
      <path
        d="M86 62v25m65-25v25M78 62h17m47 0h18"
        stroke="#69716b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {Array.from({ length: 7 }, (_, index) => (
        <path key={index} d={`M100 ${35 + index * 5}h31`} stroke="#86908a" opacity=".4" />
      ))}
    </g>
  );
}

function RattanChairArt() {
  return (
    <g>
      <path
        d="M88 96 80 131M150 96l8 35M100 98l-4 28M138 98l4 28"
        stroke="#a97f49"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M78 75C64 18 174 18 160 75z" fill="#c99d63" />
      {[-30, -20, -10, 0, 10, 20, 30].map((x) => (
        <path
          key={x}
          d={`M119 80Q${119 + x} 50 ${119 + x * 1.15} 28`}
          stroke="#a97f49"
          strokeWidth="2"
          fill="none"
        />
      ))}
      <ellipse cx="119" cy="88" rx="44" ry="14" fill="#a97f49" />
      <ellipse cx="119" cy="83" rx="40" ry="12" fill="#efe6d6" />
    </g>
  );
}

function MonitorArt() {
  return (
    <g>
      <path
        d="M120 100v22m-28 3h56"
        stroke="#5d6461"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <rect x="55" y="27" width="130" height="76" rx="5" fill="#20262a" />
      <rect x="61" y="33" width="118" height="64" rx="2" fill="#16222b" />
      <rect x="68" y="41" width="44" height="48" fill="#7dd3a8" />
      <rect x="118" y="41" width="54" height="17" fill="#e6b866" />
      <rect x="118" y="64" width="25" height="25" fill="#6ba7d8" />
      <rect x="148" y="64" width="24" height="25" fill="#c9d4c5" />
    </g>
  );
}

function KeyboardArt() {
  return (
    <g>
      <path d="m42 92 118-30 40 18-118 34z" fill="#2f3436" />
      <path d="m42 92 40 22 118-34v5L82 120 42 97z" fill="#1d2123" />
      {Array.from({ length: 5 }, (_, row) => (
        <path
          key={row}
          d={`m${58 + row * 8} ${92 + row * 3.6} 100-26`}
          stroke="#7d8588"
          strokeWidth="4.5"
          strokeDasharray="7 3"
        />
      ))}
    </g>
  );
}

function MouseArt() {
  return (
    <g>
      <path
        d="M88 96c-2-32 18-56 42-48 22 8 30 36 16 58-14 20-56 22-58-10z"
        fill="#2f3436"
      />
      <path d="M126 50c-6 10-8 22-6 32" stroke="#5e666a" strokeWidth="3" fill="none" />
      <ellipse
        cx="124"
        cy="60"
        rx="4"
        ry="8"
        fill="#9aa2a5"
        transform="rotate(12 124 60)"
      />
    </g>
  );
}

function LaptopStandArt() {
  return (
    <g>
      <path
        d="m70 124 44-46M170 124l-44-46"
        stroke="#b6bab7"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="m70 88 100-14 16 16-104 14z" fill="#c9cdcb" />
      <path d="m76 30 94-8 0 52-100 14z" fill="#3c4347" />
      <path d="m82 36 82-7v39l-88 12z" fill="#1e2a33" />
      <path d="m90 44 38-3v28l-40 5z" fill="#7dd3a8" />
      <path d="m134 40 24-2v26l-24 3z" fill="#e6b866" />
    </g>
  );
}

function LampArt() {
  return (
    <g>
      <ellipse cx="100" cy="125" rx="26" ry="6" fill="#d8d6cd" />
      <path d="M100 124V42" stroke="#c8c6bc" strokeWidth="5" />
      <path d="M92 40h84" stroke="#d8d6cd" strokeWidth="8" strokeLinecap="round" />
      <path d="M96 46h76l10 30H86z" fill="#ffe9b0" opacity=".55" />
    </g>
  );
}

function CoffeeArt() {
  return (
    <g>
      <rect x="84" y="30" width="62" height="88" rx="12" fill="#b3322f" />
      <rect x="92" y="38" width="46" height="24" rx="5" fill="#8d2522" />
      <rect x="84" y="112" width="72" height="14" rx="3" fill="#1f2326" />
      <rect x="104" y="72" width="22" height="10" rx="2" fill="#1f2326" />
      <path d="M104 96h22l-3 18h-16z" fill="#f4efe6" />
      <circle cx="162" cy="118" r="8" fill="#d88a5f" />
    </g>
  );
}

function WhiteboardArt() {
  return (
    <g>
      <path
        d="M80 112 66 136M160 112l14 24"
        stroke="#9b9f9b"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect x="54" y="22" width="132" height="90" rx="4" fill="#c0c3c0" />
      <rect x="59" y="27" width="122" height="80" fill="#fbfbf6" />
      <rect x="68" y="36" width="30" height="20" fill="#f0c776" />
      <rect x="104" y="36" width="30" height="20" fill="#9ccfb0" />
      <rect x="140" y="36" width="30" height="20" fill="#e49a7e" />
      <path d="M68 70h44M68 80h36M68 90h48" stroke="#39424a" strokeWidth="3" />
      <path d="m126 92 14-22 12 14 18-20" stroke="#d86f4f" strokeWidth="3" fill="none" />
    </g>
  );
}

function SpeakerArt() {
  return (
    <g>
      <rect x="66" y="30" width="108" height="96" rx="8" fill="#191a1b" />
      <rect x="74" y="38" width="92" height="80" rx="4" fill="#2c2b28" />
      <circle cx="120" cy="96" r="15" fill="#111" />
      <circle cx="120" cy="60" r="9" fill="#111" />
      <path d="M100 44h40" stroke="#c8a35b" strokeWidth="3" />
    </g>
  );
}

function TowerFanArt() {
  return (
    <g>
      <rect
        x="104"
        y="14"
        width="32"
        height="108"
        rx="14"
        fill="#f4f2eb"
        stroke="#dcdbd2"
      />
      {[34, 44, 54, 64, 74, 84, 94].map((y) => (
        <path key={y} d={`M112 ${y}h16`} stroke="#b9bcb6" strokeWidth="3" />
      ))}
      <ellipse cx="120" cy="126" rx="28" ry="7" fill="#e8e6dd" />
    </g>
  );
}

function PlantArt() {
  return (
    <g>
      <path d="M120 97V37" stroke="#68825b" strokeWidth="4" />
      {[0, 1, 2].map((index) => {
        const leftY = 49 + index * 17;
        const rightY = 39 + index * 18;
        return (
          <g key={index}>
            <ellipse
              cx="107"
              cy={leftY}
              rx="17"
              ry="8"
              transform={`rotate(30 107 ${leftY})`}
              fill="#7c9a69"
            />
            <ellipse
              cx="132"
              cy={rightY}
              rx="17"
              ry="8"
              transform={`rotate(-30 132 ${rightY})`}
              fill="#597b54"
            />
          </g>
        );
      })}
      <path d="m98 92 7 35h30l7-35z" fill="#c68668" />
      <ellipse cx="120" cy="92" rx="22" ry="5" fill="#da9b7b" />
    </g>
  );
}

function RugArt() {
  return (
    <g>
      <path d="m39 87 95-39 77 36-96 45z" fill="#c8aa87" />
      <path d="m52 87 81-32 64 29-82 37z" fill="none" stroke="#e9d8ba" strokeWidth="4" />
      {[0, 1, 2, 3, 4].map((index) => (
        <path
          key={index}
          d={`m${63 + index * 16} ${84 - index * 6} 57 29`}
          stroke="#e9d8ba"
          opacity=".45"
        />
      ))}
    </g>
  );
}

function SurfboardArt() {
  return (
    <g transform="rotate(24 120 75)">
      <path
        d="M120 2c26 36 26 110 0 146-26-36-26-110 0-146z"
        fill="#f7efe0"
        stroke="#e2d6bf"
      />
      <path d="M100 62h40v12h-40z" fill="#3e8ca0" />
      <path d="M99 44h42v8H99zM99 84h42v8H99z" fill="#d86f4f" />
    </g>
  );
}

const ART_BY_PRODUCT: Record<ProductId, ReactNode> = {
  'electric-desk': <DeskArt id="electric-desk" />,
  'mechanical-desk': <DeskArt id="mechanical-desk" />,
  'dual-motor-desk': <DeskArt id="dual-motor-desk" />,
  'ergonomic-chair': <ErgonomicChairArt />,
  'rattan-chair': <RattanChairArt />,
  monitor: <MonitorArt />,
  keyboard: <KeyboardArt />,
  mouse: <MouseArt />,
  'laptop-stand': <LaptopStandArt />,
  lamp: <LampArt />,
  'coffee-machine': <CoffeeArt />,
  whiteboard: <WhiteboardArt />,
  speaker: <SpeakerArt />,
  'tower-fan': <TowerFanArt />,
  plant: <PlantArt />,
  rug: <RugArt />,
  surfboard: <SurfboardArt />,
};

type ProductArtProps = {
  id: ProductId;
  className?: string;
};

export default function ProductArt({ id, className = '' }: ProductArtProps) {
  return (
    <svg
      viewBox="0 0 240 150"
      aria-hidden="true"
      className={`${styles.art} ${className}`}
    >
      <ellipse cx="120" cy="134" rx="77" ry="7" fill="#000" opacity=".06" />
      {ART_BY_PRODUCT[id]}
    </svg>
  );
}
