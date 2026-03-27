'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const handleLogout = () => {
    logout()
    router.push('/')
    setShowProfileDropdown(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!showProfileDropdown) return
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showProfileDropdown])

  return (
    <header className="bg-white/90 backdrop-blur sticky top-0 z-50 shadow-[0_2px_12px_0_rgba(0,0,0,0.06)] transition-all">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-2xl tracking-tighter select-none">U</span>
            </div>
            <span className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Ustalama</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2 lg:gap-6">
            <Link href="/" className="nav-btn text-gray-900 font-semibold">
              Ana Sayfa
            </Link>
            <Link href="/categories" className="nav-btn text-gray-900 font-semibold">
              Kategoriler
            </Link>
            <Link href="/blog" className="nav-btn text-gray-900 font-semibold">
              Blog
            </Link>
            <Link href="/hizmet-verenler/premium" className="nav-btn text-gray-900 font-semibold relative">
              Premium Hizmet Verenler
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </Link>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 ml-6 relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name || ''} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{user.name || user.email}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href={user.role === 'PROVIDER' ? '/profil/provider' : '/profil/customer'}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Profilim
                    </Link>
                    <Link
                      href="/profil/duzenle"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      Ayarlar
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-1 lg:gap-3 ml-6">
                <Link href="/login" className="border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 px-5 py-2 rounded-lg font-semibold text-base transition-all shadow-sm">
                  Giriş Yap
                </Link>
                <Link 
                  href="/register"
                  className="bg-gradient-to-br from-blue-600 to-violet-600 text-white px-5 py-2 rounded-lg font-semibold text-base shadow hover:brightness-110 transition-all"
                >
                  Hizmet Ver
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Menüyü Aç/Kapat"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 bg-black/40 z-40 transition-opacity ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)} />
        <div className={`md:hidden fixed top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg z-50 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Ustalama</span>
            </Link>
            <button
              title="Menüyü kapat"
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col p-5 gap-2">
            <Link href="/" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
              Ana Sayfa
            </Link>
            <Link href="/categories" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
              Kategoriler
            </Link>
            <Link href="/blog" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
              Blog
            </Link>
            <Link href="/hizmet-verenler/premium" className="mobile-nav-btn relative" onClick={() => setIsMenuOpen(false)}>
              Premium Hizmet Verenler
              <span className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full"></span>
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link
                  href={user.role === 'PROVIDER' ? '/profil/provider' : '/profil/customer'}
                  className="mobile-nav-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profilim
                </Link>
                <Link
                  href="/profil/duzenle"
                  className="mobile-nav-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ayarlar
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="mobile-nav-btn text-red-600 hover:bg-red-50 text-left"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="mobile-nav-btn" onClick={() => setIsMenuOpen(false)}>
                  Giriş Yap
                </Link>
                <Link 
                  href="/register"
                  className="mobile-nav-btn bg-gradient-to-br from-blue-600 to-violet-600 text-white text-center hover:brightness-110"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hizmet Ver
                </Link>
              </>
            )}
          </div>
        </div>

      </nav>
      <style jsx global>{`
        .nav-btn {
          @apply px-4 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-base font-medium transition-colors duration-100;
        }
        .mobile-nav-btn {
          @apply block px-4 py-3 rounded-lg font-semibold text-base text-gray-700 hover:bg-blue-50 transition-colors;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-16px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.18s ease;
        }
      `}</style>
    </header>
  )
}
