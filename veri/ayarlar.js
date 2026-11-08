/* ==========================================================
   SİTE AYARLARI
   Siteyle ilgili değiştirmek isteyebileceğiniz her şey burada.
   ========================================================== */
window.AYARLAR = {
  siteAdi: "Geldi Geçti Hatıralar",
  slogan: "Unutulmaya yüz tutmuş günlerin izinde",

  // Instagram kullanıcı adı (başında @ olmadan)
  instagram: "geldigecti_hatiralar",

  // Ziyaretçilerin hatıra gönderebileceği e-posta adresi.
  // Boş bırakılırsa "Hatıranı Gönder" düğmesi Instagram mesajlarını açar.
  eposta: "",

  // Ana sayfadaki "Hakkımızda" yazısı
  hakkimizda: [
    "Geldi Geçti Hatıralar; mahalle aralarında kalan çocukluğumuzu, siyah-beyaz fotoğrafları, bakkal defterlerini ve tek kanallı televizyon akşamlarını bir araya getiren bir hatıra defteri.",
    "Instagram’da başlayan bu yolculukta paylaştığımız her fotoğraf ve her yazı burada da yaşıyor. Amacımız bu anları kaydetmek, yeni kuşaklara aktarmak ve “Ben de hatırlıyorum!” diyenleri bir araya getirmek."
  ],

  /* KATEGORİLER
     Her hatıra, yazısında geçen kelimelere göre otomatik olarak bir kategoriye yerleşir.
     İsterseniz bir hatıraya elle de kategori verebilirsiniz (icerik.js içinde kategori: "mahalle").
     renk: kategori etiketinin rengi · kelimeler: otomatik eşleştirme için aranan kelimeler */
  kategoriler: [
    { id: "istanbul", ad: "Eski İstanbul",  emoji: "🌉", renk: "#1c7ed6", kelimeler: ["istanbul", "vapur", "boğaz", "karaköy", "kadıköy", "beyoğlu", "tramvay", "haydarpaşa", "galata", "eminönü", "üsküdar", "martı"] },
    { id: "mahalle",  ad: "Mahalle Hayatı", emoji: "🏘️", renk: "#f08c00", kelimeler: ["mahalle", "bakkal", "sokak", "komşu", "kapı önü", "veresiye", "eskici", "simitçi", "teyze"] },
    { id: "ev",       ad: "Ev Hâlleri",     emoji: "🛋️", renk: "#e03131", kelimeler: ["televizyon", "dantel", "soba", "misafir", "telefon", "jeton", "radyo", "trt", "biblo", "anneanne"] },
    { id: "muzik",    ad: "Müzik & Kaset",  emoji: "📼", renk: "#7048e8", kelimeler: ["kaset", "plak", "şarkı", "walkman", "pikap", "45'lik", "müzik", "radyodan"] },
    { id: "araba",    ad: "Klasik Arabalar",emoji: "🚗", renk: "#0ca678", kelimeler: ["araba", "murat", "anadol", "dolmuş", "otomobil", "şahin", "doğan", "taksi"] },
    { id: "okul",     ad: "Okul Yılları",   emoji: "🎒", renk: "#f59f00", kelimeler: ["okul", "önlük", "öğretmen", "karne", "teneffüs", "beslenme", "sınıf", "kar tatili"] },
    { id: "bayram",   ad: "Bayram & Gelenek",emoji: "🍬", renk: "#d6336c", kelimeler: ["bayram", "harçlık", "el öpme", "şeker", "ramazan", "davulcu", "kolonya", "düğün"] },
    { id: "cocukluk", ad: "Çocukluk",       emoji: "🪀", renk: "#1098ad", kelimeler: ["misket", "oyun", "saklambaç", "gazoz kapağı", "çocukluk", "uçurtma", "bisiklet", "top"] }
  ],
  // Hiçbir kategoriye uymayan hatıralar için
  varsayilanKategori: { id: "genel", ad: "Hatıralar", emoji: "🕰️", renk: "#5c5f66" }
};
