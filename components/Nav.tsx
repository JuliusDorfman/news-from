import Link from 'next/link'
import ColorblindToggle from './ColorblindToggle'

export default function Nav() {
  return (
    <header className="border-b border-black/10">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-serif font-bold tracking-tight">News-From</Link>
        <div className="flex items-center gap-6 text-sm text-ink/70">
          <Link href="/source/cnn" className="hover:text-ink">Outlets</Link>
          <Link href="/author/a-hartman" className="hover:text-ink">Authors</Link>
          <Link href="/creator/c-hasan" className="hover:text-ink">Creators</Link>
          <ColorblindToggle />
        </div>
      </nav>
    </header>
  )
}
