import EntityDeepDive from '@/components/EntityDeepDive'
import { getCreator } from '@/lib/mockData'

export default function CreatorView({ creatorId }: { creatorId: string }) {
  const creator = getCreator(creatorId)
  if (!creator) return <p>Unknown creator.</p>
  return <EntityDeepDive kind="Creator" name={creator.name} affiliation={creator.platform} entityId={creatorId} />
}
