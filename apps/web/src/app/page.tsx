import Header from '@/components/Header'
import Hero from '@/components/Hero'
import CategoriesSection from '@/components/CategoriesSection'
import FeaturedProviders from '@/components/FeaturedProviders'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoriesSection />
        <FeaturedProviders />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
