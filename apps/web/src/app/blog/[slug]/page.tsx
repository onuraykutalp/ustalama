import BlogDetailClient from './BlogDetailClient'

// Generate static params for blog posts
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

export default async function BlogDetailPage({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string }
}) {
  const resolvedParams = await Promise.resolve(params)
  return <BlogDetailClient slug={resolvedParams.slug} />
}
