import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import { TooltipProvider } from '@/components/Tooltip'
import './globals.css'

export const metadata: Metadata = {
  title: 'News-From — Where the press stands',
  description: 'How news outlets and Op-Ed authors lean across topics.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>
          <Nav />
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  )
}
