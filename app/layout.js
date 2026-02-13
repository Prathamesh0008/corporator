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

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.sachinlavatenagarsevak.com/#organization',
  name: 'Sachin Lavate Nagarsevak',
  alternateName: 'Sachin Lavate',
  url: 'https://www.sachinlavatenagarsevak.com/',
  logo: 'https://www.sachinlavatenagarsevak.com/logo-6.png',
  image: 'https://www.sachinlavatenagarsevak.com/logo-6.png',
  description: 'Official website of Sachin Lavate, Nagarsevak from Nerul, Navi Mumbai. Dedicated to ward development, public welfare initiatives, infrastructure improvement, and citizen grievance support.',
  founder: {
    '@type': 'Person',
    name: 'Sachin Lavate',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nerul',
    addressRegion: 'Navi Mumbai',
    addressCountry: 'India',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Nerul, Navi Mumbai',
  },
  sameAs: [
    'https://www.instagram.com/samajsevaksachinlavate',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    areaServed: 'IN',
    availableLanguage: ['English', 'Marathi'],
  },
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
  verification: {
    google: 'lemVnliLnKxpZitfTF7O2UVBwo8l3ObtqxDrqoBREjk',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
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
