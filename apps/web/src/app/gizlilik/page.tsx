import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gizlilik Politikasi</h1>
            <p className="text-sm text-gray-500 mb-8">Son guncelleme: 27 Mart 2026</p>

            <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

              <section>
                <h2 className="text-xl font-bold text-gray-900 mt-0">1. Giris</h2>
                <p>
                  <strong>Loopcode Bilisim Yazilim Muhendislik Egitim ve Danismanlik A.S.</strong> (&quot;Sirket&quot;, &quot;Biz&quot;) olarak, <strong>ustalama.com</strong> (&quot;Platform&quot;) kullanicilarinin kisisel verilerinin korunmasina buyuk onem veriyoruz.
                </p>
                <p>
                  Isbu Gizlilik Politikasi, 6698 sayili Kisisel Verilerin Korunmasi Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat cercevesinde, kisisel verilerinizin nasil toplandigi, islendigi, saklandigi ve korunduğu hakkinda sizi bilgilendirmek amaciyla hazirlanmistir.
                </p>
                <p><strong>Veri Sorumlusu:</strong> Loopcode Bilisim Yazilim Muhendislik Egitim ve Danismanlik A.S.</p>
                <p><strong>Adres:</strong> Yavuz Sultan Selim, Dr. Sadik Ahmet Cd. No:24 D:1, 34083 Fatih/Istanbul</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">2. Toplanan Kisisel Veriler</h2>
                <h3 className="text-lg font-semibold text-gray-800">2.1 Dogrudan Sizden Aldigimiz Veriler</h3>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Veri Kategorisi</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Ornekler</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Kimlik Bilgileri</td>
                      <td className="py-2">Ad, soyad</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Iletisim Bilgileri</td>
                      <td className="py-2">E-posta adresi, telefon numarasi</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Hesap Bilgileri</td>
                      <td className="py-2">Kullanici adi, sifre (sifrelenmis), profil fotografi</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Finansal Bilgiler</td>
                      <td className="py-2">Odeme karti bilgileri (son 4 hane, kart markasi; tam kart bilgileri iyzico tarafindan islenir)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Hizmet Bilgileri</td>
                      <td className="py-2">Hizmet talepleri, teklifler, degerlendirmeler, mesajlar</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-lg font-semibold text-gray-800">2.2 Otomatik Olarak Toplanan Veriler</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP adresi, tarayici turu ve surumu,</li>
                  <li>Cihaz bilgileri (isletim sistemi, ekran cozunurlugu),</li>
                  <li>Platform kullanim istatistikleri (sayfa goruntulenmeleri, tiklamalar),</li>
                  <li>Cerez verileri (detaylar icin Bolum 7&apos;ye bakiniz).</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">3. Verilerin Islenme Amaclari</h2>
                <p>Kisisel verileriniz asagidaki amaclarla islenmektedir:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Hesap olusturma ve kimlik dogrulama islemleri,</li>
                  <li>Hizmet taleplerinin ve tekliflerin yonetimi,</li>
                  <li>Odeme islemlerinin gerceklestirilmesi ve guvenliginin saglanmasi,</li>
                  <li>Kullanicilar arasi mesajlasma hizmetinin sunulmasi,</li>
                  <li>Platform&apos;un iyilestirilmesi ve yeni ozelliklerin gelistirilmesi,</li>
                  <li>Yasal yukumluluklerin yerine getirilmesi,</li>
                  <li>Dolandiricilik ve guvenlik ihlallerinin onlenmesi,</li>
                  <li>Musteriye destek saglanmasi,</li>
                  <li>Bilgilendirme ve islem e-postalarinin gonderilmesi.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">4. Verilerin Islenmesinin Hukuki Dayanaklari</h2>
                <p>KVKK madde 5 ve 6 kapsaminda kisisel verileriniz asagidaki hukuki dayanaklarla islenmektedir:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Sozlesmenin ifasi:</strong> Platform hizmetlerinin sunulmasi icin zorunlu veri islemeleri,</li>
                  <li><strong>Meskru menfaat:</strong> Platform guvenligi, hizmet kalitesinin arttirilmasi,</li>
                  <li><strong>Yasal yukumluluk:</strong> Vergi, muhasebe ve diger yasal gerekliliklerin yerine getirilmesi,</li>
                  <li><strong>Acik riza:</strong> Pazarlama iletisimleri ve tercihe bagli veri islemeleri.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">5. Verilerin Paylasilmasi</h2>
                <p>Kisisel verileriniz asagidaki durumlar disinda ucuncu taraflarla paylasilmaz:</p>
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 pr-4 font-semibold text-gray-900">Paylasilan Taraf</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Amac</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">iyzico (Odeme Saglayici)</td>
                      <td className="py-2">Odeme islemlerinin gerceklestirilmesi, 3D Secure dogrulama</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Mailgun (E-posta Saglayici)</td>
                      <td className="py-2">Islem ve bilgilendirme e-postalarinin gonderilmesi</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Diger Kullanicilar</td>
                      <td className="py-2">Profil bilgileri, degerlendirmeler (siz yayinladiginiz olcude)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2 pr-4 font-medium">Yasal Otoriteler</td>
                      <td className="py-2">Yasal zorunluluk halinde mahkeme karari veya resmi talep uzerine</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">6. Verilerin Saklanmasi ve Guvenligi</h2>
                <h3 className="text-lg font-semibold text-gray-800">6.1 Saklama Suresi</h3>
                <p>Kisisel verileriniz, islenme amacinin gerektirdigi sure boyunca ve yasal zorunluluklarin ongordugu asgari sureler dahilinde saklanir. Hesabinizi sildiginizde kisisel verileriniz makul bir sure icinde anonim hale getirilir veya silinir.</p>
                <h3 className="text-lg font-semibold text-gray-800">6.2 Guvenlik Onlemleri</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tum veri iletisimi SSL/TLS sifreleme ile korunmaktadir,</li>
                  <li>Sifreler bcrypt algoritmasiyla tek yonlu sifrelenmektedir,</li>
                  <li>Odeme bilgileri PCI DSS uyumlu iyzico altyapisinda islenmektedir,</li>
                  <li>Sunucularimiz guvenlik duvari ve erisim kontrol mekanizmalariyla korunmaktadir,</li>
                  <li>Duzeni guvenlik denetimleri ve guncellemeler uygulanmaktadir.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">7. Cerezler (Cookies)</h2>
                <p>Platform, islevsellik ve kullanici deneyimini iyilestirmek icin cerezler kullanmaktadir:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Zorunlu Cerezler:</strong> Oturum yonetimi ve guvenlik icin gerekli cerezler,</li>
                  <li><strong>Islevsel Cerezler:</strong> Dil tercihi, tema gibi kullanici ayarlarini hatirlamak icin,</li>
                  <li><strong>Analitik Cerezler:</strong> Platform kullanim istatistiklerini toplamak icin.</li>
                </ul>
                <p>Tarayici ayarlarindan cerezleri yonetebilir veya devre disi birakabilirsiniz. Ancak bazi cerezlerin devre disi birakilmasi Platform islevselligini etkileyebilir.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">8. Kullanici Haklari (KVKK Madde 11)</h2>
                <p>KVKK kapsaminda asagidaki haklara sahipsiniz:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Kisisel verilerinizin islenip islenmedigini ogrenme,</li>
                  <li>Kisisel verileriniz islenmisse buna iliskin bilgi talep etme,</li>
                  <li>Kisisel verilerinizin islenme amacini ve bunlarin amacina uygun kullanilip kullanilmadiguini ogrenme,</li>
                  <li>Yurt icinde veya yurt disinda kisisel verilerinizin aktarildigi ucuncu kisileri bilme,</li>
                  <li>Kisisel verilerinizin eksik veya yanlis islenmis olmasi halinde bunlarin duzeltilmesini isteme,</li>
                  <li>KVKK&apos;nin 7. maddesinde ongourulen sartlar cercevesinde kisisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
                  <li>Kisisel verilerinizin munhasiran otomatik sistemler vasitasiyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya cikmasina itiraz etme,</li>
                  <li>Kisisel verilerinizin kanuna aykiri olarak islenmesi sebebiyle zarara ugramaniz halinde zararin giderilmesini talep etme.</li>
                </ul>
                <p>Bu haklarinizi kullanmak icin <a href="mailto:kvkk@ustalama.com" className="text-blue-600 hover:underline">kvkk@ustalama.com</a> adresine basvurabilirsiniz. Basvurular en gec 30 gun icinde yanitlanacaktir.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">9. Cocuklarin Gizliligi</h2>
                <p>
                  Platform 18 yas alti bireylere yonelik degildir. Bilerek 18 yas alti bireylerden kisisel veri toplamamaktayiz. Boyle bir durumun tespit edilmesi halinde ilgili veriler derhal silinecektir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">10. Uluslararasi Veri Aktarimi</h2>
                <p>
                  Hizmet kalitesini saglamak icin bazi verileriniz yurt disindaki hizmet saglayicilara (e-posta gonderim altyapisi vb.) aktarilabilir. Bu aktarimlar KVKK&apos;nin ongordugu guvencelere uygun olarak gerceklestirilir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">11. Politika Degisiklikleri</h2>
                <p>
                  Isbu Gizlilik Politikasi zaman zaman guncellenebilir. Onemli degisiklikler Platform uzerinden veya e-posta yoluyla bildirilecektir. Guncellenmis politikanin yayinlanmasindan sonra Platform&apos;u kullanmaya devam etmeniz, degisiklikleri kabul ettiginiz anlamina gelir.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900">12. Iletisim</h2>
                <p>Gizlilik ile ilgili soru, talep ve sikayet icin:</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mt-2">
                  <p className="font-semibold text-gray-900 mb-1">Loopcode Bilisim Yazilim Muhendislik Egitim ve Danismanlik A.S.</p>
                  <p>Yavuz Sultan Selim, Dr. Sadik Ahmet Cd. No:24 D:1, 34083 Fatih/Istanbul</p>
                  <p>Genel: <a href="mailto:info@ustalama.com" className="text-blue-600 hover:underline">info@ustalama.com</a></p>
                  <p>KVKK Basvurulari: <a href="mailto:kvkk@ustalama.com" className="text-blue-600 hover:underline">kvkk@ustalama.com</a></p>
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
