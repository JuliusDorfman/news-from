'use client'
import { useState } from 'react'
import { presidents, termOptions } from '@/lib/presidents'

interface Props {
  presidentId: string
  termKey: string
  onSelectPresident: (id: string) => void
  onSelectTerm: (key: string) => void
}

export default function AdminFilter({ presidentId, termKey, onSelectPresident, onSelectTerm }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const current = presidents.find(p => p.id === presidentId)
  const terms = termOptions(presidentId)
  const filtered = query ? presidents.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) : presidents

  const pick = (id: string) => { onSelectPresident(id); setOpen(false); setQuery('') }
  const pill = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs transition-colors ${active ? 'border-ink bg-ink text-paper' : 'border-black/15 text-ink/70 hover:border-ink/40'}`

  return (
    <div className="rounded-lg border border-black/10 bg-white/50 p-3">
      <div className="flex flex-wrap items-baseline gap-2 text-lg">
        <span className="font-serif">The</span>
        <div className="relative">
          <button type="button" data-testid="president-trigger" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
            className="rounded-md border border-black/20 bg-paper px-2 py-0.5 font-serif font-bold hover:border-ink/50">
            {current ? current.name : 'Select president'} <span className="text-ink/40">&#9660;</span>
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => { setOpen(false); setQuery('') }} />
              <div className="absolute left-0 z-20 mt-1 w-64 rounded-md border border-black/15 bg-paper p-2 shadow-lg">
                <input autoFocus data-testid="president-search" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search presidents..." className="mb-2 w-full rounded border border-black/15 px-2 py-1 text-sm"
                  onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setQuery('') } }} />
                <ul className="max-h-60 overflow-y-auto">
                  {filtered.map(p => (
                    <li key={p.id}>
                      <button type="button" data-testid={`president-option-${p.id}`} onClick={() => pick(p.id)}
                        className={`block w-full rounded px-2 py-1 text-left text-sm hover:bg-black/5 ${p.id === presidentId ? 'font-bold' : ''}`}>
                        {p.name}
                      </button>
                    </li>
                  ))}
                  {filtered.length === 0 && <li className="px-2 py-1 text-sm text-ink/50">No match</li>}
                </ul>
              </div>
            </>
          )}
        </div>
        <span className="font-serif">Administration</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {terms.map(t => (
          <button key={t.key} type="button" data-testid={`term-${t.key}`} aria-pressed={termKey === t.key} onClick={() => onSelectTerm(t.key)} className={pill(termKey === t.key)}>
            {t.label} <span className="opacity-60">· {t.years}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-ink/50">Filters the entire page -- the heatmap and all lenses below.</p>
    </div>
  )
}
