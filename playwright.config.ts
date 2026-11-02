import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90_000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    launchOptions: {
      executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome',
      // Software WebGL, so the 3D room also renders on machines without a GPU.
      args: [
        '--no-sandbox',
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-unsafe-swiftshader',
      ],
    },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
