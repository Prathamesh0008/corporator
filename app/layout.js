import './globals.css'
import { Inter } from 'next/font/google'
import { LanguageProvider } from '../contexts/LanguageContext'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import WhatsAppFloat from '../components/Common/WhatsAppFloat'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Corporator Sachin Lavate | Ward 24(D) Navi Mumbai',
  description: 'Official website of Corporator Sachin Devappa Lavate, Ward 24(D), Navi Mumbai Municipal Corporation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
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
