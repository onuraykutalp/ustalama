import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikası</h1>
            <p className="text-sm text-gray-500 mb-8">Son güncelleme: 27 Mart 2026</p>

            <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-bold text-gray-900 mt-0">1. Giriş</h2>
                <p>
                  <strong>Loopcode Bilişim Yazılım Mühendislik Eğitim ve Danışmanlık A.Ş.</strong> (&quot;Şirket&quot;, &quot;Biz&quot;) olarak, <strong>ustalama.com</strong> (&quot;Platform&quot;) kullanıcılarının kişisel verilerinin korunmasına büyük önem veriyoruz.
                </p>
                <p>
                  İşbu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat çerçevesinde, kişisel verilerinizin nasıl toplandığı, işlendiği, saklandığı ve korunduğu hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
                </p>
                <p><strong>Veri Sorumlusu:</strong> Loopcode Bilişim Yazılım Mühendislik Eğitim ve Danışmanlık A.Ş.</p>
                <p><strong>Adres:</strong> Yavuz Sultan Selim, Dr. Sadık Ahmet Cd. No:24 D:1, 34083 Fatih/İstanbul</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">2. Toplanan Kişisel Veriler</h2>
                <h3 className="text-lg font-semibold text-gray-800">2.1 Doğrudan Sizden Aldığımız Veriler</h3>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Veri Kategorisi</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Örnekler</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Kimlik Bilgileri</td>
                      <td className="py-2">Ad, soyad</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">İletişim Bilgileri</td>
                      <td className="py-2">E-posta adresi, telefon numarası</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Hesap Bilgileri</td>
                      <td className="py-2">Kullanıcı adı, şifre (şifrelenmiş), profil fotoğrafı</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Finansal Bilgiler</td>
                      <td className="py-2">Ödeme kartı bilgileri (son 4 hane, kart markası; tam kart bilgileri iyzico tarafından işlenir)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Hizmet Bilgileri</td>
                      <td className="py-2">Hizmet talepleri, teklifler, değerlendirmeler, mesajlar</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold text-gray-800">2.2 Otomatik Olarak Toplanan Veriler</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP adresi, tarayıcı türü ve sürümü,</li>
                  <li>Cihaz bilgileri (işletim sistemi, ekran çözünürlüğü),</li>
                  <li>Platform kullanım istatistikleri (sayfa görüntülenmeleri, tıklamalar),</li>
                  <li>Çerez verileri (detaylar için Bölüm 7&apos;ye bakınız).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">3. Verilerin İşlenme Amaçları</h2>
                <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hesap oluşturma ve kimlik doğrulama işlemleri,</li>
                  <li>Hizmet taleplerinin ve tekliflerin yönetimi,</li>
                  <li>Ödeme işlemlerinin gerçekleştirilmesi ve güvenliğinin sağlanması,</li>
                  <li>Kullanıcılar arası mesajlaşma hizmetinin sunulması,</li>
                  <li>Platform&apos;un iyileştirilmesi ve yeni özelliklerin geliştirilmesi,</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi,</li>
                  <li>Dolandırıcılık ve güvenlik ihlallerinin önlenmesi,</li>
                  <li>Müşteriye destek sağlanması,</li>
                  <li>Bilgilendirme ve işlem e-postalarının gönderilmesi.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">4. Verilerin İşlenmesinin Hukuki Dayanakları</h2>
                <p>KVKK madde 5 ve 6 kapsamında kişisel verileriniz aşağıdaki hukuki dayanaklarla işlenmektedir:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Sözleşmenin ifası:</strong> Platform hizmetlerinin sunulması için zorunlu veri işlemeleri,</li>
                  <li><strong>Meşru menfaat:</strong> Platform güvenliği, hizmet kalitesinin arttırılması,</li>
                  <li><strong>Yasal yükümlülük:</strong> Vergi, muhasebe ve diğer yasal gerekliliklerin yerine getirilmesi,</li>
                  <li><strong>Açık rıza:</strong> Pazarlama iletişimleri ve tercihe bağlı veri işlemeleri.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">5. Verilerin Paylaşılması</h2>
                <p>Kişisel verileriniz aşağıdaki durumlar dışında üçüncü taraflarla paylaşılmaz:</p>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Paylaşılan Taraf</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Amaç</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">iyzico (Ödeme Sağlayıcı)</td>
                      <td className="py-2">Ödeme işlemlerinin gerçekleştirilmesi, 3D Secure doğrulama</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Mailgun (E-posta Sağlayıcı)</td>
                      <td className="py-2">İşlem ve bilgilendirme e-postalarının gönderilmesi</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Diğer Kullanıcılar</td>
                      <td className="py-2">Profil bilgileri, değerlendirmeler (siz yayınladığınız ölçüde)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Yasal Otoriteler</td>
                      <td className="py-2">Yasal zorunluluk halinde mahkeme kararı veya resmi talep üzerine</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">6. Verilerin Saklanması ve Güvenliği</h2>
                <h3 className="text-lg font-semibold text-gray-800">6.1 Saklama Süresi</h3>
                <p>Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve yasal zorunlulukların öngördüğü asgari süreler dahilinde saklanır. Hesabınızı sildiğinizde kişisel verileriniz makul bir süre içinde anonim hale getirilir veya silinir.</p>
                <h3 className="text-lg font-semibold text-gray-800">6.2 Güvenlik Önlemleri</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tüm veri iletişimi SSL/TLS şifreleme ile korunmaktadır,</li>
                  <li>Şifreler bcrypt algoritmasıyla tek yönlü şifrelenmektedir,</li>
                  <li>Ödeme bilgileri PCI DSS uyumlu iyzico altyapısında işlenmektedir,</li>
                  <li>Sunucularımız güvenlik duvarı ve erişim kontrol mekanizmalarıyla korunmaktadır,</li>
                  <li>Düzenli güvenlik denetimleri ve güncellemeler uygulanmaktadır.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">7. Çerezler (Cookies)</h2>
                <p>Platform, işlevsellik ve kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Zorunlu Çerezler:</strong> Oturum yönetimi ve güvenlik için gerekli çerezler,</li>
                  <li><strong>İşlevsel Çerezler:</strong> Dil tercihi, tema gibi kullanıcı ayarlarını hatırlamak için,</li>
                  <li><strong>Analitik Çerezler:</strong> Platform kullanım istatistiklerini toplamak için.</li>
                </ul>
                <p>Tarayıcı ayarlarından çerezleri yönetebilir veya devre dışı bırakabilirsiniz. Ancak bazı çerezlerin devre dışı bırakılması Platform işlevselliğini etkileyebilir.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">8. Kullanıcı Hakları (KVKK Madde 11)</h2>
                <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                  <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                  <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                  <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,</li>
                  <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme,</li>
                  <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
                  <li>Kişisel verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                  <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme.</li>
                </ul>
                <p>Bu haklarınızı kullanmak için <a href="mailto:kvkk@ustalama.com" className="text-blue-600 hover:underline">kvkk@ustalama.com</a> adresine başvurabilirsiniz. Başvurular en geç 30 gün içinde yanıtlanacaktır.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">9. Çocukların Gizliliği</h2>
                <p>
                  Platform 18 yaş altı bireylere yönelik değildir. Bilerek 18 yaş altı bireylerden kişisel veri toplamamaktayız. Böyle bir durumun tespit edilmesi halinde ilgili veriler derhal silinecektir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">10. Uluslararası Veri Aktarımı</h2>
                <p>
                  Hizmet kalitesini sağlamak için bazı verileriniz yurt dışındaki hizmet sağlayıcılara (e-posta gönderim altyapısı vb.) aktarılabilir. Bu aktarımlar KVKK&apos;nın öngördüğü güvencelere uygun olarak gerçekleştirilir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">11. Politika Değişiklikleri</h2>
                <p>
                  İşbu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler Platform üzerinden veya e-posta yoluyla bildirilecektir. Güncellenmiş politikanın yayınlanmasından sonra Platform&apos;u kullanmaya devam etmeniz, değişiklikleri kabul ettiğiniz anlamına gelir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">12. İletişim</h2>
                <p>Gizlilik ile ilgili soru, talep ve şikâyet için:</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-2">
                  <p className="font-semibold text-gray-900 mb-1">Loopcode Bilişim Yazılım Mühendislik Eğitim ve Danışmanlık A.Ş.</p>
                  <p>Yavuz Sultan Selim, Dr. Sadık Ahmet Cd. No:24 D:1, 34083 Fatih/İstanbul</p>
                  <p>Genel: <a href="mailto:info@ustalama.com" className="text-blue-600 hover:underline">info@ustalama.com</a></p>
                  <p>KVKK Başvuruları: <a href="mailto:kvkk@ustalama.com" className="text-blue-600 hover:underline">kvkk@ustalama.com</a></p>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
