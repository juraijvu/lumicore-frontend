import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LumiCore Data Cleaning',
  description: 'Data cleaning application for LumiCore challenge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
