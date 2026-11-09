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

  // Ana sayfanın en üstündeki tanıtım videosu ve kapak resmi.
  // Instagram'daki bir Reels videosunu buraya koyabilirsiniz (ör. "medya/2026-11/reel.mp4").
  tanitimVideosu: "medya/tanitim.mp4",
  tanitimKapak: "medya/tanitim-kapak.jpg",

  // En üstteki ince duyuru şeridi (boş bırakılırsa gösterilmez)
  duyuru: "",

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
    { id: "istanbul", ad: "Eski İstanbul",   emoji: "🌉", renk: "#2f5d8a", kelimeler: ["istanbul", "vapur", "boğaz", "karaköy", "kadıköy", "beyoğlu", "tramvay", "haydarpaşa", "galata", "eminönü", "üsküdar", "martı", "köprü", "haliç", "balıkçı"] },
    { id: "mahalle",  ad: "Mahalle & Sokak", emoji: "🏘️", renk: "#b4632d", kelimeler: ["mahalle", "bakkal", "sokak", "komşu", "kapı önü", "veresiye", "eskici", "sucu", "satıcı", "teyze"] },
    { id: "ev",       ad: "Ev Hâlleri",      emoji: "🛋️", renk: "#9b3b45", kelimeler: ["televizyon", "dantel", "soba", "misafir", "telefon", "jeton", "radyo", "trt", "biblo", "anneanne", "kadran"] },
    { id: "lezzet",   ad: "Tatlar & Kokular",emoji: "🍵", renk: "#a8322d", kelimeler: ["çay", "simit", "gevrek", "fırın", "lezzet", "susam", "sofra", "tatlı", "dondurma", "yemek"] },
    { id: "araba",    ad: "Klasik Arabalar", emoji: "🚗", renk: "#3c6e5a", kelimeler: ["araba", "murat", "anadol", "dolmuş", "otomobil", "şahin", "doğan", "taksi", "yazlık"] },
    { id: "muzik",    ad: "Müzik & Kaset",   emoji: "📼", renk: "#6a4c93", kelimeler: ["kaset", "plak", "şarkı", "walkman", "pikap", "45'lik", "müzik", "radyodan"] },
    { id: "okul",     ad: "Okul Yılları",    emoji: "🎒", renk: "#c28a1e", kelimeler: ["okul", "önlük", "öğretmen", "karne", "teneffüs", "beslenme", "sınıf", "kar tatili", "eylül"] },
    { id: "cocukluk", ad: "Çocukluk",        emoji: "🪀", renk: "#2a8a8a", kelimeler: ["misket", "oyun", "saklambaç", "gazoz kapağı", "çocukluk", "uçurtma", "bisiklet", "ip atlama"] },
    { id: "bayram",   ad: "Bayram & Gelenek",emoji: "🍬", renk: "#b0457a", kelimeler: ["bayram", "harçlık", "el öpme", "şeker", "ramazan", "davulcu", "kolonya", "düğün"] }
  ],
  // Hiçbir kategoriye uymayan hatıralar için
  varsayilanKategori: { id: "genel", ad: "Hatıralar", emoji: "🕰️", renk: "#5c5f66" }
};
