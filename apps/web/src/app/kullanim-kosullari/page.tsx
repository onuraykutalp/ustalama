import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanım Koşulları</h1>
            <p className="text-sm text-gray-500 mb-8">Son güncelleme: 27 Mart 2026</p>

            <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-bold text-gray-900 mt-0">1. Taraflar ve Tanımlar</h2>
                <p>
                  İşbu Kullanım Koşulları Sözleşmesi (&quot;Sözleşme&quot;), <strong>Loopcode Bilişim Yazılım Mühendislik Eğitim ve Danışmanlık A.Ş.</strong> (&quot;Şirket&quot;, &quot;Biz&quot;) tarafından işletilen <strong>ustalama.com</strong> (&quot;Platform&quot;) ile Platform&apos;u kullanan gerçek veya tüzel kişiler (&quot;Kullanıcı&quot;, &quot;Siz&quot;) arasındaki hukuki ilişkiyi düzenler.
                </p>
                <p><strong>Şirket Adresi:</strong> Yavuz Sultan Selim, Dr. Sadık Ahmet Cd. No:24 D:1, 34083 Fatih/İstanbul</p>
                <p>Platform&apos;a erişim sağlayarak veya hesap oluşturarak işbu Sözleşme&apos;nin tüm hükümlerini kabul etmiş sayılırsınız.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Hizmet Sağlayıcı (Usta):</strong> Platform üzerinden hizmet sunan bireysel veya kurumsal kullanıcılar.</li>
                  <li><strong>Müşteri:</strong> Platform üzerinden hizmet talep eden kullanıcılar.</li>
                  <li><strong>İçerik:</strong> Platform&apos;da yayınlanan her türlü metin, görsel, yorum ve diğer materyaller.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">2. Platform&apos;un Amacı ve Kapsamı</h2>
                <p>
                  Ustalama, hizmet sağlayıcılar ile müşterileri buluşturan bir aracılık platformudur. Platform;
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Müşterilerin hizmet taleplerini yayınlamasını,</li>
                  <li>Hizmet sağlayıcıların bu taleplere teklif vermesini,</li>
                  <li>Tarafların iletişim kurmasını ve anlaşmasını,</li>
                  <li>Ödeme işlemlerinin güvenli bir şekilde gerçekleştirilmesini sağlar.</li>
                </ul>
                <p>
                  Şirket, hizmet sağlayıcıları ile müşteriler arasındaki ilişkide <strong>aracılık rolü</strong> üstlenmekte olup, sunulan hizmetlerin kalitesi, tamamlanması veya sonuçları konusunda doğrudan sorumluluk taşımamaktadır.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">3. Üyelik ve Hesap Koşulları</h2>
                <h3 className="text-lg font-semibold text-gray-800">3.1 Hesap Oluşturma</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Platform&apos;a üye olmak için 18 yaşından büyük olmanız gerekmektedir.</li>
                  <li>Kayıt sırasında verilen bilgilerin doğru, güncel ve eksiksiz olması zorunludur.</li>
                  <li>Her kullanıcının yalnızca bir hesabı olabilir.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">3.2 Hesap Güvenliği</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hesap bilgilerinizin güvenliğinden siz sorumlusunuz.</li>
                  <li>Şifrenizi üçüncü kişilerle paylaşmayınız.</li>
                  <li>Hesabınızda yetkisiz erişim tespit ettiğinizde derhal bizi bilgilendiriniz.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">3.3 Hesap Askıya Alınması ve Kapatılması</h3>
                <p>Şirket, aşağıdaki durumlarda hesabınızı askıya alma veya kalıcı olarak kapatma hakkını saklı tutar:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Sözleşme ihlali,</li>
                  <li>Sahte veya yanıltıcı bilgi kullanımı,</li>
                  <li>Diğer kullanıcılara yönelik taciz veya dolandırıcılık,</li>
                  <li>Platform&apos;un işleyişini bozan davranışlar.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">4. Hizmet Sağlayıcı Yükümlülükleri</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Sunduğu hizmet alanında gerekli yetkinlik ve yetkiye sahip olmalıdır.</li>
                  <li>Teklif verdiği hizmetleri belirtilen koşullarda ve süresinde tamamlamalıdır.</li>
                  <li>Mesleki standartlara ve ilgili mevzuata uygun hareket etmelidir.</li>
                  <li>Müşteri ile yapılan anlaşmaya sadık kalmalıdır.</li>
                  <li>Profil bilgilerini doğru ve güncel tutmalıdır.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">5. Müşteri Yükümlülükleri</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hizmet taleplerini açık, anlaşılır ve doğru şekilde tanımlamalıdır.</li>
                  <li>Kabul ettiği teklifin gerekliliklerini yerine getirmelidir (erişim, ödeme vs.).</li>
                  <li>Hizmet sağlayıcı ile dürüst ve saygılı iletişim kurmalıdır.</li>
                  <li>Tamamlanan hizmetler için adil ve doğru değerlendirme yapmalıdır.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">6. Ödeme Koşulları</h2>
                <h3 className="text-lg font-semibold text-gray-800">6.1 Ödeme Altyapısı</h3>
                <p>Platform&apos;daki ödemeler, lisanslı ödeme hizmet sağlayıcısı <strong>iyzico</strong> altyapısı üzerinden gerçekleştirilmektedir. Tüm finansal işlemler 3D Secure güvenliği ile korunmaktadır.</p>
                <h3 className="text-lg font-semibold text-gray-800">6.2 Bakiye Sistemi</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Kullanıcılar hesaplarına bakiye yükleyebilir.</li>
                  <li>Yüklenen bakiye Platform içindeki hizmet ödemeleri için kullanılır.</li>
                  <li>Bakiye, nakde çevrilemez ve başka platformlara aktarılamaz.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">6.3 Premium Üyelik</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Premium üyelik tek seferlik ödeme ile sunulmaktadır.</li>
                  <li>Premium özellikleri: sınırsız teklif verme, öncelikli görünürlük, premium rozeti.</li>
                  <li>Premium üyelik ücreti iade edilemez (7 günlük cayma hakkı hariç).</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">6.4 İade Politikası</h3>
                <p>Premium üyelik satın alındıktan sonra 7 gün içinde, herhangi bir gerekçe belirtmeksizin iade talebinde bulunulabilir. İade işlemleri 3-5 iş günü içinde tamamlanır.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">7. İçerik Politikası</h2>
                <h3 className="text-lg font-semibold text-gray-800">7.1 Kullanıcı İçeriği</h3>
                <p>Platform&apos;a yüklediğiniz içeriklerden (profil bilgileri, yorumlar, görseller) tamamen siz sorumlusunuz. Aşağıdaki içeriklerin yayınlanması yasaktır:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Yasadışı, muzır veya hakaret içeren içerikler,</li>
                  <li>Üçüncü kişilerin fikri mülkiyet haklarını ihlal eden materyaller,</li>
                  <li>Yanıltıcı, sahte veya dolandırıcılık amaçlı bilgiler,</li>
                  <li>Reklam, spam veya istenmeyen ticari iletiler.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">7.2 İçerik Kaldırılması</h3>
                <p>Şirket, Sözleşme&apos;ye aykırı içerikleri önceden bildirimde bulunmaksızın kaldırma hakkını saklı tutar.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">8. Fikri Mülkiyet Hakları</h2>
                <p>
                  Platform&apos;un tasarımı, yazılımı, logosu, ticari markası ve diğer fikri mülkiyet unsurları Şirket&apos;e aittir ve telif hakları ile korunmaktadır. Şirket&apos;in önceden yazılı izni olmaksızın kopyalanamaz, dağıtılamaz veya değiştirilemez.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">9. Sorumluluk Sınırlaması</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Platform &quot;olduğu gibi&quot; sunulmaktadır. Kesintisiz veya hatasız çalışma garantisi verilmemektedir.</li>
                  <li>Şirket, kullanıcılar arası anlaşmazlıklardan, hizmet kalitesinden veya hizmetten kaynaklanan zararlardan sorumlu değildir.</li>
                  <li>Şirket&apos;in toplam sorumluluğu, kullanıcının son 12 ayda Platform&apos;a ödediği toplam tutarı aşamaz.</li>
                  <li>Şirket, üçüncü taraf web sitelerine verilen bağlantıların içeriğinden sorumlu değildir.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">10. Uyuşmazlık Çözümü</h2>
                <p>
                  İşbu Sözleşme Türkiye Cumhuriyeti kanunlarına tabidir. Sözleşme&apos;den doğan veya Sözleşme ile bağlantılı her türlü uyuşmazlıkta <strong>İstanbul Mahkemeleri ve İcra Daireleri</strong> yetkilidir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">11. Değişiklikler</h2>
                <p>
                  Şirket, işbu Sözleşme&apos;yi herhangi bir zamanda güncelleme hakkını saklı tutar. Önemli değişiklikler Platform üzerinden veya e-posta yoluyla bildirilecektir. Güncelleme sonrasında Platform&apos;u kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">12. İletişim</h2>
                <p>Sözleşme ile ilgili sorularınız için:</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-2">
                  <p className="font-semibold text-gray-900 mb-1">Loopcode Bilişim Yazılım Mühendislik Eğitim ve Danışmanlık A.Ş.</p>
                  <p>Yavuz Sultan Selim, Dr. Sadık Ahmet Cd. No:24 D:1, 34083 Fatih/İstanbul</p>
                  <p>E-posta: <a href="mailto:info@ustalama.com" className="text-blue-600 hover:underline">info@ustalama.com</a></p>
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
