import TopicView from '@/components/views/TopicView'

export default async function Page({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  return <TopicView topicId={topicId} />
}
