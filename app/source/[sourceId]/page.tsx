import SourceView from '@/components/views/SourceView'

export default async function Page({ params }: { params: Promise<{ sourceId: string }> }) {
  const { sourceId } = await params
  return <SourceView sourceId={sourceId} />
}
