/* ==========================================================
   GELDİ GEÇTİ HATIRALAR — UYGULAMA
   İçerik veri/icerik.js'ten, ayarlar veri/ayarlar.js'ten okunur.
   Sayfalar (#/ adresleri):
     #/                 Bugün: video vitrin, takvim yaprağı, kaldığın yerden,
                        bu ayın albümü, raflar, arşiv, geçen yıllarda bu ay
     #/album[/YYYY-AA]  Aylık hatıra albümü (varsayılan: en son ay)
     #/arsiv            Bütün aylık albümler
     #/kesfet           Arama ve bütün hatıralar
     #/raf/<id>         Bir kategorinin hatıraları
     #/etiket/<etiket>  Etikete göre hatıralar
     #/hatira/<id>      Okuma sayfası
     #/hakkimizda       Hakkımızda + Hatıranı Gönder
     #/kaynaklar        Örnek fotoğrafların kaynakları
   ========================================================== */
(function () {
  "use strict";

  var A = window.AYARLAR || {};
  var HAM = window.ICERIK || [];
  var KAYNAK = window.FOTO_KAYNAK || {};
  var IG = (A.instagram || "").replace(/^@/, "");
  var IG_PROFIL = IG ? "https://www.instagram.com/" + IG + "/" : "https://www.instagram.com/";
  var SITE = A.siteAdi || "Geldi Geçti Hatıralar";
  var SAYFA_BASLIGI = document.title;
  var main = document.getElementById("icerik");

  /* ---------- Yardımcılar ---------- */
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function kac(m) {
    return String(m == null ? "" : m).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function kucuk(m) { return String(m || "").toLocaleLowerCase("tr"); }
  function sade(m) { return kucuk(m).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i"); }
  function oku(k, v) { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : v; } catch (e) { return v; } }
  function yaz(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  var GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  function tarihYaz(t) {
    var p = String(t || "").split("-");
    return p.length < 3 ? (t || "") : parseInt(p[2], 10) + " " + AYLAR[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function ayYaz(anahtar) { var p = anahtar.split("-"); return AYLAR[parseInt(p[1], 10) - 1] + " " + p[0]; }

  var IKON = {
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" class="dolu"/></svg>',
    ara: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    ok: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    paylas: '<svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    album: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',
    reels: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" class="dolu"/></svg>',
    takvim: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
    dur: '<svg class="dur" viewBox="0 0 24 24"><path d="M8 5v14M16 5v14"/></svg>',
    oyna: '<svg class="oyna" viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z" class="dolu"/></svg>'
  };

  /* ---------- Kategoriler ---------- */
  var KATEGORILER = (A.kategoriler || []).slice();
  var VARSAYILAN = A.varsayilanKategori || { id: "genel", ad: "Hatıralar", emoji: "🕰️", renk: "#5c5f66" };
  function katBul(id) {
    for (var i = 0; i < KATEGORILER.length; i++) if (KATEGORILER[i].id === id) return KATEGORILER[i];
    return id === VARSAYILAN.id ? VARSAYILAN : null;
  }
  function katTahmin(metin) {
    var m = sade(metin), enIyi = null, enCok = 0;
    KATEGORILER.forEach(function (k) {
      var puan = 0;
      (k.kelimeler || []).forEach(function (w) { if (m.indexOf(sade(w)) !== -1) puan++; });
      if (puan > enCok) { enCok = puan; enIyi = k; }
    });
    return enIyi || VARSAYILAN;
  }

  /* ---------- İçeriği hazırla ---------- */
  var ETIKET_RE = /#[0-9A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû_]+/g;
  function ilkCumle(m) {
    var c = (m.split(/(?<=[.!?…])\s/)[0] || m).trim();
    return c.length > 170 ? c.slice(0, 165).replace(/\s+\S*$/, "") + "…" : c;
  }
  function hazirla(h, sira) {
    var metin = String(h.metin || "").replace(/\r/g, "").trim();
    var satirlar = metin.split("\n");
    var baslik = h.baslik || "", govde = metin, ilk = (satirlar[0] || "").trim();
    if (!baslik) {
      if (ilk && ilk.length <= 90 && satirlar.length > 1) { baslik = ilk; govde = satirlar.slice(1).join("\n").trim(); }
      else {
        var c = ilkCumle(metin.replace(ETIKET_RE, ""));
        baslik = c.length > 70 ? c.slice(0, 67).replace(/\s+\S*$/, "") + "…" : c;
      }
    }
    baslik = baslik.replace(ETIKET_RE, "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "").trim() || "Hatıra";
    var etiketler = [];
    (metin.match(ETIKET_RE) || []).forEach(function (e) { var t = kucuk(e.slice(1)); if (etiketler.indexOf(t) === -1) etiketler.push(t); });
    var paragraflar = govde.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    if (paragraflar.length && /^(#[^\s]+\s*)+$/.test(paragraflar[paragraflar.length - 1])) paragraflar.pop();
    var duz = paragraflar.join(" ").replace(ETIKET_RE, "").replace(/\s+/g, " ").trim();
    var kat = (h.kategori && katBul(h.kategori)) || katTahmin(metin + " " + etiketler.join(" "));
    var gorseller = (h.gorseller || []).map(function (g) { return typeof g === "string" ? { src: g } : g; });
    var tur = h.tur || (gorseller.length > 1 ? "albüm" : "foto");
    var tarih = h.tarih || "";
    return {
      id: String(h.id || "hatira-" + sira), sira: sira,
      tarih: tarih, tarihMetni: tarihYaz(tarih), ay: tarih.slice(0, 7),
      tur: tur, reels: tur === "reels",
      gorseller: gorseller.length ? gorseller : [{ sahne: "mahalle" }],
      instagram: h.instagram || IG_PROFIL,
      baslik: baslik, paragraflar: paragraflar,
      soz: ilkCumle((paragraflar[0] || duz).replace(ETIKET_RE, "")),
      ozet: duz.length > 200 ? duz.slice(0, 195).replace(/\s+\S*$/, "") + "…" : duz,
      etiketler: etiketler, kat: kat,
      aranan: sade(metin + " " + kat.ad)
    };
  }
  var TUM = HAM.map(hazirla).sort(function (a, b) { return (b.tarih || "").localeCompare(a.tarih || "") || a.sira - b.sira; });
  var ID = {};
  TUM.forEach(function (h) { ID[h.id] = h; });
  function katListe(id) { return TUM.filter(function (h) { return h.kat.id === id; }); }
  var DOLU_KAT = KATEGORILER.concat([VARSAYILAN]).filter(function (k) { return katListe(k.id).length > 0; })
    .sort(function (a, b) { return katListe(b.id).length - katListe(a.id).length; });

  // Aylık albümler (en yeniden eskiye); sayı numarası eskiden yeniye artar
  var AYLAR_LISTE = [];
  TUM.forEach(function (h) { if (h.ay && AYLAR_LISTE.indexOf(h.ay) === -1) AYLAR_LISTE.push(h.ay); });
  AYLAR_LISTE.sort().reverse();
  function albumNo(ay) { return AYLAR_LISTE.length - AYLAR_LISTE.indexOf(ay); }
  function albumListe(ay) { return TUM.filter(function (h) { return h.ay === ay; }); }

  /* ---------- Okunanlar (kaldığın yerden) ---------- */
  var okunan = oku("ggh-okunan", []).filter(function (id) { return ID[id]; });
  function okunduIsaretle(id) {
    okunan = [id].concat(okunan.filter(function (x) { return x !== id; })).slice(0, 200);
    yaz("ggh-okunan", okunan);
  }

  /* ---------- Parçalar ---------- */
  function gorselHTML(g, alt, hemen) {
    if (g && g.src) return '<img src="' + kac(g.src) + '" alt="' + kac(alt) + '"' + (hemen ? "" : ' loading="lazy"') + ' decoding="async">';
    return window.sahneSvg ? window.sahneSvg(g && g.sahne) : "";
  }
  function kapakGorsel(h) { return h.gorseller[0]; }
  function rozet(h) {
    if (h.reels) return '<span class="rozet">' + IKON.reels + "Reels</span>";
    if (h.gorseller.length > 1) return '<span class="rozet">' + IKON.album + h.gorseller.length + " fotoğraf</span>";
    return "";
  }
  function etiketSatiri(h) { return '<span class="etiket">' + kac(h.kat.ad) + "</span>"; }
  function yaziKart(h) {
    return '<a class="yazi-kart" href="#/hatira/' + kac(h.id) + '"><div class="foto">' + gorselHTML(kapakGorsel(h), h.baslik) + rozet(h) + "</div>" +
      etiketSatiri(h) + "<h3>" + kac(h.baslik) + '</h3><span class="yazar">' + kac(h.tarihMetni) + '</span><p class="alinti">“' + kac(h.soz) + "”</p></a>";
  }
  function oneCikan(h) {
    return '<a class="one-cikan" href="#/hatira/' + kac(h.id) + '"><div class="foto">' + gorselHTML(kapakGorsel(h), h.baslik, true) + rozet(h) +
      '<span class="alinti-ust">“' + kac(h.soz) + "”</span></div>" +
      "<div>" + etiketSatiri(h) + "<h2>" + kac(h.baslik) + '</h2><span class="yazar">' + kac(h.tarihMetni) + " · " + kac(SITE) + '</span><p class="alinti">' + kac(h.ozet) + "</p></div></a>";
  }
  function kapakHTML(ay, link) {
    var l = albumListe(ay), ilk = l[0];
    var ic = '<div class="foto">' + (ilk ? gorselHTML(kapakGorsel(ilk), "") : "") + "</div>" +
      '<span class="kapak-ust">GELDİ GEÇTİ<small>HATIRA ALBÜMÜ</small></span>' +
      '<span class="kapak-no">' + albumNo(ay) + '</span><span class="kapak-ay">Albüm ' + albumNo(ay) + "<br>" + kac(ayYaz(ay)) + "</span>";
    return link ? '<a class="kapak" href="#/album/' + ay + '" aria-label="' + kac(ayYaz(ay)) + ' albümü">' + ic + "</a>" : '<div class="kapak">' + ic + "</div>";
  }
  function bolumUst(baslik, link, linkYazi) {
    return '<div class="bolum-ust"><h2>' + baslik + "</h2>" + (link ? '<a href="' + link + '">' + linkYazi + " →</a>" : "") + "</div>";
  }

  /* ---------- Takvim yaprağı ---------- */
  var bugun = new Date();
  var yilinGunu = Math.floor((bugun - new Date(bugun.getFullYear(), 0, 0)) / 864e5);
  var sozSira = 0;
  function gecmisteBugun() {
    var ay = String(bugun.getMonth() + 1).padStart(2, "0"), gun = String(bugun.getDate()).padStart(2, "0"), yil = String(bugun.getFullYear());
    var ayniGun = TUM.filter(function (h) { return h.tarih.slice(5) === ay + "-" + gun && h.tarih.slice(0, 4) < yil; });
    if (ayniGun.length) return { baslik: "Geçmişte bugün · " + ayniGun[0].tarih.slice(0, 4), h: ayniGun[0] };
    var ayniAy = TUM.filter(function (h) { return h.tarih.slice(5, 7) === ay && h.tarih.slice(0, 4) < yil; });
    if (ayniAy.length) return { baslik: "Geçen yıllarda bu ay · " + ayniAy[0].tarih.slice(0, 4), h: ayniAy[0] };
    return null;
  }
  function yaprakIcerik() {
    if (!TUM.length) return "";
    var h = TUM[(yilinGunu + sozSira) % TUM.length];
    var g = gecmisteBugun();
    return '<div class="yaprak-ust"><span>' + AYLAR[bugun.getMonth()] + " " + bugun.getFullYear() + "</span><span>Hatıra takvimi</span></div>" +
      '<div class="yaprak-gun' + (bugun.getDay() === 0 ? " pazar" : "") + '"><b>' + bugun.getDate() + "</b><em>" + GUNLER[bugun.getDay()] + "</em></div>" +
      '<div class="soz"><span class="etiket">Günün sözü</span><blockquote>“' + kac(h.soz) + '”</blockquote><a href="#/hatira/' + kac(h.id) + '">— ' + kac(h.baslik) + " →</a></div>" +
      (g ? '<a class="gecmis" href="#/hatira/' + kac(g.h.id) + '">' + IKON.takvim + "<span><b>" + kac(g.baslik) + "</b>" + kac(g.h.baslik) + "</span></a>" : "");
  }

  /* ---------- SAYFALAR ---------- */
  function sayfaAna() {
    var video = A.tanitimVideosu, poster = A.tanitimKapak || "";
    var azHareket = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var sonAy = AYLAR_LISTE[0], buAy = sonAy ? albumListe(sonAy) : [];
    var son = okunan[0] && ID[okunan[0]];
    var devam = son || TUM[0];
    var devamAlbum = devam ? albumListe(devam.ay) : [];
    var okunanSayi = devamAlbum.filter(function (h) { return okunan.indexOf(h.id) !== -1; }).length;
    var gecen = TUM.filter(function (h) { return h.tarih.slice(5, 7) === String(bugun.getMonth() + 1).padStart(2, "0") && h.tarih.slice(0, 4) < String(bugun.getFullYear()); });
    if (!gecen.length) gecen = TUM.slice(-4).reverse();

    main.innerHTML =
      '<section class="vitrin" aria-label="Tanıtım">' +
        (video && !azHareket
          ? '<video id="vitrin-video" autoplay muted loop playsinline preload="auto"' + (poster ? ' poster="' + kac(poster) + '"' : "") + '><source src="' + kac(video) + '" type="video/mp4"></video>'
          : (poster ? '<img class="vitrin-kapak" src="' + kac(poster) + '" alt="">' : "")) +
        '<div class="vitrin-ic"><span class="gun">' + bugun.getDate() + " " + AYLAR[bugun.getMonth()] + " " + bugun.getFullYear() + ", " + GUNLER[bugun.getDay()] + "</span>" +
          "<h1>Geldi geçti, <em>hatıra kaldı.</em></h1>" +
          '<p class="alt-baslik">Vapur düdükleri, bakkal defterleri, tek kanallı akşamlar… Bir zamanların İstanbul’undan ve mahallelerinden fotoğraflar, hikâyeler.</p>' +
          '<form class="arama" role="search" id="vitrin-arama"><label class="gizli" for="vitrin-ara">Hatıralarda ara</label>' + IKON.ara +
            '<input id="vitrin-ara" type="search" placeholder="Hatıra, yer, eşya ara… (ör. vapur, bakkal)" autocomplete="off"></form>' +
          '<nav class="cipler" aria-label="Raflar">' + DOLU_KAT.map(function (k) { return '<a class="cip" href="#/raf/' + kac(k.id) + '">' + kac(k.ad) + "</a>"; }).join("") + "</nav>" +
        "</div>" +
        (video && !azHareket ? '<button class="video-dugme" id="video-dugme" type="button" aria-label="Videoyu durdur" aria-pressed="false">' + IKON.dur + IKON.oyna + "</button>" : "") +
      "</section>" +

      '<section class="bolum"><div class="kap">' + bolumUst("Bugün Geldi Geçti’de", "#/arsiv", "Arşiv") +
        '<div class="bugun"><div class="takvim"><div class="yaprak" id="yaprak">' + yaprakIcerik() + "</div></div>" +
        '<div class="sag-sutun">' +
          (devam ? '<div><span class="etiket">' + (son ? "Kaldığın yerden" : "Okumaya buradan başlayın") + "</span>" +
            '<a class="devam-kart" href="#/hatira/' + kac(devam.id) + '" style="margin-top:10px"><div class="foto">' + gorselHTML(kapakGorsel(devam), devam.baslik) + "</div>" +
            "<div>" + etiketSatiri(devam) + "<h3>" + kac(devam.baslik) + "</h3><p>" + kac(ayYaz(devam.ay)) + " albümü</p>" +
            '<div class="ilerleme">' + devamAlbum.map(function (h) { return "<i" + (okunan.indexOf(h.id) !== -1 ? ' class="dolu"' : "") + "></i>"; }).join("") + "</div>" +
            '<div class="ilerleme-yazi"><span>' + okunanSayi + " / " + devamAlbum.length + " hatıra okundu</span><span>" + (okunanSayi === devamAlbum.length ? "Tamamı okundu" : "Devam et →") + "</span></div></div></a></div>" : "") +
          (sonAy ? '<div class="album-kapak">' + kapakHTML(sonAy, true) +
            '<div><span class="etiket">Bu ayın albümü</span><h2>' + kac(ayYaz(sonAy)) + "</h2><p>" + buAy.length + " hatıra · " + buAy.reduce(function (t, h) { return t + h.gorseller.length; }, 0) + " fotoğraf</p>" +
            '<a class="btn btn-koyu" href="#/album/' + sonAy + '">Albümü aç</a></div></div>' : "") +
        "</div></div>" +
      "</div></section>" +

      (buAy.length ? '<section class="bolum" style="padding-top:0"><div class="kap">' + bolumUst(kac(ayYaz(sonAy)) + " albümünden", "#/album/" + sonAy, "Albümün tamamı") +
        oneCikan(buAy[0]) +
        '<div class="yazi-izgara' + (buAy.slice(1, 5).length % 3 === 0 ? " uclu" : "") + '">' + buAy.slice(1, 5).map(yaziKart).join("") + "</div>" +
        (buAy.length > 5 ? '<a class="tumu-link" href="#/album/' + sonAy + '">Albümün tamamı ' + IKON.ok + "</a>" : "") +
      "</div></section>" : "") +

      '<section class="bolum" style="padding-top:0"><div class="kap">' + bolumUst("Hatıra rafları", "#/kesfet", "Hepsini keşfet") +
        '<div class="raflar">' + DOLU_KAT.map(function (k) {
          var l = katListe(k.id);
          return '<a class="raf" href="#/raf/' + kac(k.id) + '"><div class="foto">' + gorselHTML(kapakGorsel(l[0]), k.ad) + '</div><span class="yazi"><small>' + l.length + " hatıra</small><b>" + kac(k.ad) + "</b></span></a>";
        }).join("") + "</div>" +
      "</div></section>" +

      (AYLAR_LISTE.length > 1 ? '<section class="bolum" style="padding-top:0"><div class="kap">' + bolumUst("Hatıra arşivi", "#/arsiv", "Bütün albümler") +
        '<div class="arsiv-sira">' + AYLAR_LISTE.slice(1).map(function (ay) { return '<div class="arsiv-oge">' + kapakHTML(ay, true) + '<span class="alt-yazi">' + albumListe(ay).length + " hatıra</span></div>"; }).join("") + "</div>" +
      "</div></section>" : "") +

      (gecen.length ? '<section class="bolum" style="padding-top:0"><div class="kap">' + bolumUst("Geçen yıllarda bu ay") +
        '<div class="gecen-yil">' + gecen.slice(0, 4).map(function (h) {
          return '<a class="gecen-kart" href="#/hatira/' + kac(h.id) + '"><span class="etiket">' + kac(h.kat.ad) + " · " + h.tarih.slice(0, 4) + "</span><h3>" + kac(h.baslik) + '</h3><span class="yazar">' + kac(h.tarihMetni) + "</span></a>";
        }).join("") + "</div>" +
      "</div></section>" : "") +

      '<section class="bolum" style="padding-top:0"><div class="kap"><div class="mektup">' +
        '<div><span class="etiket">Hatıra defteri</span><h3>Sizin de bir hatıranız var mı?</h3><p>Eski bir fotoğraf, bir anı, bir hikâye… Gönderin; seçilenleri sitemizde ve Instagram sayfamızda yayımlayalım.</p><a class="btn btn-cay" href="#/hakkimizda">Hatıranı gönder</a></div>' +
        '<div class="zarf"><span class="etiket">Her yeni hatıra</span><h3>Önce Instagram’da paylaşılır.</h3><p>Yeni fotoğraf ve hikâyeleri kaçırmamak için bizi takip edin, yorumlarda kendi hatıranızı yazın.</p><a class="btn btn-ig" href="' + IG_PROFIL + '" target="_blank" rel="noopener">' + IKON.ig + "@" + kac(IG) + "</a></div>" +
      "</div></div></section>";

    var v = $("#vitrin-video"), vd = $("#video-dugme");
    if (v && vd) {
      vd.addEventListener("click", function () {
        if (v.paused) { v.play(); vd.setAttribute("aria-pressed", "false"); vd.setAttribute("aria-label", "Videoyu durdur"); }
        else { v.pause(); vd.setAttribute("aria-pressed", "true"); vd.setAttribute("aria-label", "Videoyu oynat"); }
      });
      var p = v.play && v.play();
      if (p && p.catch) p.catch(function () {});
    }
    $("#vitrin-arama").addEventListener("submit", function (e) {
      e.preventDefault();
      aramaMetni = $("#vitrin-ara").value;
      location.hash = "#/kesfet";
    });
    var yk = $("#yaprak");
    if (yk) yk.insertAdjacentHTML("beforeend", '<div class="yaprak-eylem"><button class="btn btn-koyu" type="button" id="kopar">Yaprağı kopar</button><button class="btn btn-cizgi" type="button" id="yaprak-paylas" aria-label="Paylaş">' + IKON.paylas + "</button></div>");
    var kopar = $("#kopar");
    if (kopar) kopar.addEventListener("click", function () {
      yk.classList.add("kopuyor");
      setTimeout(function () {
        sozSira++;
        var eylem = $(".yaprak-eylem", yk);
        yk.innerHTML = yaprakIcerik();
        yk.appendChild(eylem);
        yk.classList.remove("kopuyor");
      }, 520);
    });
    var yp = $("#yaprak-paylas");
    if (yp) yp.addEventListener("click", function () { paylas(TUM[(yilinGunu + sozSira) % TUM.length]); });
  }

  function izgaraHTML(l) {
    return l.length ? '<div class="yazi-izgara uclu liste">' + l.map(yaziKart).join("") + "</div>" : '<div class="bos"><b>Burada henüz hatıra yok</b>Başka bir rafa göz atabilirsiniz.</div>';
  }

  function sayfaAlbum(ay) {
    ay = ay || AYLAR_LISTE[0];
    if (!ay || AYLAR_LISTE.indexOf(ay) === -1) return sayfaBulunamadi();
    var l = albumListe(ay), i = AYLAR_LISTE.indexOf(ay), yeni = AYLAR_LISTE[i - 1], eski = AYLAR_LISTE[i + 1];
    main.innerHTML = '<div class="kap"><header class="album-bas">' + kapakHTML(ay, false) +
      '<div><span class="etiket">Albüm ' + albumNo(ay) + "</span><h1>" + kac(ayYaz(ay)) + "</h1><p>" + l.length + " hatıra, " + l.reduce(function (t, h) { return t + h.gorseller.length; }, 0) + " fotoğraf.</p>" +
      '<p style="margin-top:14px;font-style:normal;font-family:var(--f-arac);font-size:14px">' + (eski ? '<a href="#/album/' + eski + '">← ' + kac(ayYaz(eski)) + "</a>" : "") + (yeni ? (eski ? " · " : "") + '<a href="#/album/' + yeni + '">' + kac(ayYaz(yeni)) + " →</a>" : "") + "</p></div></header>" +
      (l.length ? oneCikan(l[0]) : "") + izgaraHTML(l.slice(1)) + "</div>";
    document.title = ayYaz(ay) + " albümü — " + SITE;
  }

  function sayfaArsiv() {
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="etiket">Arşiv</span><h1>Hatıra arşivi</h1><p>Her ay bir albüm. Geçmiş ayların fotoğraflarına ve hikâyelerine buradan ulaşabilirsiniz.</p></header>' +
      '<div class="arsiv-izgara">' + AYLAR_LISTE.map(function (ay) { return '<div class="arsiv-oge">' + kapakHTML(ay, true) + '<span class="alt-yazi">' + albumListe(ay).length + " hatıra</span></div>"; }).join("") + "</div></div>";
    document.title = "Arşiv — " + SITE;
  }

  var aramaMetni = "";
  function sayfaKesfet() {
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="etiket">Keşfet</span><h1>Bütün hatıralar</h1><p>Bir raf seçin ya da aradığınız yeri, eşyayı, sözcüğü yazın.</p></header>' +
      '<div class="arac"><a class="cip aktif" href="#/kesfet">Tümü</a>' + DOLU_KAT.map(function (k) { return '<a class="cip" href="#/raf/' + kac(k.id) + '">' + kac(k.ad) + "</a>"; }).join("") +
      '<label class="gizli" for="kesfet-ara">Ara</label><input id="kesfet-ara" type="search" placeholder="Ara… (ör. vapur)"></div><div id="sonuc"></div></div>';
    var kutu = $("#kesfet-ara");
    function ciz() {
      var q = sade(kutu.value).trim();
      $("#sonuc").innerHTML = izgaraHTML(TUM.filter(function (h) { return !q || h.aranan.indexOf(q) !== -1; }));
    }
    kutu.value = aramaMetni;
    kutu.addEventListener("input", function () { aramaMetni = kutu.value; ciz(); });
    ciz();
    document.title = "Keşfet — " + SITE;
  }

  function sayfaRaf(id) {
    var k = katBul(id);
    if (!k) return sayfaBulunamadi();
    var l = katListe(id);
    main.innerHTML = '<section class="raf-bas"><div class="foto">' + (l[0] ? gorselHTML(kapakGorsel(l[0]), "", true) : "") + '</div><div class="kap"><span class="etiket">Hatıra rafı</span><h1>' + kac(k.ad) + "</h1><p>" + l.length + " hatıra</p></div></section>" +
      '<div class="kap"><div class="arac"><a class="cip" href="#/kesfet">Tümü</a>' + DOLU_KAT.map(function (x) { return '<a class="cip' + (x.id === id ? " aktif" : "") + '" href="#/raf/' + kac(x.id) + '">' + kac(x.ad) + "</a>"; }).join("") + "</div>" + izgaraHTML(l) + "</div>";
    document.title = k.ad + " — " + SITE;
  }

  function sayfaEtiket(e) {
    var l = TUM.filter(function (h) { return h.etiketler.indexOf(e) !== -1; });
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="etiket">Etiket</span><h1>#' + kac(e) + "</h1><p>" + l.length + " hatıra bu etiketle paylaşıldı.</p></header>" + izgaraHTML(l) + "</div>";
    document.title = "#" + e + " — " + SITE;
  }

  function sayfaHatira(id) {
    var h = ID[id];
    if (!h) return sayfaBulunamadi();
    okunduIsaretle(h.id);
    var al = albumListe(h.ay), i = al.indexOf(h), yeni = al[i - 1], eski = al[i + 1];
    if (!yeni && !eski) { var j = TUM.indexOf(h); yeni = TUM[j - 1]; eski = TUM[j + 1]; }
    var benzer = katListe(h.kat.id).filter(function (x) { return x !== h; });
    if (benzer.length < 3) benzer = benzer.concat(TUM.filter(function (x) { return x !== h && benzer.indexOf(x) === -1; }));
    function metinHTML(p) {
      return kac(p).replace(/\n/g, "<br>").replace(/#([0-9A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû_]+)/g, function (_, e) { return '<a href="#/etiket/' + encodeURIComponent(kucuk(e)) + '">#' + e + "</a>"; });
    }
    function figur(g, n) {
      var k = g.src && KAYNAK[g.src];
      var alt = h.baslik + (h.gorseller.length > 1 ? " — " + n + ". fotoğraf" : "");
      var gorsel = g.src ? '<img src="' + kac(g.src) + '" alt="' + kac(alt) + '"' + (n > 1 ? ' loading="lazy"' : "") + ">" : '<div class="foto ornek-svg">' + gorselHTML(g, alt) + "</div>";
      return "<figure>" + gorsel + (k ? '<figcaption>Fotoğraf: ' + kac(k.yazar) + " · " + kac(k.lisans) + ' · <a href="' + kac(k.kaynak) + '" target="_blank" rel="noopener">Wikimedia Commons</a></figcaption>' : "") + "</figure>";
    }
    main.innerHTML = '<article class="okuma"><nav class="kirinti" aria-label="Konum"><a href="#/">Bugün</a><span>/</span><a href="#/album/' + kac(h.ay) + '">' + kac(ayYaz(h.ay)) + '</a><span>/</span><a href="#/raf/' + kac(h.kat.id) + '">' + kac(h.kat.ad) + "</a></nav>" +
      '<header class="okuma-bas">' + etiketSatiri(h) + "<h1>" + kac(h.baslik) + '</h1><p class="meta">' + kac(h.tarihMetni) + ' · <a href="#/album/' + kac(h.ay) + '">' + kac(ayYaz(h.ay)) + " albümü</a>" + (h.reels ? " · Reels" : h.gorseller.length > 1 ? " · " + h.gorseller.length + " fotoğraf" : "") + "</p></header>" +
      '<div class="fotolar">' + h.gorseller.map(function (g, n) { return figur(g, n + 1); }).join("") + "</div>" +
      (h.reels ? '<div class="reels-not"><span>Bu hatıranın videosu Instagram’da.</span><a class="btn btn-ig" href="' + kac(h.instagram) + '" target="_blank" rel="noopener">' + IKON.ig + "Instagram’da izle</a></div>" : "") +
      '<div class="metin">' + (h.paragraflar.length ? h.paragraflar.map(function (p) { return "<p>" + metinHTML(p) + "</p>"; }).join("") : "<p>" + kac(h.ozet) + "</p>") + "</div>" +
      (h.etiketler.length ? '<div class="etiketler">' + h.etiketler.map(function (e) { return '<a href="#/etiket/' + encodeURIComponent(e) + '">#' + kac(e) + "</a>"; }).join("") + "</div>" : "") +
      '<div class="okuma-eylem"><a class="btn btn-ig" href="' + kac(h.instagram) + '" target="_blank" rel="noopener">' + IKON.ig + (h.reels ? "Instagram’da izle" : "Instagram’da gör") + "</a>" +
        '<button class="btn btn-cizgi" type="button" data-paylas="' + kac(h.id) + '">' + IKON.paylas + "Paylaş</button></div>" +
      '<nav class="gezinme" aria-label="Diğer hatıralar">' +
        (yeni ? '<a href="#/hatira/' + kac(yeni.id) + '"><small>← Önceki sayfa</small><b>' + kac(yeni.baslik) + "</b></a>" : "<span></span>") +
        (eski ? '<a class="sonraki" href="#/hatira/' + kac(eski.id) + '"><small>Sonraki sayfa →</small><b>' + kac(eski.baslik) + "</b></a>" : "") +
      "</nav></article>" +
      '<section class="bolum"><div class="kap">' + bolumUst("Aynı raftan", "#/raf/" + h.kat.id, kac(h.kat.ad)) + '<div class="yazi-izgara uclu">' + benzer.slice(0, 3).map(yaziKart).join("") + "</div></div></section>";
    document.title = h.baslik + " — " + SITE;
  }

  function sayfaHakkimizda() {
    var e = A.eposta;
    var link = e ? "mailto:" + e + "?subject=" + encodeURIComponent("Hatıram") : "https://ig.me/m/" + IG;
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="etiket">Hikâyemiz</span><h1>Geldi geçti, hatıra kaldı.</h1></header>' +
      '<div class="duz-metin">' + (A.hakkimizda || []).map(function (p) { return "<p>" + kac(p) + "</p>"; }).join("") + "</div>" +
      '<div class="mektup" style="padding-bottom:80px"><div id="gonder"><span class="etiket">Hatıra defteri</span><h3>Hatıranı gönder</h3><p>Eski bir fotoğrafınız, anlatmak istediğiniz bir hatıranız mı var? Gönderin; seçilen hatıralar sitemizde ve Instagram sayfamızda yayımlansın.</p>' +
      '<a class="btn btn-cay" href="' + kac(link) + '" target="_blank" rel="noopener">' + (e ? "E-posta ile gönder" : "Instagram’dan mesaj gönder") + "</a>" + (e ? '<p style="margin:14px 0 0">E-posta: <b>' + kac(e) + "</b></p>" : "") + "</div>" +
      '<div class="zarf"><span class="etiket">Instagram</span><h3>@' + kac(IG) + '</h3><p>Her yeni hatıra önce Instagram’da paylaşılır.</p><a class="btn btn-ig" href="' + IG_PROFIL + '" target="_blank" rel="noopener">' + IKON.ig + "Takip et</a></div></div></div>";
    document.title = "Hakkımızda — " + SITE;
  }

  function sayfaKaynaklar() {
    var l = Object.keys(KAYNAK);
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="etiket">Künye</span><h1>Fotoğraf kaynakları</h1><p>Örnek hatıralarda kullanılan fotoğraflar Wikimedia Commons’tan, serbest lisanslarla alınmıştır.</p></header>' +
      '<div class="kaynak-liste">' + (l.length ? l.map(function (src) {
        var k = KAYNAK[src];
        return '<a href="' + kac(k.kaynak) + '" target="_blank" rel="noopener"><div class="foto"><img src="' + kac(src) + '" alt="" loading="lazy"></div><span><b>' + kac(k.yazar) + "</b><br><small>" + kac(k.lisans) + " · Wikimedia Commons</small></span></a>";
      }).join("") : '<div class="bos"><b>Kaynak listesi boş</b></div>') + "</div></div>";
    document.title = "Fotoğraf kaynakları — " + SITE;
  }

  function sayfaBulunamadi() {
    main.innerHTML = '<div class="kap" style="padding:80px 0 120px"><div class="bos"><b>Bu sayfa da geldi geçti…</b>Aradığınız sayfa bulunamadı.<br><br><a class="btn btn-koyu" href="#/">Bugün’e dön</a></div></div>';
  }

  /* ---------- Yönlendirme ---------- */
  var ilk = true;
  function yonlendir() {
    var h = location.hash || "#/";
    if (h.indexOf("#/") !== 0) return;
    var p = h.slice(2).split("/"), rota = p[0] || "ana", arg = p[1] ? decodeURIComponent(p[1]) : "";
    document.title = SAYFA_BASLIGI;
    switch (rota) {
      case "ana": sayfaAna(); break;
      case "album": sayfaAlbum(arg); break;
      case "arsiv": sayfaArsiv(); break;
      case "kesfet": case "hatiralar": sayfaKesfet(); break;
      case "raf": case "kategori": sayfaRaf(arg); break;
      case "etiket": sayfaEtiket(kucuk(arg)); break;
      case "hatira": sayfaHatira(arg); break;
      case "hakkimizda": sayfaHakkimizda(); break;
      case "kaynaklar": sayfaKaynaklar(); break;
      default: sayfaBulunamadi();
    }
    $$("[data-rota]").forEach(function (a) { a.classList.toggle("aktif", a.dataset.rota === rota); });
    if (!ilk) window.scrollTo(0, 0);
    ilk = false;
  }

  /* ---------- Genel ---------- */
  function bildir(m) {
    var b = $("#bildirim");
    b.textContent = m;
    b.classList.add("goster");
    clearTimeout(bildir.t);
    bildir.t = setTimeout(function () { b.classList.remove("goster"); }, 2600);
  }
  function paylas(h) {
    if (!h) return;
    var url = location.href.split("#")[0] + "#/hatira/" + h.id;
    function kopyala() {
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { bildir("Bağlantı kopyalandı"); }, function () { bildir(url); });
      else bildir(url);
    }
    if (navigator.share) navigator.share({ title: h.baslik, text: "“" + h.soz + "” — " + SITE, url: url }).catch(kopyala);
    else kopyala();
  }
  document.addEventListener("click", function (e) {
    var p = e.target.closest("[data-paylas]");
    if (p) paylas(ID[p.dataset.paylas]);
  });
  $("#tema-btn").addEventListener("click", function () {
    var kok = document.documentElement;
    var simdi = kok.getAttribute("data-tema") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "koyu" : "acik");
    var yeni = simdi === "koyu" ? "acik" : "koyu";
    kok.setAttribute("data-tema", yeni);
    try { localStorage.setItem("ggh-tema", yeni); } catch (er) {}
  });
  $$("[data-ig-profil]").forEach(function (a) { a.href = IG_PROFIL; });
  $$("[data-ig-ad]").forEach(function (a) { a.textContent = "@" + IG; });
  $$("[data-yil]").forEach(function (s) { s.textContent = new Date().getFullYear(); });
  $$("[data-slogan]").forEach(function (s) { if (A.slogan) s.textContent = A.slogan + "."; });

  window.addEventListener("hashchange", yonlendir);
  yonlendir();
})();
