import AuthorView from '@/components/views/AuthorView'

export default async function Page({ params }: { params: Promise<{ authorId: string }> }) {
  const { authorId } = await params
  return <AuthorView authorId={authorId} />
}
