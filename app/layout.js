import './globals.css'
import 'leaflet/dist/leaflet.css'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '../contexts/LanguageContext'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import WhatsAppFloat from '../components/Common/WhatsAppFloat'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = 'https://www.sachinlavatenagarsevak.com'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Corporator Sachin Lavate',
      url: siteUrl,
      inLanguage: ['en', 'mr'],
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Person',
      name: 'Sachin Devappa Lavate',
      jobTitle: 'Corporator',
      url: siteUrl,
      worksFor: {
        '@type': 'GovernmentOrganization',
        name: 'Navi Mumbai Municipal Corporation',
      },
      image: `${siteUrl}/logo-6.png`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Nerul',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+91-22-12345678',
        email: 'contact@ward24.in',
        areaServed: 'Navi Mumbai',
      },
      sameAs: ['https://www.instagram.com/samajsevaksachinlavate?igsh=MTM4cnc4anFhMWxoMQ=='],
    },
  ],
}

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Corporator Sachin Lavate | Ward 24(D) Navi Mumbai',
  description: 'Official website of Corporator Sachin Devappa Lavate, Ward 24(D), Navi Mumbai Municipal Corporation',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preload" as="image" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
            <WhatsAppFloat />
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
