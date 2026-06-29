import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import { TooltipProvider } from '@/components/Tooltip'
import { FilterProvider } from '@/components/FilterContext'
import SiteFilter from '@/components/SiteFilter'
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
          <FilterProvider>
            <Nav />
            <div className="mx-auto max-w-6xl px-6 pt-6">
              <SiteFilter />
            </div>
            <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
          </FilterProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
