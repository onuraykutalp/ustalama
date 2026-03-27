import OpportunityDetailClient from './OpportunityDetailClient'

export default async function OpportunityDetailPage({
  params
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  return <OpportunityDetailClient id={resolvedParams.id} />
}
