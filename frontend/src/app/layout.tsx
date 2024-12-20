import '../globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BUYDATE - Your Trading Companion',
  description: 'Elevate your trading with AI-powered insights and advanced analytics.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-gray-900 text-purple-100`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}

