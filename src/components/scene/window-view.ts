import { CanvasTexture, SRGBColorSpace } from 'three';
import type { TimeOfDay } from '@/lib/setup';

const SIZE = 512;

type Palette = {
  sky: [string, string, string];
  orb: { x: number; y: number; radius: number; color: string; glow: string };
  stars: boolean;
  /** Back to front. Each layer of hills and rice terraces is darker and closer. */
  hills: string[];
  palm: string;
};

const PALETTES: Record<TimeOfDay, Palette> = {
  day: {
    sky: ['#79c4ea', '#b5e2ef', '#fbf3d9'],
    orb: {
      x: 0.72,
      y: 0.2,
      radius: 34,
      color: '#fff8d6',
      glow: 'rgba(255,247,200,0.65)',
    },
    stars: false,
    hills: ['#9fce9a', '#7cbc78', '#5ca35f', '#3f8850'],
    palm: '#22573d',
  },
  golden: {
    sky: ['#6e6fa6', '#f09a70', '#ffd98f'],
    orb: { x: 0.34, y: 0.5, radius: 46, color: '#fff1b8', glow: 'rgba(255,190,110,0.8)' },
    stars: false,
    hills: ['#c79872', '#a07c5c', '#7c6549', '#54493a'],
    palm: '#2c2a2f',
  },
  night: {
    sky: ['#0b1030', '#1c2756', '#3c4478'],
    orb: {
      x: 0.68,
      y: 0.22,
      radius: 26,
      color: '#f6f3dc',
      glow: 'rgba(200,210,255,0.5)',
    },
    stars: true,
    hills: ['#232c54', '#1b2445', '#141b37', '#0d1329'],
    palm: '#070a18',
  },
};

function drawSky(context: CanvasRenderingContext2D, palette: Palette) {
  const gradient = context.createLinearGradient(0, 0, 0, SIZE * 0.8);
  gradient.addColorStop(0, palette.sky[0]);
  gradient.addColorStop(0.6, palette.sky[1]);
  gradient.addColorStop(1, palette.sky[2]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, SIZE, SIZE);
}

function drawStars(context: CanvasRenderingContext2D) {
  context.fillStyle = '#ffffff';
  for (let index = 0; index < 70; index++) {
    // A fixed scatter, so the sky looks the same on every render.
    const x = ((index * 97) % 101) / 101;
    const y = ((index * 61) % 89) / 89;
    context.globalAlpha = 0.35 + ((index * 13) % 10) / 15;
    context.fillRect(x * SIZE, y * SIZE * 0.6, 2, 2);
  }
  context.globalAlpha = 1;
}

function drawOrb(context: CanvasRenderingContext2D, { orb }: Palette) {
  const x = orb.x * SIZE;
  const y = orb.y * SIZE;
  const glow = context.createRadialGradient(
    x,
    y,
    orb.radius * 0.5,
    x,
    y,
    orb.radius * 3.6,
  );
  glow.addColorStop(0, orb.glow);
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, SIZE, SIZE);
  context.fillStyle = orb.color;
  context.beginPath();
  context.arc(x, y, orb.radius, 0, Math.PI * 2);
  context.fill();
}

function drawHill(
  context: CanvasRenderingContext2D,
  color: string,
  baseline: number,
  amplitude: number,
  phase: number,
) {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(0, SIZE);
  for (let x = 0; x <= SIZE; x += 8) {
    const wave =
      Math.sin(x / 70 + phase) * amplitude +
      Math.sin(x / 31 + phase * 2) * amplitude * 0.3;
    context.lineTo(x, baseline + wave);
  }
  context.lineTo(SIZE, SIZE);
  context.closePath();
  context.fill();
}

/** Thin contour lines across a hill read as stepped rice terraces. */
function drawTerraceLines(
  context: CanvasRenderingContext2D,
  baseline: number,
  phase: number,
) {
  context.strokeStyle = 'rgba(255,255,255,0.13)';
  context.lineWidth = 2;
  for (let row = 1; row < 6; row++) {
    context.beginPath();
    for (let x = 0; x <= SIZE; x += 8) {
      const y = baseline + row * 22 + Math.sin(x / 70 + phase + row * 0.5) * 11;
      if (x === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
}

function drawPalm(
  context: CanvasRenderingContext2D,
  color: string,
  x: number,
  height: number,
  lean: number,
) {
  const topX = x + lean;
  const topY = SIZE - height;
  context.strokeStyle = color;
  context.lineCap = 'round';
  context.lineWidth = 9;
  context.beginPath();
  context.moveTo(x, SIZE);
  context.quadraticCurveTo(x + lean * 0.2, SIZE - height * 0.5, topX, topY);
  context.stroke();

  context.fillStyle = color;
  const FROND_COUNT = 8;
  for (let index = 0; index < FROND_COUNT; index++) {
    const angle = -Math.PI * (0.02 + (index / (FROND_COUNT - 1)) * 0.96);
    const length = 92 + (index % 2) * 18;
    const tipX = topX + Math.cos(angle) * length;
    const tipY = topY + Math.sin(angle) * length * 0.55 + 42;
    context.beginPath();
    context.moveTo(topX, topY);
    context.quadraticCurveTo(
      topX + Math.cos(angle) * length * 0.55,
      topY + Math.sin(angle) * length * 0.8 - 12,
      tipX,
      tipY,
    );
    context.quadraticCurveTo(
      topX + Math.cos(angle) * length * 0.5,
      topY + Math.sin(angle) * length * 0.55 + 6,
      topX,
      topY,
    );
    context.fill();
  }
}

/** Paints the Bali view: sky, terraced hills and palms, no image downloads required. */
export function createWindowViewTexture(timeOfDay: TimeOfDay): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  const palette = PALETTES[timeOfDay];

  drawSky(context, palette);
  if (palette.stars) drawStars(context);
  drawOrb(context, palette);

  palette.hills.forEach((color, index) => {
    const baseline = SIZE * (0.55 + index * 0.1);
    drawHill(context, color, baseline, 22 - index * 3, index * 1.7);
    if (index >= 1) drawTerraceLines(context, baseline, index * 1.7);
  });

  drawPalm(context, palette.palm, SIZE * 0.14, SIZE * 0.62, 34);
  drawPalm(context, palette.palm, SIZE * 0.88, SIZE * 0.5, -26);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
