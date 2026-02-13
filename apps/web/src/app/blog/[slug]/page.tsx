import BlogDetailClient from './BlogDetailClient'

// Generate static params for static export
export function generateStaticParams() {
  return [
    { slug: 'ev-temizligi-ipuclari' },
    { slug: 'bebek-bakicisi-secerken' },
    { slug: 'elektrik-tamiri-guvenlik' },
    { slug: 'bahce-duzenleme-ilkbahar' },
    { slug: 'ozel-ders-verimli-ogrenme' },
    { slug: 'klima-bakimi-onemli' }
  ]
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  return <BlogDetailClient slug={params.slug} />
}
