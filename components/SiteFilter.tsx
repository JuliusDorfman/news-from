'use client'
import AdminFilter from './AdminFilter'
import { useFilter } from './FilterContext'

export default function SiteFilter() {
  const { presidentId, termKey, setPresident, setTerm } = useFilter()
  return <AdminFilter presidentId={presidentId} termKey={termKey} onSelectPresident={setPresident} onSelectTerm={setTerm} />
}
