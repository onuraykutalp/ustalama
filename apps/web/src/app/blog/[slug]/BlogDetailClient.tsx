'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Dummy blog data - API'den gelecek
const blogPosts: Record<string, any> = {
  'ev-temizligi-ipuclari': {
    id: '1',
    slug: 'ev-temizligi-ipuclari',
    title: 'Ev Temizliği İçin 10 Pratik İpucu',
    excerpt: 'Ev temizliğini daha verimli ve hızlı hale getirmek için uzmanların önerdiği pratik ipuçlarını keşfedin.',
    content: `
      <p>Ev temizliği herkesin hayatında önemli bir yer tutar. Ancak doğru yöntemlerle hem zaman hem de enerji tasarrufu yapabilirsiniz. İşte ev temizliğini daha verimli hale getirmek için 10 pratik ipucu:</p>
      
      <h2>1. Yukarıdan Aşağıya Temizlik</h2>
      <p>Her zaman yukarıdan aşağıya doğru temizlik yapın. Önce toz alın, sonra yerleri süpürün ve en son paspas yapın. Bu yöntem, temizlediğiniz yerlerin tekrar kirlenmesini önler.</p>
      
      <h2>2. Doğru Temizlik Ürünleri Kullanın</h2>
      <p>Her yüzey için uygun temizlik ürünü kullanmak önemlidir. Ahşap yüzeyler için özel temizleyiciler, camlar için cam temizleyicileri kullanın. Çok amaçlı temizleyiciler her zaman en iyi seçenek değildir.</p>
      
      <h2>3. Düzenli Temizlik Rutini Oluşturun</h2>
      <p>Günlük, haftalık ve aylık temizlik rutinleri oluşturun. Günlük işler (bulaşık yıkama, yatak düzeltme) küçük görünse de büyük fark yaratır.</p>
      
      <h2>4. Temizlik Malzemelerini Organize Edin</h2>
      <p>Tüm temizlik malzemelerinizi bir sepet veya çantada toplayın. Böylece temizlik yaparken sürekli bir şeyler aramak zorunda kalmazsınız.</p>
      
      <h2>5. Mikrofiber Bezler Kullanın</h2>
      <p>Mikrofiber bezler, normal bezlere göre çok daha etkilidir. Toz ve kirleri daha iyi yakalar ve yüzeyleri parlatır.</p>
      
      <h2>6. Doğal Temizlik Çözümleri</h2>
      <p>Sirke, karbonat ve limon gibi doğal malzemeler birçok temizlik işi için kullanılabilir. Hem çevre dostu hem de ekonomiktirler.</p>
      
      <h2>7. Zamanlayıcı Kullanın</h2>
      <p>Her oda için belirli bir süre belirleyin ve zamanlayıcı kullanın. Bu, temizliği daha verimli hale getirir ve oyalanmayı önler.</p>
      
      <h2>8. Bir Odayı Bitirmeden Diğerine Geçmeyin</h2>
      <p>Bir odayı tamamen bitirmeden diğerine geçmek, işleri yarım bırakmanıza neden olur. Her odayı tamamen temizleyin.</p>
      
      <h2>9. Havalandırma Önemlidir</h2>
      <p>Temizlik yaparken pencereleri açın. Temiz hava hem sağlığınız hem de temizlik ürünlerinin kokusunu dağıtmak için önemlidir.</p>
      
      <h2>10. Profesyonel Yardım Alın</h2>
      <p>Derin temizlik veya özel durumlar için profesyonel temizlik hizmeti almayı düşünün. Uzmanlar, zaman ve enerji tasarrufu sağlar.</p>
      
      <p>Bu ipuçlarını uygulayarak ev temizliğinizi daha verimli ve keyifli hale getirebilirsiniz. Unutmayın, düzenli temizlik, derin temizlikten daha etkilidir!</p>
    `,
    author: {
      name: 'Ayşe Yılmaz',
      avatar: null,
      bio: '10 yıllık temizlik uzmanı, ev düzeni ve organizasyon konusunda deneyimli.'
    },
    category: 'Temizlik',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readTime: 5,
    views: 1245,
    tags: ['ev temizliği', 'ipuçları', 'pratik çözümler', 'temizlik rutini']
  },
  'bebek-bakicisi-secerken': {
    id: '2',
    slug: 'bebek-bakicisi-secerken',
    title: 'Bebek Bakıcısı Seçerken Dikkat Edilmesi Gerekenler',
    excerpt: 'Çocuğunuzun güvenliği için bebek bakıcısı seçerken nelere dikkat etmelisiniz? Uzman tavsiyeleri...',
    content: `
      <p>Bebek bakıcısı seçimi, ebeveynler için en önemli kararlardan biridir. Çocuğunuzun güvenliği ve mutluluğu için doğru kişiyi seçmek kritik öneme sahiptir.</p>
      
      <h2>1. Referans Kontrolü</h2>
      <p>Mutlaka önceki işverenlerden referans alın. En az 2-3 referans kontrol edin ve detaylı sorular sorun.</p>
      
      <h2>2. Sertifikalar ve Eğitimler</h2>
      <p>İlk yardım sertifikası, bebek bakımı eğitimi gibi belgeleri kontrol edin. Bu belgeler, bakıcının profesyonel olduğunu gösterir.</p>
      
      <h2>3. Deneyim</h2>
      <p>Yaş grubunuza uygun deneyime sahip bir bakıcı seçin. Yeni doğan bebek bakımı ile 2 yaş çocuk bakımı farklı deneyimler gerektirir.</p>
      
      <h2>4. Kişilik Uyumu</h2>
      <p>Bakıcının kişiliği ve yaklaşımı, çocuğunuzun kişiliği ile uyumlu olmalıdır. Bir deneme süresi ayarlayın.</p>
      
      <h2>5. Güvenlik Kontrolleri</h2>
      <p>Arka plan kontrolü yapın ve güvenlik kayıtlarını inceleyin. Çocuğunuzun güvenliği her şeyden önemlidir.</p>
    `,
    author: {
      name: 'Mehmet Demir',
      avatar: null,
      bio: 'Çocuk gelişimi uzmanı ve ebeveyn danışmanı.'
    },
    category: 'Bakım',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    readTime: 8,
    views: 892,
    tags: ['bebek bakımı', 'bakıcı seçimi', 'güvenlik', 'çocuk gelişimi']
  },
  'elektrik-tamiri-guvenlik': {
    id: '3',
    slug: 'elektrik-tamiri-guvenlik',
    title: 'Elektrik Tamiri Yaparken Güvenlik Önlemleri',
    excerpt: 'Elektrik işlerinde güvenlik her şeyden önemlidir. Bu yazıda elektrik tamiri yaparken alınması gereken önlemleri öğrenin.',
    content: `
      <p>Elektrik işleri ciddi güvenlik riskleri taşır. Profesyonel olmayan müdahaleler ciddi yaralanmalara veya maddi hasarlara yol açabilir.</p>
      
      <h2>1. Güç Kaynağını Kapatın</h2>
      <p>Herhangi bir elektrik işine başlamadan önce mutlaka sigortayı kapatın ve elektriğin kesildiğinden emin olun.</p>
      
      <h2>2. Doğru Araçlar Kullanın</h2>
      <p>Yalıtımlı aletler kullanın ve asla ıslak ellerle çalışmayın. Elektrik işleri için özel tasarlanmış aletler kullanın.</p>
      
      <h2>3. Profesyonel Yardım Alın</h2>
      <p>Karmaşık elektrik işleri için mutlaka lisanslı bir elektrikçi çağırın. Güvenliğiniz her şeyden önemlidir.</p>
    `,
    author: {
      name: 'Zeynep Kaya',
      avatar: null,
      bio: 'Lisanslı elektrik mühendisi ve güvenlik uzmanı.'
    },
    category: 'Tamir',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readTime: 6,
    views: 1567,
    tags: ['elektrik', 'güvenlik', 'tamir', 'önlemler']
  },
  'bahce-duzenleme-ilkbahar': {
    id: '4',
    slug: 'bahce-duzenleme-ilkbahar',
    title: 'İlkbahar Bahçe Düzenleme Rehberi',
    excerpt: 'İlkbahar geldi! Bahçenizi yenilemek ve düzenlemek için adım adım rehberimizi takip edin.',
    content: `
      <p>İlkbahar, bahçe düzenlemesi için mükemmel bir zamandır. Doğru planlama ve uygulama ile bahçenizi güzelleştirebilirsiniz.</p>
      
      <h2>1. Toprak Hazırlığı</h2>
      <p>İlkbahar başında toprağı hazırlayın. Toprağı havalandırın ve gerekli gübrelemeyi yapın.</p>
      
      <h2>2. Bitki Seçimi</h2>
      <p>İkliminize uygun bitkiler seçin. Yerli bitkiler genellikle daha az bakım gerektirir.</p>
      
      <h2>3. Sulama Sistemi</h2>
      <p>Verimli bir sulama sistemi kurun. Damla sulama sistemi hem su tasarrufu sağlar hem de bitkiler için idealdir.</p>
    `,
    author: {
      name: 'Ali Çelik',
      avatar: null,
      bio: 'Peyzaj mimarı ve bahçe düzenleme uzmanı.'
    },
    category: 'Bahçıvanlık',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    readTime: 7,
    views: 1034,
    tags: ['bahçe', 'peyzaj', 'ilkbahar', 'bitki bakımı']
  },
  'ozel-ders-verimli-ogrenme': {
    id: '5',
    slug: 'ozel-ders-verimli-ogrenme',
    title: 'Özel Derste Verimli Öğrenme Teknikleri',
    excerpt: 'Özel ders alırken veya verirken daha verimli sonuçlar elde etmek için kullanabileceğiniz teknikler.',
    content: `
      <p>Özel ders, öğrencilerin akademik başarısını artırmak için etkili bir yöntemdir. Ancak verimli bir özel ders için doğru yaklaşım gereklidir.</p>
      
      <h2>1. Hedef Belirleme</h2>
      <p>Ders başlamadan önce net hedefler belirleyin. Öğrencinin hangi konularda zorlandığını tespit edin.</p>
      
      <h2>2. Kişiselleştirilmiş Yaklaşım</h2>
      <p>Her öğrencinin öğrenme stili farklıdır. Öğrencinin öğrenme stilini keşfedin ve buna göre ders planı yapın.</p>
      
      <h2>3. Düzenli Takip</h2>
      <p>Düzenli geri bildirim ve takip, öğrencinin ilerlemesini görmek için önemlidir.</p>
    `,
    author: {
      name: 'Fatma Öz',
      avatar: null,
      bio: 'Eğitim danışmanı ve özel ders öğretmeni.'
    },
    category: 'Eğitim',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    readTime: 9,
    views: 756,
    tags: ['eğitim', 'özel ders', 'öğrenme', 'akademik başarı']
  },
  'klima-bakimi-onemli': {
    id: '6',
    slug: 'klima-bakimi-onemli',
    title: 'Klima Bakımı Neden Önemlidir?',
    excerpt: 'Düzenli klima bakımı hem enerji tasarrufu sağlar hem de cihazın ömrünü uzatır. Detaylar için okuyun.',
    content: `
      <p>Klima bakımı, cihazın verimli çalışması ve uzun ömürlü olması için kritik öneme sahiptir. Düzenli bakım yapılmadığında...</p>
      
      <h2>1. Enerji Tasarrufu</h2>
      <p>Temiz ve bakımlı bir klima, daha az enerji tüketir. Bu hem çevre hem de cebiniz için iyidir.</p>
      
      <h2>2. Hava Kalitesi</h2>
      <p>Düzenli bakım, iç mekan hava kalitesini artırır. Filtrelerin temizlenmesi önemlidir.</p>
      
      <h2>3. Uzun Ömür</h2>
      <p>Düzenli bakım, klimanın ömrünü uzatır ve büyük onarım masraflarından kaçınmanızı sağlar.</p>
    `,
    author: {
      name: 'Can Yücel',
      avatar: null,
      bio: 'Klima servis uzmanı ve HVAC mühendisi.'
    },
    category: 'Tamir',
    image: 'https://images.unsplash.com/photo-1631542777676-0a0e8e8e8e8e?w=1200',
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    readTime: 5,
    views: 1123,
    tags: ['klima', 'bakım', 'enerji tasarrufu', 'HVAC']
  }
}

export default function BlogDetailClient({ slug }: { slug: string }) {
  const router = useRouter()
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    const foundPost = blogPosts[slug]
    if (foundPost) {
      setPost(foundPost)
    }
  }, [slug])

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Yükleniyor...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Bugün'
    if (diffInDays === 1) return 'Dün'
    if (diffInDays < 7) return `${diffInDays} gün önce`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} ay önce`
    return `${Math.floor(diffInDays / 365)} yıl önce`
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 font-medium">{post.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-64 md:h-96 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-4xl">
              <span className="inline-block px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                      {post.author.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{post.author.name}</p>
                      <p className="text-sm text-gray-500">{formatTimeAgo(post.publishedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500 ml-auto">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {post.readTime} dakika okuma
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.views.toLocaleString('tr-TR')} görüntüleme
                    </span>
                  </div>
                </div>

                {/* Article Body */}
                <div 
                  className="prose prose-lg max-w-none text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Card */}
                <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {post.author.name[0]}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{post.author.name}</h3>
                      {post.author.bio && (
                        <p className="text-gray-600 mb-4">{post.author.bio}</p>
                      )}
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                        Tüm Yazıları Görüntüle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Share Buttons */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Paylaş</h3>
                    <div className="flex flex-col gap-3">
                      <button className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook&apos;ta Paylaş
                      </button>
                      <button className="flex items-center gap-3 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter&apos;da Paylaş
                      </button>
                      <button className="flex items-center gap-3 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn&apos;de Paylaş
                      </button>
                    </div>
                  </div>

                  {/* Related Posts */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">İlgili Yazılar</h3>
                    <div className="space-y-4">
                      {Object.values(blogPosts)
                        .filter((p: any) => p.id !== post.id && p.category === post.category)
                        .slice(0, 3)
                        .map((relatedPost: any) => (
                          <Link
                            key={relatedPost.id}
                            href={`/blog/${relatedPost.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex-shrink-0 overflow-hidden">
                                <img
                                  src={relatedPost.image}
                                  alt={relatedPost.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                                  {relatedPost.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(relatedPost.publishedAt)}</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}

