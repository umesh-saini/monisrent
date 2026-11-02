import { expect, test, type Page } from '@playwright/test';

const ANIMATION_SETTLE_MS = 3000;
/** Anti-aliasing and shadows vary slightly between renders of the very same view. */
const MATCHING_VIEW_PERCENT = 1;

async function openStudio(page: Page) {
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible({ timeout: 30_000 });
  await page.waitForTimeout(ANIMATION_SETTLE_MS);
}

/** Compares two base64 PNGs inside the browser, where decoding images is built in. */
function percentDifferent(page: Page, first: string, second: string): Promise<number> {
  return page.evaluate(
    async ([a, b]) => {
      const pixels = async (base64: string) => {
        const image = new Image();
        image.src = `data:image/png;base64,${base64}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
      };
      const [pixelsA, pixelsB] = await Promise.all([pixels(a), pixels(b)]);
      let different = 0;
      for (let index = 0; index < pixelsA.length; index += 4) {
        const distance =
          Math.abs(pixelsA[index] - pixelsB[index]) +
          Math.abs(pixelsA[index + 1] - pixelsB[index + 1]) +
          Math.abs(pixelsA[index + 2] - pixelsB[index + 2]);
        if (distance > 24) different++;
      }
      return (100 * different) / (pixelsA.length / 4);
    },
    [first, second],
  );
}

function chooseButton(page: Page, name: RegExp) {
  return page
    .getByRole('button', { name, pressed: false })
    .or(page.getByRole('button', { name, pressed: true }));
}

test.describe('building a setup', () => {
  test('desks, chairs and extras update the price', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await openStudio(page);

    const total = page.getByLabel('Your total');
    await expect(total).toContainText('$25');

    await chooseButton(page, /Dual-Motor Standing Desk/).click();
    await expect(total).toContainText('$27');

    await page.getByRole('tab', { name: 'Chairs' }).click();
    await chooseButton(page, /Canggu Rattan Chair/).click();
    await expect(total).toContainText('$26');

    await page.getByRole('tab', { name: 'Extras' }).click();
    await chooseButton(page, /Smart LED Desk Lamp/).click();
    await expect(total).toContainText('$29');

    await page.getByRole('button', { name: 'One more 27" 4K Monitor' }).click();
    await expect(total).toContainText('$41');
    await page.getByRole('button', { name: 'One more 27" 4K Monitor' }).click();
    await expect(total).toContainText('$53');
    await expect(
      page.getByRole('button', { name: 'One more 27" 4K Monitor' }),
    ).toBeDisabled();

    expect(errors).toEqual([]);
  });

  test('the 10% long-stay discount applies from three months', async ({ page }) => {
    await openStudio(page);
    const total = page.getByLabel('Your total');

    await page.getByRole('radio', { name: /3 months/ }).click();
    await expect(total).toContainText('$22.50');
    await expect(total).toContainText('$270 in total');
    await expect(total).toContainText('you save $30');
  });

  test('presets and surprise me rebuild the room', async ({ page }) => {
    await openStudio(page);
    await page.getByRole('button', { name: 'The trader' }).click();
    await expect(page.getByRole('button', { name: 'The trader' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByLabel('Your total')).toContainText('$67');

    await page.getByRole('button', { name: 'Surprise me' }).click();
    await expect(page.getByRole('button', { name: 'The trader' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  test('the setup survives a reload and start fresh clears it', async ({ page }) => {
    await openStudio(page);
    await page.getByRole('button', { name: 'sage theme' }).click();
    await page.getByRole('radio', { name: /6 months/ }).click();

    await page.reload();
    await expect(page.getByRole('button', { name: 'sage theme' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(page.getByRole('radio', { name: /6 months/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await page.getByRole('button', { name: 'Start fresh' }).click();
    await expect(page.getByRole('radio', { name: /1 month/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});

test.describe('the 3D room', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  async function canvasPixels(page: Page) {
    await page.waitForTimeout(ANIMATION_SETTLE_MS);
    return (await page.locator('canvas').screenshot()).toString('base64');
  }

  test('adding an item, standing and night mode each change the picture', async ({
    page,
  }) => {
    await openStudio(page);
    const start = await canvasPixels(page);

    await page.getByRole('button', { name: 'Stand up' }).click();
    const standing = await canvasPixels(page);
    expect(standing).not.toEqual(start);

    await page.getByRole('button', { name: 'Night' }).click();
    const night = await canvasPixels(page);
    expect(night).not.toEqual(standing);

    await page.getByRole('tab', { name: 'Extras' }).click();
    await chooseButton(page, /Dawn Patrol Surfboard/).click();
    expect(await canvasPixels(page)).not.toEqual(night);
  });

  test('changes animate over many frames, then rendering stops', async ({ page }) => {
    await page.addInitScript(() => {
      const counter = window as unknown as { frameRequests: number };
      counter.frameRequests = 0;
      const request = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (callback) => {
        counter.frameRequests++;
        return request(callback);
      };
    });
    const frameRequests = () =>
      page.evaluate(() => (window as unknown as { frameRequests: number }).frameRequests);

    await openStudio(page);
    await page.waitForTimeout(ANIMATION_SETTLE_MS * 2);

    // A jump would take a frame or two. A real animation keeps asking for more.
    const beforeStanding = await frameRequests();
    await page.getByRole('button', { name: 'Stand up' }).click();
    await expect
      .poll(async () => (await frameRequests()) - beforeStanding, { timeout: 30_000 })
      .toBeGreaterThan(5);

    // Once settled, an idle room must not keep burning the visitor's battery.
    await expect
      .poll(
        async () => {
          const before = await frameRequests();
          await page.waitForTimeout(2000);
          return (await frameRequests()) - before;
        },
        { timeout: 60_000 },
      )
      .toBeLessThanOrEqual(1);
  });

  test('reset returns the camera to where it started', async ({ page }) => {
    await openStudio(page);
    const start = await canvasPixels(page);

    const box = await page.locator('canvas').boundingBox();
    if (!box) throw new Error('Canvas has no size');
    const centerY = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width / 2, centerY);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 220, centerY, { steps: 8 });
    await page.mouse.up();
    const orbited = await canvasPixels(page);
    expect(orbited).not.toEqual(start);

    await page.getByRole('button', { name: 'Reset camera view' }).click();
    await expect
      .poll(async () => percentDifferent(page, start, await canvasPixels(page)), {
        timeout: 45_000,
      })
      .toBeLessThan(MATCHING_VIEW_PERCENT);
  });

  test('clicking the chair in the room opens it in the catalog', async ({ page }) => {
    await openStudio(page);
    await expect(page.getByRole('tab', { name: 'Desks' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    const box = await page.locator('canvas').boundingBox();
    if (!box) throw new Error('Canvas has no size');
    // The default camera frames the chair's backrest here.
    await page.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.55);

    await expect(page.getByRole('tab', { name: 'Chairs' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});

test.describe('checkout', () => {
  test('review, delivery and confirmation', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openStudio(page);

    await page.getByRole('radio', { name: /3 months/ }).click();
    await page.getByRole('button', { name: 'Rent this setup' }).click();
    const dialog = page.getByRole('dialog');

    await expect(dialog.getByRole('img', { name: /your workspace/i })).toBeVisible();
    await expect(dialog.getByText('$270')).toBeVisible();

    await dialog.getByRole('button', { name: 'Remove Desk Buddy Plant' }).click();
    await expect(dialog.getByText('$259.20')).toBeVisible();

    await dialog.getByRole('button', { name: 'Choose delivery' }).click();
    await dialog.getByRole('radio', { name: 'Ubud' }).click();
    await dialog.getByRole('button', { name: 'Lock in my setup' }).click();

    await expect(dialog.getByRole('heading', { name: /ready to go/ })).toBeVisible();
    await expect(dialog.getByText(/Ubud/)).toBeVisible();
    await expect(
      dialog.getByRole('link', { name: /Ergonomic Office Chair/ }),
    ).toHaveAttribute('href', 'https://monis.rent/products/ergonomic-office-chair');

    await dialog.getByRole('button', { name: 'Copy share link' }).click();
    await expect(dialog.getByRole('button', { name: 'Link copied' })).toBeVisible();
    const link = await page.evaluate(() => navigator.clipboard.readText());
    expect(link).toContain('weeks=12');

    const download = page.waitForEvent('download');
    await dialog.getByRole('button', { name: 'Save as image' }).click();
    expect((await download).suggestedFilename()).toBe('my-bali-workspace.png');
  });

  test('a shared link opens the same setup', async ({ page }) => {
    await page.goto(
      '/?desk=mechanical-desk&chair=rattan-chair&extras=monitor*2,lamp&weeks=12&theme=sage&time=night',
    );
    await expect(page.getByRole('radio', { name: /3 months/ })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(page.getByRole('button', { name: 'Night' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    // $7 desk + $5 chair + 2 × $12 monitor + $3 lamp, less 10%
    await expect(page.getByLabel('Your total')).toContainText('$35.10');
  });

  test('a tampered share link falls back safely', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(
      '/?desk=not-a-desk&chair=rattan-chair&extras=monitor*99&weeks=-5&theme=x&time=y',
    );
    await expect(page.locator('canvas')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByLabel('Your total')).toContainText('$25');
    expect(errors).toEqual([]);
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('nothing overflows, and the preview and Rent stay in reach', async ({ page }) => {
    await openStudio(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);

    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(500);
    const preview = await page.locator('canvas').boundingBox();
    expect(preview?.y).toBeLessThanOrEqual(1);

    const rent = page.getByRole('button', { name: 'Rent this setup' });
    await expect(rent).toBeInViewport();
    await rent.click();
    await expect(page.getByRole('button', { name: 'Choose delivery' })).toBeVisible();
  });
});
