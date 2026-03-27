import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kullanim Kosullari</h1>
            <p className="text-sm text-gray-500 mb-8">Son guncelleme: 27 Mart 2026</p>

            <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-bold text-gray-900 mt-0">1. Taraflar ve Tanimlar</h2>
                <p>
                  Isbu Kullanim Kosullari Sozlesmesi (&quot;Sozlesme&quot;), <strong>Loopcode Bilisim Yazilim Muhendislik Egitim ve Danismanlik A.S.</strong> (&quot;Sirket&quot;, &quot;Biz&quot;) tarafindan isletilen <strong>ustalama.com</strong> (&quot;Platform&quot;) ile Platform&apos;u kullanan gercek veya tuzel kisiler (&quot;Kullanici&quot;, &quot;Siz&quot;) arasindaki hukuki iliskiyi duzenler.
                </p>
                <p><strong>Sirket Adresi:</strong> Yavuz Sultan Selim, Dr. Sadik Ahmet Cd. No:24 D:1, 34083 Fatih/Istanbul</p>
                <p>Platform&apos;a erisim saglayarak veya hesap olusturarak isbu Sozlesme&apos;nin tum hukumlerini kabul etmis sayilirsiniz.</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Hizmet Saglayici (Usta):</strong> Platform uzerinden hizmet sunan bireysel veya kurumsal kullanicilar.</li>
                  <li><strong>Musteri:</strong> Platform uzerinden hizmet talep eden kullanicilar.</li>
                  <li><strong>Icerik:</strong> Platform&apos;da yayinlanan her turlu metin, gorsel, yorum ve diger materyaller.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">2. Platform&apos;un Amaci ve Kapsami</h2>
                <p>
                  Ustalama, hizmet saglayicilar ile musterileri bulusturan bir araclik platformudur. Platform;
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Musterilerin hizmet taleplerini yayinlamasini,</li>
                  <li>Hizmet saglayicilarin bu taleplere teklif vermesini,</li>
                  <li>Taraflarin iletisim kurmasini ve anlasmasini,</li>
                  <li>Odeme islemlerinin guvenli bir sekilde gerceklestirilmesini saglar.</li>
                </ul>
                <p>
                  Sirket, hizmet saglayicilari ile musteriler arasindaki iliskide <strong>araclik rolu</strong> ustlenmekte olup, sunulan hizmetlerin kalitesi, tamamlanmasi veya sonuclari konusunda dogrudan sorumluluk tasimamakadir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">3. Uyelik ve Hesap Kosullari</h2>
                <h3 className="text-lg font-semibold text-gray-800">3.1 Hesap Olusturma</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Platform&apos;a uye olmak icin 18 yasindan buyuk olmaniz gerekmektedir.</li>
                  <li>Kayit sirasinda verilen bilgilerin dogru, guncel ve eksiksiz olmasi zorunludur.</li>
                  <li>Her kullanicinin yalnizca bir hesabi olabilir.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">3.2 Hesap Guvenligi</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hesap bilgilerinizin guvenliginden siz sorumlusunuz.</li>
                  <li>Sifrenizi ucuncu kisilerle paylasmayiniz.</li>
                  <li>Hesabinizda yetkisiz erisim tespit ettiginizde derhal bizi bilgilendiriniz.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">3.3 Hesap Askiya Alinmasi ve Kapatilmasi</h3>
                <p>Sirket, asagidaki durumlarda hesabinizi askiya alma veya kalici olarak kapatma hakkini sakli tutar:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Sozlesme ihlali,</li>
                  <li>Sahte veya yaniltici bilgi kullanimi,</li>
                  <li>Diger kullanicilara yonelik taciz veya dolandiricilik,</li>
                  <li>Platform&apos;un isleyisini bozan davranislar.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">4. Hizmet Saglayici Yukumlulukleri</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Sundugu hizmet alaninda gerekli yetkinlik ve yetkiye sahip olmalidir.</li>
                  <li>Teklif verdigi hizmetleri belirtilen kosullarda ve suresinde tamamlamalidir.</li>
                  <li>Mesleki standartlara ve ilgili mevzuata uygun hareket etmelidir.</li>
                  <li>Musteri ile yapilan anlasmaya sadik kalmalidir.</li>
                  <li>Profil bilgilerini dogru ve guncel tutmalidir.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">5. Musteri Yukumlulukleri</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hizmet taleplerini acik, anlasilir ve dogru sekilde tanimlamalidir.</li>
                  <li>Kabul ettigi teklifin gerekliliklerini yerine getirmelidir (erişim, odeme vs.).</li>
                  <li>Hizmet saglayici ile dürüst ve sayili iletisim kurmalidir.</li>
                  <li>Tamamlanan hizmetler icin adil ve dogru degerlendirme yapmalidir.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">6. Odeme Kosullari</h2>
                <h3 className="text-lg font-semibold text-gray-800">6.1 Odeme Altyapisi</h3>
                <p>Platform&apos;daki odemeler, lisansli odeme hizmet saglayicisi <strong>iyzico</strong> altyapisi uzerinden gerceklestirilmektedir. Tum finansal islemler 3D Secure guvenligi ile korunmaktadir.</p>
                <h3 className="text-lg font-semibold text-gray-800">6.2 Bakiye Sistemi</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Kullanicilar hesaplarina bakiye yukleyebilir.</li>
                  <li>Yuklenen bakiye Platform icindeki hizmet odemeleri icin kullanilir.</li>
                  <li>Bakiye, nakde cevrilemez ve baska platformlara aktarilamaz.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">6.3 Premium Uyelik</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Premium uyelik tek seferlik odeme ile sunulmaktadir.</li>
                  <li>Premium ozellikleri: sinirsis teklif verme, oncelikli gorunurluk, premium rozeti.</li>
                  <li>Premium uyelik ucreti iade edilemez (7 gunluk cayma hakki haric).</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">6.4 Iade Politikasi</h3>
                <p>Premium uyelik satin alindiktan sonra 7 gun icinde, herhangi bir gerekce belirtmeksizin iade talebinde bulunulabilir. Iade islemleri 3-5 is gunu icinde tamamlanir.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">7. Icerik Politikasi</h2>
                <h3 className="text-lg font-semibold text-gray-800">7.1 Kullanici Icerigi</h3>
                <p>Platform&apos;a yuklediginiz iceriklerden (profil bilgileri, yorumlar, gorseller) tamamen siz sorumlusunuz. Asagidaki iceriklerin yayinlanmasi yasaktir:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Yasadisi, muzir veya hakaret iceren icerikler,</li>
                  <li>Ucuncu kisilerin fikri mulkiyet haklarini ihlal eden materyaller,</li>
                  <li>Yaniltici, sahte veya dolandiricilik amacli bilgiler,</li>
                  <li>Reklam, spam veya istenmeyen ticari iletiler.</li>
                </ul>
                <h3 className="text-lg font-semibold text-gray-800">7.2 Icerik Kaldirilmasi</h3>
                <p>Sirket, Sozlesme&apos;ye aykiri icerikleri onceden bildirimde bulunmaksizin kaldirma hakkini sakli tutar.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">8. Fikri Mulkiyet Haklari</h2>
                <p>
                  Platform&apos;un tasarimi, yazilimi, logosu, ticari markasi ve diger fikri mulkiyet unsurlari Sirket&apos;e aittir ve telif haklari ile korunmaktadir. Sirket&apos;in onceden yazili izni olmaksizin kopyalanamaz, dagtilamaz veya degistirilemez.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">9. Sorumluluk Sinirlamasi</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Platform &quot;oldugu gibi&quot; sunulmaktadir. Kesintisiz veya hatasiz calisma garantisi verilmemektedir.</li>
                  <li>Sirket, kullanicilar arasi anlasmazliklardan, hizmet kalitesinden veya hizmetten kaynaklanan zararlardan sorumlu degildir.</li>
                  <li>Sirket&apos;in toplam sorumlulugu, kullanicinin son 12 ayda Platform&apos;a odedigi toplam tutari asamaz.</li>
                  <li>Sirket, ucuncu taraf web sitelerine verilen bağlantılarin iceriginden sorumlu degildir.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">10. Uyusmazlik Cozumu</h2>
                <p>
                  Isbu Sozlesme Turkiye Cumhuriyeti kanunlarina tabidir. Sozlesme&apos;den dogan veya Sozlesme ile baglantili her turlu uyusmazlikta <strong>Istanbul Mahkemeleri ve Icra Daireleri</strong> yetkilidir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">11. Degisiklikler</h2>
                <p>
                  Sirket, isbu Sozlesme&apos;yi herhangi bir zamanda guncelleme hakkini sakli tutar. Onemli degisiklikler Platform uzerinden veya e-posta yoluyla bildirilecektir. Guncelleme sonrasinda Platform&apos;u kullanmaya devam etmeniz, yeni kosullari kabul ettiginiz anlamina gelir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">12. Iletisim</h2>
                <p>Sozlesme ile ilgili sorulariniz icin:</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-2">
                  <p className="font-semibold text-gray-900 mb-1">Loopcode Bilisim Yazilim Muhendislik Egitim ve Danismanlik A.S.</p>
                  <p>Yavuz Sultan Selim, Dr. Sadik Ahmet Cd. No:24 D:1, 34083 Fatih/Istanbul</p>
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
