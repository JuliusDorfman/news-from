import CreatorView from '@/components/views/CreatorView'

export default async function Page({ params }: { params: Promise<{ creatorId: string }> }) {
  const { creatorId } = await params
  return <CreatorView creatorId={creatorId} />
}
