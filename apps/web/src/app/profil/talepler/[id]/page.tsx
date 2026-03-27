import RequestDetailClient from './RequestDetailClient'

export default async function RequestDetailPage({
  params
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  return <RequestDetailClient id={resolvedParams.id} />
}
