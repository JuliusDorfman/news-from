import EntityDeepDive from '@/components/EntityDeepDive'
import { getSource } from '@/lib/mockData'

export default function SourceView({ sourceId }: { sourceId: string }) {
  const source = getSource(sourceId)
  if (!source) return <p>Unknown outlet.</p>
  return <EntityDeepDive kind="Outlet" name={source.name} entityId={sourceId} />
}
