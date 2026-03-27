'use client'

import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryCard from '@/components/CategoryCard'
import { useCategoriesStore } from '@/store/useCategoriesStore'
// Icon Components
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const GridIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
)

const ListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

// Mock data - gerçek uygulamada API'den gelecek (fallback için)
const fallbackCategories = [
  {
    id: '1',
    name: 'Temizlik',
    icon: '🧹',
    description: 'Ev ve ofis temizlik hizmetleri',
    count: 245,
    slug: 'temizlik',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2',
    name: 'Tamir & Bakım',
    icon: '🔧',
    description: 'Elektrik, su tesisatı, beyaz eşya tamiri',
    count: 189,
    slug: 'tamir',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: '3',
    name: 'Nakliye',
    icon: '🚚',
    description: 'Ev eşyası taşıma ve nakliye hizmetleri',
    count: 156,
    slug: 'nakliye',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: '4',
    name: 'Boyama & Badana',
    icon: '🎨',
    description: 'İç ve dış cephe boyama işleri',
    count: 98,
    slug: 'boyama',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '5',
    name: 'Bahçe & Peyzaj',
    icon: '🌳',
    description: 'Bahçe düzenleme ve peyzaj tasarımı',
    count: 67,
    slug: 'bahce',
    color: 'from-green-600 to-teal-600'
  },
  {
    id: '6',
    name: 'Ders & Eğitim',
    icon: '📚',
    description: 'Özel ders ve eğitim hizmetleri',
    count: 234,
    slug: 'egitim',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: '7',
    name: 'Sağlık & Bakım',
    icon: '💆',
    description: 'Kişisel bakım ve sağlık hizmetleri',
    count: 145,
    slug: 'saglik',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: '8',
    name: 'Düğün & Organizasyon',
    icon: '🎉',
    description: 'Düğün, nişan ve özel gün organizasyonları',
    count: 89,
    slug: 'organizasyon',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '9',
    name: 'Fotoğraf & Video',
    icon: '📸',
    description: 'Profesyonel fotoğraf ve video çekimi',
    count: 112,
    slug: 'fotograf',
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: '10',
    name: 'Yazılım & Teknoloji',
    icon: '💻',
    description: 'Web tasarım, yazılım geliştirme ve teknik destek',
    count: 178,
    slug: 'teknoloji',
    color: 'from-slate-500 to-gray-600'
  },
  {
    id: '11',
    name: 'Mutfak & Yemek',
    icon: '🍳',
    description: 'Özel yemek servisi ve mutfak organizasyonu',
    count: 134,
    slug: 'mutfak',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    id: '12',
    name: 'Spor & Fitness',
    icon: '💪',
    description: 'Kişisel antrenör ve fitness eğitimi',
    count: 95,
    slug: 'spor',
    color: 'from-red-500 to-pink-500'
  }
]

type ViewMode = 'grid' | 'list'

export default function CategoriesPage() {
  const { categories, fetchCategories, loading } = useCategoriesStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Categories'i display formatına çevir
  const categoryColors = [
    'from-blue-500 to-cyan-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-green-600 to-teal-600',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-yellow-500 to-orange-500',
    'from-violet-500 to-purple-500',
    'from-slate-500 to-gray-600',
    'from-amber-500 to-yellow-500',
    'from-red-500 to-pink-500',
  ]

  const displayCategories = useMemo(() => {
    return categories.map((cat, index) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '📦',
      description: cat.description || '',
      count: cat.services?.length || 0,
      slug: cat.slug,
      color: categoryColors[index % categoryColors.length]
    }))
  }, [categories])

  const filteredCategories = useMemo(() => {
    const cats = displayCategories.length > 0 ? displayCategories : fallbackCategories
    if (!searchQuery.trim()) return cats
    
    const query = searchQuery.toLowerCase()
    return cats.filter(
      (category) =>
        category.name.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query)
    )
  }, [searchQuery, displayCategories])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 pt-20 pb-16">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                <SparklesIcon className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">{categories.length}+ Kategori</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Hizmet Kategorileri
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                İhtiyacın olan hizmeti kategoriler arasından kolayca bul ve en iyi hizmet sağlayıcıları keşfet
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Kategori ara... (örn: temizlik, tamir)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg rounded-2xl border-0 shadow-2xl focus:ring-2 focus:ring-white/50 focus:outline-none bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header with View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Tüm Kategoriler
                </h2>
                <p className="text-gray-600">
                  {filteredCategories.length} kategori bulundu
                </p>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-md border border-gray-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Grid görünümü"
                >
                  <GridIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Liste görünümü"
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Categories Grid/List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">Kategoriler yükleniyor...</p>
              </div>
            ) : filteredCategories.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    name={category.name}
                    icon={category.icon}
                    description={category.description}
                    count={category.count}
                    href={`/kategori/${category.slug}`}
                    color={category.color}
                    viewMode={viewMode}
                    isHovered={hoveredCategory === category.id}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Kategori bulunamadı
                </h3>
                <p className="text-gray-600 mb-6">
                  &quot;{searchQuery}&quot; için sonuç bulunamadı. Farklı bir arama terimi deneyin.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Aramayı Temizle
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

