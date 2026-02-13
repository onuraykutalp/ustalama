const steps = [
  {
    number: '1',
    title: 'İhtiyacını Belirle',
    description: 'Ne tür bir hizmete ihtiyacın var? Kategoriler arasından seç veya arama yap.',
    icon: '🔍'
  },
  {
    number: '2',
    title: 'Hizmet Sağlayıcı Seç',
    description: 'Profilleri incele, yorumları oku ve en uygun profesyoneli seç.',
    icon: '👤'
  },
  {
    number: '3',
    title: 'Teklif Al',
    description: 'Hizmet sağlayıcıdan detaylı teklif al, fiyat ve süre konusunda anlaş.',
    icon: '💬'
  },
  {
    number: '4',
    title: 'İşini Hallet',
    description: 'Hizmeti al, memnun kal ve değerlendirme yaparak diğer kullanıcılara yardımcı ol.',
    icon: '✅'
  }
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sadece 4 basit adımda ihtiyacın olan hizmeti bul
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line (Desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 -z-10" 
                     style={{ width: 'calc(100% - 2rem)', left: 'calc(50% + 2rem)' }} />
              )}
              
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

