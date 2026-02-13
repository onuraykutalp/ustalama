'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Dummy blog data - API'den gelecek
const blogPosts = [
  {
    id: '1',
    slug: 'ev-temizligi-ipuclari',
    title: 'Ev Temizliği İçin 10 Pratik İpucu',
    excerpt: 'Ev temizliğini daha verimli ve hızlı hale getirmek için uzmanların önerdiği pratik ipuçlarını keşfedin.',
    content: 'Ev temizliği herkesin hayatında önemli bir yer tutar. Ancak doğru yöntemlerle hem zaman hem de enerji tasarrufu yapabilirsiniz...',
    author: {
      name: 'Ayşe Yılmaz',
      avatar: null
    },
    category: 'Temizlik',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readTime: 5,
    views: 1245
  },
  {
    id: '2',
    slug: 'bebek-bakicisi-secerken',
    title: 'Bebek Bakıcısı Seçerken Dikkat Edilmesi Gerekenler',
    excerpt: 'Çocuğunuzun güvenliği için bebek bakıcısı seçerken nelere dikkat etmelisiniz? Uzman tavsiyeleri...',
    content: 'Bebek bakıcısı seçimi, ebeveynler için en önemli kararlardan biridir. Çocuğunuzun güvenliği ve mutluluğu için...',
    author: {
      name: 'Mehmet Demir',
      avatar: null
    },
    category: 'Bakım',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    readTime: 8,
    views: 892
  },
  {
    id: '3',
    slug: 'elektrik-tamiri-guvenlik',
    title: 'Elektrik Tamiri Yaparken Güvenlik Önlemleri',
    excerpt: 'Elektrik işlerinde güvenlik her şeyden önemlidir. Bu yazıda elektrik tamiri yaparken alınması gereken önlemleri öğrenin.',
    content: 'Elektrik işleri ciddi güvenlik riskleri taşır. Profesyonel olmayan müdahaleler ciddi yaralanmalara veya maddi hasarlara yol açabilir...',
    author: {
      name: 'Zeynep Kaya',
      avatar: null
    },
    category: 'Tamir',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readTime: 6,
    views: 1567
  },
  {
    id: '4',
    slug: 'bahce-duzenleme-ilkbahar',
    title: 'İlkbahar Bahçe Düzenleme Rehberi',
    excerpt: 'İlkbahar geldi! Bahçenizi yenilemek ve düzenlemek için adım adım rehberimizi takip edin.',
    content: 'İlkbahar, bahçe düzenlemesi için mükemmel bir zamandır. Doğru planlama ve uygulama ile bahçenizi...',
    author: {
      name: 'Ali Çelik',
      avatar: null
    },
    category: 'Bahçıvanlık',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    readTime: 7,
    views: 1034
  },
  {
    id: '5',
    slug: 'ozel-ders-verimli-ogrenme',
    title: 'Özel Derste Verimli Öğrenme Teknikleri',
    excerpt: 'Özel ders alırken veya verirken daha verimli sonuçlar elde etmek için kullanabileceğiniz teknikler.',
    content: 'Özel ders, öğrencilerin akademik başarısını artırmak için etkili bir yöntemdir. Ancak verimli bir özel ders...',
    author: {
      name: 'Fatma Öz',
      avatar: null
    },
    category: 'Eğitim',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    readTime: 9,
    views: 756
  },
  {
    id: '6',
    slug: 'klima-bakimi-onemli',
    title: 'Klima Bakımı Neden Önemlidir?',
    excerpt: 'Düzenli klima bakımı hem enerji tasarrufu sağlar hem de cihazın ömrünü uzatır. Detaylar için okuyun.',
    content: 'Klima bakımı, cihazın verimli çalışması ve uzun ömürlü olması için kritik öneme sahiptir. Düzenli bakım...',
    author: {
      name: 'Can Yücel',
      avatar: null
    },
    category: 'Tamir',
    image: 'https://images.unsplash.com/photo-1631542777676-0a0e8e8e8e8e?w=800',
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    readTime: 5,
    views: 1123
  }
]

const categories = ['Tümü', 'Temizlik', 'Bakım', 'Tamir', 'Bahçıvanlık', 'Eğitim']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Tümü' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Blog
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Hizmetler, ipuçları ve rehberler
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Blog yazılarında ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 pl-14 pr-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                  />
                  <svg
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-xs">
                          {post.author.name[0]}
                        </div>
                        <span className="font-medium">{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.readTime} dk
                        </span>
                      </div>
                    </div>

                    {/* Date & Views */}
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                      <span>{formatTimeAgo(post.publishedAt)}</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.views.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sonuç bulunamadı</h3>
              <p className="text-gray-600">Aradığınız kriterlere uygun blog yazısı bulunamadı.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
      
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

