import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const bodyFont = DM_Sans({ subsets: ['latin'], variable: '--font-body' });
const headingFont = Manrope({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
  title: 'Workspace Studio — monis.rent',
  description:
    'Land in Bali, build your dream workspace in 3D, and rent it by the week. A concept for monis.rent.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
