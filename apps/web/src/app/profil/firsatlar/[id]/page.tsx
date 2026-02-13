import OpportunityDetailClient from './OpportunityDetailClient'

// Generate static params for static export
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' }
  ]
}

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  return <OpportunityDetailClient id={params.id} />
}
