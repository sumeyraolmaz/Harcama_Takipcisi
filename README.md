# 💖 Expense Tracker App & Gelişmiş Harcama Takip Sistemi 📊

Expense Tracker App, bireysel finans yönetimini ve bütçe planlamasını pembe estetikle (Glassmorphism) buluşturan, **4 aylık yoğun bir mühendislik ve sprint sürecinin** ürünü olan kapsamlı bir Full Stack web uygulamasıdır. 

Kullanıcıların nakit, banka ve kredi kartı varlıklarını ayrı ayrı simüle edebildiği, yapay zekâ destekli ses tanıma teknolojisiyle saniyeler içinde harcama girişi yapabildiği, bütçe sınırlarını anlık grafiklerle izleyip kurumsal raporlar üretebildiği modüler bir finansal yönetim platformudur.

## 🔗 Canlı Önizleme & Kaynak Kodları

- **Canlı Uygulama (Vercel):** [harcama-takipcisi.vercel.app](https://harcama-takipcisi.vercel.app) 🌐
- **GitHub Deposu:** [github.com/sumeyraolmaz/Harcama_Takipcisii](https://github.com/sumeyraolmaz/Harcama_Takipcisii) 💻

---

## 🚀 Öne Çıkan Dehşet Özellikler (Key Features)

### 💳 1. Çoklu Cüzdan & Sanal Kart Mimarisi (Multi-Wallet Architecture)
- Parayı tek bir havuzda toplamak yerine gerçek hayata uyumlu **Nakit Cüzdan**, **Banka Hesabı (Ziraat)** ve **Kredi Kartı (Bonus)** hesaplarını ayrı ayrı simüle eder.
- Harcama veya gelir eklenirken seçilen cüzdanın kullanılabilir bakiyesi asenkron durum motoru tarafından anlık olarak güncellenir.

### 🎙️ 2. Yapay Zekâ Destekli Sesli Komut (Web Speech API)
- Giriş formunu manuel doldurma zorunluluğunu ortadan kaldıran, native tarayıcı ses motorlarıyla tam uyumlu asistan modülü.
- **"🎙️ Sesli Ekle"** butonuna basıp *"Market 250"* veya *"Kahve 80"* dediğinizde algoritma kelimeleri otomatik ayıklar, formu milisaniyeler içinde doldurarak ekrana fırlatır.

### 🤖 3. Akıllı Pembe Asistan (Rule-Based AI Engine)
- Arka planda bütçenizi anlık analiz eden kural tabanlı bir finansal danışman köşesi.
- Net bakiyeniz eksiye düştüğünde, bütçe sınırlarına yaklaştığınızda kullanıcıyı esprili ve yönlendirici bir dille uyarır, durum pürüzsüzse tasarruf motivasyon mesajları üretir.

### 🐖 4. Akıllı Kumbara & Tasarruf Hedefleri (Savings Goals)
- Kullanıcıya tasarruf psikolojisini aşılayan hedef takip paneli. 
- Belirlenen birikim hedefine (Örn: *Yeni Yazılım Bilgisayarı*) net bakiyenizin yüzde kaç yaklaştığını dinamik, pembe bir ilerleme çubuğuyla (`progress bar`) canlı olarak hesaplar.

### ⏰ 5. Sabit Giderler & Abonelik Sayacı
- Netflix, Spotify, YouTube Premium gibi düzenli ödenen periyodik giderlerin faturasına kaç gün kaldığını hesaplayan akıllı sayaç. Son 3 gün kaldığında kullanıcıyı görsel olarak kırmızı renkle uyarır.

### 💵 6. Tek Tıkla Çoklu Para Birimi (Multi-Currency System)
- Sağ üstte bulunan özel para birimi dönüştürücüsü sayesinde tek tıkla uygulamadaki tüm bakiyeler, kart limitleri, harcama dökümleri ve kumbara hedefleri anlık olarak **Türk Lirası (₺)** ile **Amerikan Doları ($)** arasında dönüştürülür.

### 📊 7. Kurumsal Veri Analitiği & Raporlama (Data Portability)
- **Renk Geçişli Alan Grafiği (AreaChart):** Günlük harcama trendinizi altı pembe parlayan modern bir akışla görselleştirir.
- **Kategori Pasta Grafiği (PieChart):** Hangi kategoriye yüzde kaç bütçe harcandığını dilimler halinde sunar.
- **Excel (CSV) Olarak Aktar:** Dışarıdan hiçbir harici paket yüklemeden, **Saf JS (Blob API)** kullanarak tüm listeyi Türkçe karakter uyumlu Excel formatında bilgisayara indirir.
- **PDF Raporu Al:** Sayfadaki butonları ve gereksiz formları gizleyen `Print CSS` yapısı sayesinde resmi finansal döküm raporunu PDF olarak yazdırır.

---

## 🛠️ Teknolojik Altyapı (Tech Stack)

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | React JS (ES6+) | Bileşen tabanlı, performanslı SPA (Single Page Application) yapısı. |
| **State Management** | React Hooks | `useState`, `useEffect` ve `useCallback` ile tutarlı asenkron veri akışı. |
| **Veri İletişimi** | Fetch API | C# .NET REST API backend katmanı ile veri senkronizasyonu. |
| **Grafik & Analitik** | Recharts | Özelleştirilmiş AreaChart, PieChart ve Cell render modülleri. |
| **Tasarım / UI** | CSS3 & Variables | Premium **Glassmorphism (Buzlu Cam Effect)**, Neon Glow ve Fluid Animation. |
| **Tema Motoru** | DOM Theme Dataset | Aydınlık / Karanlık Mod (Dark & Light Mode) geçiş kontrol mekanizması. |
| **Ses Algılama** | Web Speech API | Tarayıcı entegreli asenkron ses tanıma ve string parsing. |

---

## 📂 Proje Dizin Yapısı (Project Structure)

```text
Harcama_Takipcisi/
├── public/
│   ├── index.html          # Ana HTML5 şablonu
│   └── ...
├── src/
│   ├── App.js              # Çoklu modül, cüzdan ve analiz mantığını içeren ana bileşen
│   ├── index.js            # React DOM render giriş noktası
│   ├── App.css             # Glassmorphism, karanlık mod ve responsive CSS mimarisi
│   └── index.css           # Global reset ve temel font tanımlamaları
├── package.json            # Proje bağımlılıkları ve npm scriptleri
└── README.md               # Proje tanıtım ve dokümantasyon dosyası