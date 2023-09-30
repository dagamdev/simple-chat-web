import '@/styles/globals.css'
import UserProvider from '@/providers/user-provider'
import { PROJECT_NAME } from '@/utils/config'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | ' + PROJECT_NAME,
    absolute: PROJECT_NAME
  },
  description: 'Simple chat application developed by David Garcia',
  themeColor: '#4A87C9',
  openGraph: {
    images: '/icon.png'
  }
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
