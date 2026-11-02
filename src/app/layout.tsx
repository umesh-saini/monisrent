import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Workspace Studio — monis.rent', description: 'A little Bali. A lot of possibility. Build your dream workspace in 3D and explore a flexible rental setup.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
