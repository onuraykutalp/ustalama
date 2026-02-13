'use client'

import Link from 'next/link'
import Image from 'next/image'

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

interface CategoryCardProps {
  name: string
  icon: string
  description: string
  count?: number
  href: string
  color?: string
  viewMode?: 'grid' | 'list'
  isHovered?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  image?: string
}

export default function CategoryCard({
  name,
  icon,
  description,
  count,
  href,
  color = 'from-blue-500 to-purple-500',
  viewMode = 'grid',
  isHovered = false,
  onMouseEnter,
  onMouseLeave,
  image
}: CategoryCardProps) {
  if (viewMode === 'list') {
    return (
      <Link
        href={href}
        className="group block"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 flex items-center gap-6">
          {image ? (
            <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden shadow-lg group-hover:scale-110 transition-all duration-300 relative">
              <Image src={image} alt={name} fill className="object-cover" />
            </div>
          ) : (
            <div
              className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}
            >
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {name}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{description}</p>
                {count !== undefined && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      {count} hizmet sağlayıcı
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                  <ArrowRightIcon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="group block h-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative h-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent overflow-hidden">
        {/* Gradient Background on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Image or Icon */}
          <div className="mb-4">
            {image ? (
              <div className="w-full h-32 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-all duration-500 relative">
                <Image src={image} alt={name} fill className="object-cover" />
              </div>
            ) : (
              <div
                className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}
              >
                {icon}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
            {name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{description}</p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-blue-100 transition-colors">
            {count !== undefined && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                {count} sağlayıcı
              </span>
            )}
            <div className="flex items-center gap-2 text-blue-600 group-hover:gap-3 transition-all">
              <span className="text-sm font-semibold group-hover:text-blue-700">
                Keşfet
              </span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </Link>
  )
}
