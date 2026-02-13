import { generateStaticParams } from './generateStaticParams'
import RequestDetailClient from './RequestDetailClient'

export { generateStaticParams }

export default function RequestDetailPage({ params }: { params: { id: string } }) {
  return <RequestDetailClient id={params.id} />
}

