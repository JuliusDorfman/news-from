'use client'
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { defaultTermKey } from '@/lib/presidents'

const DEFAULT_PRESIDENT = 'trump'

export interface FilterState {
  presidentId: string
  termKey: string
  setPresident: (id: string) => void
  setTerm: (key: string) => void
}

const FilterCtx = createContext<FilterState | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [presidentId, setPid] = useState(DEFAULT_PRESIDENT)
  const [termKey, setTermKey] = useState(() => defaultTermKey(DEFAULT_PRESIDENT))
  const setPresident = useCallback((id: string) => { setPid(id); setTermKey(defaultTermKey(id)) }, [])
  const setTerm = useCallback((key: string) => setTermKey(key), [])
  const value = useMemo(() => ({ presidentId, termKey, setPresident, setTerm }), [presidentId, termKey, setPresident, setTerm])
  return <FilterCtx.Provider value={value}>{children}</FilterCtx.Provider>
}

// Falls back to a default (no-op) state when used outside a provider, so standalone
// component tests render without wrapping in FilterProvider.
export function useFilter(): FilterState {
  const ctx = useContext(FilterCtx)
  return ctx ?? { presidentId: DEFAULT_PRESIDENT, termKey: defaultTermKey(DEFAULT_PRESIDENT), setPresident: () => {}, setTerm: () => {} }
}
