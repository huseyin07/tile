import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TILE — 1,111 pieces. One roof.',
  description: 'TILE is a 1,111-piece NFT collection minting first on Robinhood Chain mainnet and moving to GIWA when GIWA mainnet is live.',
  openGraph: {
    title: 'TILE — 1,111 pieces. One roof.',
    description: 'One tile becomes part of something greater. Robinhood Chain first. GIWA next.',
    type: 'website',
    images: [{ url: '/og-tile.svg', width: 1200, height: 630, alt: 'TILE — 1,111 · Robinhood Chain to GIWA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TILE — 1,111 pieces. One roof.',
    description: 'One tile becomes part of something greater. Robinhood Chain first. GIWA next.',
    images: ['/og-tile.svg'],
    creator: '@TileOnGIWA',
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
