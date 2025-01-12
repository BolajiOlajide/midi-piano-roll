import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MIDI Piano Roll',
  description: 'MIDI Piano Roll',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
