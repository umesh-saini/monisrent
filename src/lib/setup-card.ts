import { money, quote } from './pricing';
import { lineItems, type Setup } from './setup';

const WIDTH = 1200;
const HEIGHT = 1500;
const MARGIN = 80;
const IMAGE_BOTTOM = 980;
const INK = '#2e362d';
const MUTED = '#666b5f';
const BACKGROUNDS: Record<Setup['timeOfDay'], string> = {
  day: '#efe9de',
  golden: '#f4d9b8',
  night: '#20263a',
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

/** Draws a shareable poster of the setup and returns it as a PNG data URL. */
export async function renderSetupCard(
  setup: Setup,
  snapshot: string | null,
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D is not available');

  context.fillStyle = '#fffefb';
  context.fillRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = BACKGROUNDS[setup.timeOfDay];
  context.fillRect(0, 0, WIDTH, IMAGE_BOTTOM);

  if (snapshot) {
    const image = await loadImage(snapshot);
    const scale = Math.min(WIDTH / image.width, IMAGE_BOTTOM / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    context.drawImage(
      image,
      (WIDTH - width) / 2,
      (IMAGE_BOTTOM - height) / 2,
      width,
      height,
    );
  }

  const pricing = quote(setup);
  context.fillStyle = INK;
  context.font = '700 56px Manrope, sans-serif';
  context.fillText('My Bali workspace', MARGIN, IMAGE_BOTTOM + 90);
  context.font = '500 30px "DM Sans", sans-serif';
  context.fillStyle = MUTED;
  const names = lineItems(setup).map(({ product, quantity }) =>
    quantity > 1 ? `${quantity} × ${product.name}` : product.name,
  );
  wrapText(
    context,
    names.join(' · '),
    MARGIN,
    IMAGE_BOTTOM + 150,
    WIDTH - MARGIN * 2,
    42,
  );

  context.fillStyle = INK;
  context.font = '700 44px Manrope, sans-serif';
  context.fillText(`${money(pricing.discountedWeeklyCents)} / week`, MARGIN, HEIGHT - 70);
  context.font = '500 30px "DM Sans", sans-serif';
  context.textAlign = 'right';
  context.fillStyle = MUTED;
  context.fillText(
    'Built with the monis.rent studio concept',
    WIDTH - MARGIN,
    HEIGHT - 70,
  );

  return canvas.toDataURL('image/png');
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
) {
  let line = '';
  let y = startY;
  for (const word of text.split(' ')) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = candidate;
    }
  }
  context.fillText(line, x, y);
}

export function downloadDataUrl(filename: string, dataUrl: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
