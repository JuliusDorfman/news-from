import EntityDeepDive from '@/components/EntityDeepDive'
import { getAuthor } from '@/lib/mockData'

export default function AuthorView({ authorId }: { authorId: string }) {
  const author = getAuthor(authorId)
  if (!author) return <p>Unknown author.</p>
  return <EntityDeepDive kind="Op-Ed author" name={author.name} outlet={author.outlet} entityId={authorId} />
}
