/* ==========================================================
   HATIRALAR (İÇERİK)
   Şu anki kayıtlar ÖRNEKTİR. Instagram yedeğiniz (ZIP) geldiğinde
   bu dosya "araclar/instagram-aktar.js" ile otomatik yeniden oluşturulur.

   Elle hatıra eklemek için en üste şu kalıpta bir kayıt ekleyin:
   {
     id: "kisa-ad",                     // benzersiz, Türkçe karaktersiz kısa ad
     tarih: "2026-11-08",               // YYYY-AA-GG
     tur: "foto",                       // "foto", "albüm" veya "reels"
     gorseller: ["medya/2026-11/foto1.jpg", "medya/2026-11/foto2.jpg"],
     instagram: "https://www.instagram.com/p/XXXXXXX/",  // gönderinin Instagram bağlantısı
     metin: `İlk satır başlık olur.

   Sonraki paragraflar yazının devamıdır. #etiket #nostalji`
   },
   ========================================================== */
window.ICERIK = [
  {
    id: "bizim-mahalle",
    tarih: "2026-11-03",
    tur: "albüm",
    gorseller: [{ sahne: "mahalle" }, { sahne: "bakkal" }, { sahne: "araba" }, { sahne: "telefon" }],
    instagram: "",
    metin: `Bizim Mahalle 🏘️

Kapı önünde oturan teyzeler, ip atlayan kızlar, top peşinde koşan oğlanlar… Akşam ezanı okununca sokak bir anda boşalır, her pencereden bir çorba kokusu yükselirdi.

Bakkal amcanın tezgâhında veresiye defteri, kapı önlerinde sohbet eden komşular, iplere dizilmiş çamaşırlar… Hepsi o sokaklarda kaldı.

Sizin mahallenizde en çok neyi özlüyorsunuz? 👇

#nostalji #mahalle #70ler #geldigectihatiralar`
  },
  {
    id: "karakoy-vapuru",
    tarih: "2026-11-01",
    tur: "reels",
    gorseller: [{ sahne: "vapur" }],
    instagram: "",
    metin: `Karaköy–Kadıköy vapuru 🕊️

Simit, çay ve martılar… Vapurun düdüğünü duyunca bütün iskele hareketlenirdi. Simidin yarısı bize, yarısı martılara.

Bu sesi hatırlayan var mı?

#eskiistanbul #vapur #karaköy #kadıköy #nostalji`
  },
  {
    id: "veresiye-defteri",
    tarih: "2026-10-31",
    tur: "foto",
    gorseller: [{ sahne: "bakkal" }],
    instagram: "",
    metin: `Bakkal Amcanın Veresiye Defteri 📒

“Babam akşam gelince öder” demek yeterdi. Tezgâhın üstünde, köşeleri kıvrılmış kalın bir defter dururdu; her sayfada bir ailenin adı, altında kurşun kalemle yazılmış rakamlar…

Ay sonunda babalar gelir, hesap kapanır, sayfanın üstüne bir çizgi çekilirdi. Kimse senet istemez, kimse imza atmazdı. Güven, defterin kendisiydi.

#bakkal #veresiye #mahalle #nostalji`
  },
  {
    id: "yayin-kapanisi",
    tarih: "2026-10-29",
    tur: "reels",
    gorseller: [{ sahne: "televizyon" }],
    instagram: "",
    metin: `Yayın kapanışı 📺

Gece yayın biterken ekranda bayrak dalgalanır, İstiklal Marşı çalardı. Sonra o tanıdık hışırtı ve karıncalı ekran… Ev sessizleşir, herkes yatmaya giderdi.

Bir günün bittiğini televizyon söylerdi.

#trt #televizyon #tekkanal #70ler`
  },
  {
    id: "jeton-bitmeden",
    tarih: "2026-10-28",
    tur: "albüm",
    gorseller: [{ sahne: "telefon" }, { sahne: "tramvay" }, { sahne: "mahalle" }],
    instagram: "",
    metin: `Jeton Bitmeden ☎️

Evde telefon olmayan yıllarda haber vermek için en yakın kulübeye gidilirdi. Cepte jetonlar şıkırdar, kulübenin önünde sıra beklenirdi.

Karşı taraf açar açmaz konuşmaya başlanırdı; çünkü her an “tık” diye jetonun düştüğünü ve hattın kesileceğini biliyorduk. Numaraları bir deftere değil, hafızamıza yazardık.

Siz en son kimi aramıştınız?

#jeton #telefon #80ler #nostalji`
  },
  {
    id: "televizyonun-ustundeki-dantel",
    tarih: "2026-10-24",
    tur: "foto",
    gorseller: [{ sahne: "televizyon" }],
    instagram: "",
    metin: `Televizyonun Üstündeki Dantel 🧶

Hemen her evde aynı manzara vardı: tüplü televizyonun üstüne serilmiş, annemizin ya da anneannemizin elleriyle ördüğü beyaz bir dantel. Üstünde bazen cam bir balık, bazen porselen bir biblo…

Misafir odası özenle hazırlanır, kapısı çoğu zaman kapalı tutulurdu. Sizin evinizde de var mıydı?

#dantel #televizyon #misafirodası #80ler`
  },
  {
    id: "kursun-kalemle-kaset",
    tarih: "2026-10-22",
    tur: "reels",
    gorseller: [{ sahne: "kaset" }],
    instagram: "",
    metin: `Kurşun kalemle kaset sarmayan kaldı mı? ✏️📼

Kaset bant attığında kalem yuvaya takılır, sabırla çevrilirdi. Kapağına kendi el yazımızla şarkı listesi yazılırdı. Bir kaseti hediye etmek, aslında birine kalbini dinletmekti.

#kaset #walkman #90lar #müzik`
  },
  {
    id: "haydarpasa-onlerinde",
    tarih: "2026-10-20",
    tur: "albüm",
    gorseller: [{ sahne: "vapur" }, { sahne: "tramvay" }],
    instagram: "",
    metin: `Haydarpaşa Önlerinde Bir Sabah 🌅

Eski İstanbul’dan bir sabah. Vapurun dumanı ağır ağır göğe yükselirken iskelede simitçinin sesi yankılanır, martılar daha vapur kalkmadan etrafı sarardı.

Yolcuların kimi gazetesini açar, kimi çayını yudumlar, kimi de sadece denizi seyrederdi.

#haydarpaşa #eskiistanbul #vapur #boğaz`
  },
  {
    id: "once-play-sonra-rec",
    tarih: "2026-10-16",
    tur: "foto",
    gorseller: [{ sahne: "kaset" }],
    instagram: "",
    metin: `Önce Play, Sonra Rec 🎶

Radyodan şarkı kaydetmek ayrı bir sanattı. Parmak düğmenin üstünde bekler, şarkının ilk notasında basardık. Ama çoğu zaman şarkının son saniyesinde spiker araya girerdi.

O kasetlerde şarkılar hep yarım biterdi ama yine de en sevdiğimiz onlar olurdu.

#kaset #radyodan #müzik #90lar`
  },
  {
    id: "babamin-ilk-arabasi",
    tarih: "2026-10-14",
    tur: "reels",
    gorseller: [{ sahne: "araba" }],
    instagram: "",
    metin: `Babamın ilk arabası 🚗

Pazar sabahları kapının önünde hortum, kova ve sabun köpüğü… Bütün mahalle arabasını yıkar, radyodan eski bir şarkı yükselirdi.

Sizin evin ilk arabası neydi? Murat mı, Anadol mu?

#klasikaraba #murat124 #anadol #nostalji`
  },
  {
    id: "beyoglunda-bir-pazar",
    tarih: "2026-10-08",
    tur: "albüm",
    gorseller: [{ sahne: "tramvay" }, { sahne: "vapur" }, { sahne: "araba" }],
    instagram: "",
    metin: `Beyoğlu’nda Bir Pazar 🚋

Kalabalık caddede ağır ağır ilerleyen tramvay, vitrinlere bakan insanlar, köşede kestane kebap kokusu… Çanın sesi duyulunca herkes kenara çekilirdi.

#beyoğlu #tramvay #eskiistanbul #istiklal`
  },
  {
    id: "gazoz-kapaklari",
    tarih: "2026-10-04",
    tur: "foto",
    gorseller: [{ sahne: "bakkal" }],
    instagram: "",
    metin: `Gazoz Kapakları 🪙

Yere düşmüş bir gazoz kapağı, bir çocuk için madeni para kadar değerliydi. Akşam olunca bütün kapaklar yere dökülür, tek tek sayılırdı.

Kimin elinde daha nadir bir kapak varsa o günün en zengini oydu. Paranın değil, paylaşmanın ve takasın öğrenildiği ilk pazar yeri belki de o kapak yığınlarıydı.

#gazozkapağı #çocukluk #oyun #60lar`
  }
];
