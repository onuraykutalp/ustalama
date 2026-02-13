'use client'

import { useState } from 'react'
// Search icon component
const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Arama işlemi buraya eklenecek
    console.log('Arama:', searchQuery)
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            İhtiyacın Olan Hizmeti
            <span className="block text-yellow-300">Hemen Bul</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100">
            Binlerce profesyonel hizmet sağlayıcı arasından seçim yap, 
            güvenle işini hallet
          </p>

          {/* Arama Kutusu */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl p-2 shadow-2xl">
              <div className="flex-1 flex items-center">
                <div className="ml-4 text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ne yapmak istiyorsun? (örn: temizlik, tamir, nakliye...)"
                  className="flex-1 px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Ara
              </button>
            </div>
          </form>

          {/* Popüler Aramalar */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-blue-100 text-sm">Popüler:</span>
            {['Temizlik', 'Tamir', 'Nakliye', 'Boyama', 'Tadilat'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

