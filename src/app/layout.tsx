import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Red Sea Restaurant & Detox Juice Bar | Staten Island, NY',
  description: "Staten Island's premier restaurant and detox juice bar. Fresh-pressed juices, smoothies, kababs, wraps & more at 1612 Forest Ave. Order online!",
  metadataBase: new URL('https://redseadetox.com'),
  openGraph: {
    title: 'Red Sea Restaurant & Detox Juice Bar',
    description: 'Fresh juices, smoothies, kababs & more. Order online for delivery or pickup. Staten Island, NY.',
    url: 'https://redseadetox.com',
    siteName: 'Red Sea Restaurant & Detox Juice Bar',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Restaurant',
          name: 'Red Sea Restaurant & Detox Juice Bar',
          address: { '@type': 'PostalAddress', streetAddress: '1612 Forest Ave', addressLocality: 'Staten Island', addressRegion: 'NY', postalCode: '10302', addressCountry: 'US' },
          telephone: '(347) 857-6692', openingHours: 'Mo-Su 10:00-22:00',
          servesCuisine: ['Mediterranean','Juice Bar','Kebab','Yemeni'],
          priceRange: '$$', url: 'https://redseadetox.com', hasMenu: 'https://redseadetox.com/#menu',
        })}} />
      </head>
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}