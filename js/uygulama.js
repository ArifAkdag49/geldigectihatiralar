/* ==========================================================
   GELDİ GEÇTİ HATIRALAR — UYGULAMA
   İçerik veri/icerik.js'ten, ayarlar veri/ayarlar.js'ten okunur.
   Sayfalar (#/ adresleri):
     #/                 Ana sayfa: video vitrin, kategoriler, kategori vitrinleri
     #/kategori/<id>    Bir kategorinin bütün hatıraları
     #/hatiralar        Bütün hatıralar (arama + süzme)
     #/reels            Reels
     #/etiket/<etiket>  Etikete göre hatıralar
     #/hatira/<id>      Tek bir hatıranın sayfası
     #/hakkimizda       Hakkımızda + Hatıranı Gönder
   ========================================================== */
(function () {
  "use strict";

  var A = window.AYARLAR || {};
  var HAM = window.ICERIK || [];
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
  var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  function tarihYaz(t) {
    var p = String(t || "").split("-");
    return p.length < 3 ? (t || "") : parseInt(p[2], 10) + " " + AYLAR[parseInt(p[1], 10) - 1] + " " + p[0];
  }

  var IKON = {
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" class="dolu"/></svg>',
    ok: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    paylas: '<svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    sol: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    sag: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    album: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="13" height="13" rx="2.5"/><path d="M4 16V6.5A2.5 2.5 0 0 1 6.5 4H16"/></svg>',
    reels: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.5h18M8.5 3l3 5.5M14.5 3l3 5.5"/><path d="M10 12.2v5l4.3-2.5z" class="dolu"/></svg>',
    oynat: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
    kum: '<svg viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/></svg>',
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
  function hazirla(h, sira) {
    var metin = String(h.metin || "").replace(/\r/g, "").trim();
    var satirlar = metin.split("\n");
    var baslik = h.baslik || "", govde = metin, ilk = (satirlar[0] || "").trim();
    if (!baslik) {
      if (ilk && ilk.length <= 90 && satirlar.length > 1) { baslik = ilk; govde = satirlar.slice(1).join("\n").trim(); }
      else {
        var c = metin.replace(ETIKET_RE, "").split(/(?<=[.!?…])\s/)[0] || metin;
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
    return {
      id: String(h.id || "hatira-" + sira), sira: sira,
      tarih: h.tarih || "", tarihMetni: tarihYaz(h.tarih),
      tur: tur, reels: tur === "reels",
      gorseller: gorseller.length ? gorseller : [{ sahne: "mahalle" }],
      instagram: h.instagram || IG_PROFIL,
      baslik: baslik, paragraflar: paragraflar,
      ozet: duz.length > 160 ? duz.slice(0, 155).replace(/\s+\S*$/, "") + "…" : duz,
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

  /* ---------- Parçalar ---------- */
  function gorselHTML(g, alt, hemen) {
    if (g && g.src) return '<img src="' + kac(g.src) + '" alt="' + kac(alt) + '"' + (hemen ? "" : ' loading="lazy"') + ' decoding="async">';
    return window.sahneSvg ? window.sahneSvg(g && g.sahne) : "";
  }
  function kapak(h) { return h.gorseller[0]; }
  function rozet(h) {
    if (h.reels) return '<span class="rozet">' + IKON.reels + "Reels</span>";
    if (h.gorseller.length > 1) return '<span class="rozet">' + IKON.album + h.gorseller.length + " fotoğraf</span>";
    return "";
  }
  function kartHTML(h) {
    return '<a class="hatira-kart" href="#/hatira/' + kac(h.id) + '" style="--kat:' + kac(h.kat.renk) + '">' +
      '<div class="resim"><div class="gorsel">' + gorselHTML(kapak(h), h.baslik) + "</div>" + rozet(h) + '<span class="goz">Hatırayı oku</span></div>' +
      '<div class="kart-yazi"><span class="kat">' + kac(h.kat.ad) + "</span><h3>" + kac(h.baslik) + "</h3><p>" + kac(h.ozet) + '</p><time datetime="' + kac(h.tarih) + '">' + kac(h.tarihMetni) + "</time></div></a>";
  }
  function kategoriKutusu(k) {
    var ilk = katListe(k.id)[0];
    return '<a class="kategori-kutu" href="#/kategori/' + kac(k.id) + '"><div class="gorsel">' + (ilk ? gorselHTML(kapak(ilk), k.ad) : "") + "</div>" +
      '<span class="emoji" aria-hidden="true">' + k.emoji + '</span><span class="ok" aria-hidden="true">' + IKON.ok + "</span>" +
      '<span class="yazi"><small>' + katListe(k.id).length + " hatıra</small><b>" + kac(k.ad) + "</b></span></a>";
  }
  function reelKart(h) {
    return '<a class="reel-kart" href="' + kac(h.instagram) + '" target="_blank" rel="noopener"><div class="gorsel">' + gorselHTML(kapak(h), h.baslik) + "</div>" +
      '<span class="ust-bilgi">' + IKON.reels + "Reels</span>" +
      '<span class="izle" aria-hidden="true">' + IKON.oynat + "</span>" +
      '<span class="yazi"><small>' + kac(h.kat.ad) + " · " + kac(h.tarihMetni) + "</small><b>" + kac(h.baslik) + "</b></span></a>";
  }
  function bolumBasligi(ust, baslik, aciklama) {
    return '<div class="bolum-baslik"><span class="ust-yazi">' + ust + "</span><h2>" + baslik + "</h2>" + (aciklama ? "<p>" + aciklama + "</p>" : "") + '<div class="susleme" aria-hidden="true">' + IKON.kum + "</div></div>";
  }

  /* ---------- Fotoğraf kaydırıcı (hatıra sayfası) ---------- */
  function medyaHTML(h) {
    var n = h.gorseller.length;
    var ek = "";
    if (n > 1) {
      ek = '<span class="medya-sayac">1 / ' + n + "</span>" +
        '<button class="medya-ok sol" type="button" aria-label="Önceki fotoğraf" disabled>' + IKON.sol + "</button>" +
        '<button class="medya-ok sag" type="button" aria-label="Sonraki fotoğraf">' + IKON.sag + "</button>" +
        '<div class="medya-nokta">' + h.gorseller.map(function (_, i) { return "<i" + (i ? "" : ' class="aktif"') + "></i>"; }).join("") + "</div>";
    }
    if (h.reels) ek += '<a class="oynat" href="' + kac(h.instagram) + '" target="_blank" rel="noopener"><span class="daire">' + IKON.oynat + "</span>Instagram’da izle</a>";
    return '<div class="medya"><div class="medya-ray">' + h.gorseller.map(function (g, i) {
      return '<div class="gorsel">' + gorselHTML(g, h.baslik + (n > 1 ? " — " + (i + 1) + ". fotoğraf" : ""), i === 0) + "</div>";
    }).join("") + "</div>" + ek + "</div>";
  }
  function medyaBagla(kok) {
    $$(".medya", kok).forEach(function (m) {
      var ray = $(".medya-ray", m), n = ray.children.length;
      if (n < 2) return;
      var sol = $(".medya-ok.sol", m), sag = $(".medya-ok.sag", m), sayac = $(".medya-sayac", m), nok = $$(".medya-nokta i", m);
      function i() { return Math.round(ray.scrollLeft / ray.clientWidth); }
      function guncelle() {
        var x = i();
        sayac.textContent = (x + 1) + " / " + n;
        nok.forEach(function (d, j) { d.classList.toggle("aktif", j === x); });
        sol.disabled = x <= 0; sag.disabled = x >= n - 1;
      }
      ray.addEventListener("scroll", function () { requestAnimationFrame(guncelle); }, { passive: true });
      sol.addEventListener("click", function () { ray.scrollTo({ left: (i() - 1) * ray.clientWidth }); });
      sag.addEventListener("click", function () { ray.scrollTo({ left: (i() + 1) * ray.clientWidth }); });
    });
  }

  /* ---------- SAYFALAR ---------- */
  function sayfaAna() {
    var video = A.tanitimVideosu, kapakResim = A.tanitimKapak || "";
    var reels = TUM.filter(function (h) { return h.reels; });
    var hareketAzalt = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var afisHatira = TUM[1] || TUM[0];

    main.innerHTML =
      '<section class="vitrin" aria-label="Tanıtım">' +
        (video && !hareketAzalt
          ? '<video id="vitrin-video" autoplay muted loop playsinline preload="auto"' + (kapakResim ? ' poster="' + kac(kapakResim) + '"' : "") + '><source src="' + kac(video) + '" type="video/mp4"></video>'
          : (kapakResim ? '<img class="vitrin-kapak" src="' + kac(kapakResim) + '" alt="">' : "")) +
        '<div class="vitrin-ic"><span class="vitrin-ust">@' + kac(IG) + "</span>" +
          "<h1>Geldi geçti, <em>hatıra oldu.</em></h1>" +
          "<p>Vapur düdükleri, bakkal defterleri, kasetler ve tek kanallı televizyon akşamları… Instagram’da paylaştığımız bütün hatıralar, kategori kategori burada.</p>" +
          '<div class="dugmeler"><a class="btn btn-beyaz" href="#kategoriler">Kategorilere Göz At</a><a class="btn btn-cizgi-beyaz" href="#/reels">' + IKON.oynat.replace("<svg", '<svg style="fill:currentColor;stroke:none"') + "Reels’ları İzle</a></div>" +
        "</div>" +
        (video && !hareketAzalt ? '<button class="video-dugme" id="video-dugme" type="button" aria-label="Videoyu durdur" aria-pressed="false">' + IKON.dur + IKON.oyna + "</button>" : "") +
        '<span class="kaydir-ipucu" aria-hidden="true">Kaydır<i></i></span>' +
      "</section>" +

      '<section class="bolum" id="kategoriler"><div class="kap">' +
        bolumBasligi("Kategoriler", "Ne hatırlamak istersiniz?", "Bir kategori seçin; o döneme ait bütün fotoğraflar ve yazılar önünüze dökülsün.") +
        '<div class="kategori-izgara" style="--sutun:' + (DOLU_KAT.length % 4 === 0 || DOLU_KAT.length % 3 !== 0 ? 4 : 3) + '">' + DOLU_KAT.map(kategoriKutusu).join("") + "</div>" +
      "</div></section>" +

      DOLU_KAT.map(function (k) {
        var l = katListe(k.id);
        return '<section class="kat-vitrin" style="--kat:' + kac(k.renk) + '"><div class="kap">' +
          '<div class="kat-vitrin-ust"><div class="sol"><span class="emoji" aria-hidden="true">' + k.emoji + "</span><div><h2>" + kac(k.ad) + "</h2><small>" + l.length + " hatıra</small></div></div>" +
          '<a class="btn btn-cizgi btn-kucuk" href="#/kategori/' + kac(k.id) + '">Tümünü gör ' + IKON.ok + "</a></div>" +
          '<div class="urun-izgara">' + l.slice(0, 4).map(kartHTML).join("") + "</div>" +
        "</div></section>";
      }).join("") +

      (reels.length ? '<section class="bolum reels-bant"><div class="kap">' +
        bolumBasligi("Instagram Reels", "Hareketli hatıralar", "Videolarımızı Instagram’da izleyebilirsiniz.") +
        '<div class="reels-kaydir">' + reels.map(reelKart).join("") + "</div>" +
        '<div class="alt-dugme"><a class="btn btn-beyaz" href="#/reels">Bütün Reels’lar</a></div>' +
      "</div></section>" : "") +

      '<section class="bolum"><div class="kap"><div class="afis">' +
        '<div class="afis-yazi"><span class="ust-yazi">Sıra sizde</span><h2>Sizin de bir hatıranız var mı?</h2><p>Eski bir fotoğraf, bir anı, bir hikâye… Bize gönderin; seçilenleri sitemizde ve Instagram sayfamızda paylaşalım.</p><a class="btn btn-yesil" href="#/hakkimizda">💌 Hatıranı Gönder</a></div>' +
        '<div class="afis-gorsel"><div class="gorsel">' + (afisHatira ? gorselHTML(kapak(afisHatira), "") : "") + "</div></div>" +
      "</div></div></section>" +

      '<section class="bolum" style="padding-top:0"><div class="kap">' +
        bolumBasligi("@" + kac(IG), "Instagram’da bizi takip edin", "") +
        '<div class="ig-izgara">' + TUM.slice(0, 6).map(function (h) {
          return '<a href="' + kac(h.instagram) + '" target="_blank" rel="noopener" title="' + kac(h.baslik) + '"><div class="gorsel">' + gorselHTML(kapak(h), h.baslik) + "</div></a>";
        }).join("") + "</div>" +
        '<div class="ig-ortada"><a class="btn btn-ig" href="' + IG_PROFIL + '" target="_blank" rel="noopener">' + IKON.ig + "Instagram’da Takip Et</a></div>" +
      "</div></section>";

    var v = $("#vitrin-video"), vd = $("#video-dugme");
    if (v && vd) {
      vd.addEventListener("click", function () {
        if (v.paused) { v.play(); vd.setAttribute("aria-pressed", "false"); vd.setAttribute("aria-label", "Videoyu durdur"); }
        else { v.pause(); vd.setAttribute("aria-pressed", "true"); vd.setAttribute("aria-label", "Videoyu oynat"); }
      });
      var p = v.play && v.play();
      if (p && p.catch) p.catch(function () {});
    }
  }

  var siralama = "yeni";
  function izgaraSayfasi(ust, liste, cipler) {
    function ciz() {
      var l = liste.slice().sort(function (a, b) { return siralama === "yeni" ? (b.tarih || "").localeCompare(a.tarih || "") : (a.tarih || "").localeCompare(b.tarih || ""); });
      $("#liste").innerHTML = l.length ? l.map(kartHTML).join("") : '<div class="bos"><b>Burada henüz hatıra yok</b><a class="btn btn-yesil" href="#/">Ana sayfaya dön</a></div>';
    }
    main.innerHTML = ust + '<div class="kap"><div class="arac-cubugu">' + (cipler || "<span></span>") +
      '<label class="sirala" for="siralama">Sırala<select id="siralama"><option value="yeni">En yeni</option><option value="eski">En eski</option></select></label></div>' +
      '<div class="liste-izgara" id="liste"></div></div>';
    $("#siralama").value = siralama;
    $("#siralama").addEventListener("change", function (e) { siralama = e.target.value; ciz(); });
    ciz();
  }
  function kategoriCipleri(aktif) {
    return '<nav class="cipler" aria-label="Kategoriler"><a class="cip' + (aktif === "" ? " aktif" : "") + '" href="#/hatiralar">Tümü</a>' +
      DOLU_KAT.map(function (k) { return '<a class="cip' + (aktif === k.id ? " aktif" : "") + '" href="#/kategori/' + kac(k.id) + '"><span aria-hidden="true">' + k.emoji + "</span>" + kac(k.ad) + "</a>"; }).join("") + "</nav>";
  }

  function sayfaKategori(id) {
    var k = katBul(id);
    if (!k) return sayfaBulunamadi();
    var l = katListe(id), ilk = l[0];
    izgaraSayfasi(
      '<section class="kat-afis"><div class="gorsel">' + (ilk ? gorselHTML(kapak(ilk), "", true) : "") + '</div><div class="kap">' +
      '<nav class="kirinti" aria-label="Konum"><a href="#/">Ana Sayfa</a><span>›</span><span>Kategoriler</span></nav>' +
      "<h1>" + k.emoji + " " + kac(k.ad) + "</h1><p>" + l.length + " hatıra</p></div></section>",
      l, kategoriCipleri(id));
    document.title = k.ad + " — " + SITE;
  }

  function sayfaTum() {
    var ara = "";
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="ust-yazi">Arşiv</span><h1>Bütün hatıralar</h1><p>Instagram’da paylaştığımız her fotoğraf ve yazı. Bir kategori seçin ya da aradığınızı yazın.</p></header>' +
      '<div class="arac-cubugu">' + kategoriCipleri("") + '<label class="ara-kutu" for="liste-ara"><span class="gizli">Ara</span><input id="liste-ara" type="search" placeholder="Ara… (ör. vapur)"></label></div>' +
      '<div class="liste-izgara" id="liste"></div></div>';
    function ciz() {
      var q = sade(ara).trim();
      var l = TUM.filter(function (h) { return !q || h.aranan.indexOf(q) !== -1; });
      $("#liste").innerHTML = l.length ? l.map(kartHTML).join("") : '<div class="bos"><b>Sonuç bulunamadı</b>Başka bir kelimeyle aramayı deneyin.</div>';
    }
    var kutu = $("#liste-ara");
    kutu.value = aramaMetni;
    ara = aramaMetni;
    kutu.addEventListener("input", function () { ara = kutu.value; ciz(); });
    ciz();
    document.title = "Bütün hatıralar — " + SITE;
  }

  function sayfaReels() {
    var l = TUM.filter(function (h) { return h.reels; });
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="ust-yazi">Instagram Reels</span><h1>Hareketli hatıralar</h1><p>Videolarımızın kapakları ve hikâyeleri burada; izlemek için Instagram’a geçebilirsiniz.</p></header>' +
      '<div class="liste-izgara">' + (l.length ? l.map(reelKart).join("") : '<div class="bos"><b>Henüz Reels eklenmedi</b></div>') + "</div></div>";
    document.title = "Reels — " + SITE;
  }

  function sayfaEtiket(e) {
    var l = TUM.filter(function (h) { return h.etiketler.indexOf(e) !== -1; });
    izgaraSayfasi('<div class="kap"><header class="sayfa-ust"><span class="ust-yazi">Etiket</span><h1>#' + kac(e) + "</h1><p>" + l.length + " hatıra bu etiketle paylaşıldı.</p></header></div>", l, kategoriCipleri(null));
    document.title = "#" + e + " — " + SITE;
  }

  function sayfaHatira(id) {
    var h = ID[id];
    if (!h) return sayfaBulunamadi();
    var kl = katListe(h.kat.id), i = kl.indexOf(h), yeni = kl[i - 1], eski = kl[i + 1];
    var benzer = kl.filter(function (x) { return x !== h; });
    if (benzer.length < 4) benzer = benzer.concat(TUM.filter(function (x) { return x !== h && benzer.indexOf(x) === -1; }));
    function metinHTML(p) {
      return kac(p).replace(/\n/g, "<br>").replace(/#([0-9A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû_]+)/g, function (_, e) { return '<a href="#/etiket/' + encodeURIComponent(kucuk(e)) + '">#' + e + "</a>"; });
    }
    main.innerHTML = '<div class="kap"><nav class="kirinti" aria-label="Konum"><a href="#/">Ana Sayfa</a><span>›</span><a href="#/kategori/' + kac(h.kat.id) + '">' + kac(h.kat.ad) + "</a><span>›</span><span>" + kac(h.baslik) + "</span></nav>" +
      '<article class="detay"><div class="detay-medya">' + medyaHTML(h) + "</div>" +
      '<div class="detay-yazi"><div class="meta"><a class="kat-etiket" href="#/kategori/' + kac(h.kat.id) + '" style="--kat:' + kac(h.kat.renk) + '">' + h.kat.emoji + " " + kac(h.kat.ad) + "</a>" +
        '<time datetime="' + kac(h.tarih) + '">' + kac(h.tarihMetni) + "</time>" + (h.reels ? "<span>· Reels</span>" : h.gorseller.length > 1 ? "<span>· " + h.gorseller.length + " fotoğraf</span>" : "") + "</div>" +
        "<h1>" + kac(h.baslik) + "</h1>" +
        '<div class="metin">' + (h.paragraflar.length ? h.paragraflar.map(function (p) { return "<p>" + metinHTML(p) + "</p>"; }).join("") : "<p>" + kac(h.ozet) + "</p>") + "</div>" +
        (h.etiketler.length ? '<div class="etiketler">' + h.etiketler.map(function (e) { return '<a href="#/etiket/' + encodeURIComponent(e) + '">#' + kac(e) + "</a>"; }).join("") + "</div>" : "") +
        '<div class="detay-eylem"><a class="btn btn-ig" href="' + kac(h.instagram) + '" target="_blank" rel="noopener">' + IKON.ig + (h.reels ? "Instagram’da İzle" : "Instagram’da Gör") + "</a>" +
        '<button class="btn btn-cizgi" type="button" data-paylas="' + kac(h.id) + '">' + IKON.paylas + "Paylaş</button></div>" +
        '<nav class="gezinme" aria-label="Bu kategorideki diğer hatıralar">' +
          (yeni ? '<a href="#/hatira/' + kac(yeni.id) + '"><small>← Daha yeni</small><b>' + kac(yeni.baslik) + "</b></a>" : "<span></span>") +
          (eski ? '<a class="sonraki" href="#/hatira/' + kac(eski.id) + '"><small>Daha eski →</small><b>' + kac(eski.baslik) + "</b></a>" : "") +
        "</nav></div></article></div>" +
      '<section class="kat-vitrin" style="--kat:' + kac(h.kat.renk) + '"><div class="kap"><div class="kat-vitrin-ust"><div class="sol"><span class="emoji" aria-hidden="true">' + h.kat.emoji + "</span><div><h2>Benzer hatıralar</h2><small>" + kac(h.kat.ad) + "</small></div></div>" +
        '<a class="btn btn-cizgi btn-kucuk" href="#/kategori/' + kac(h.kat.id) + '">Tümünü gör ' + IKON.ok + "</a></div>" +
        '<div class="urun-izgara">' + benzer.slice(0, 4).map(kartHTML).join("") + "</div></div></section>";
    medyaBagla(main);
    document.title = h.baslik + " — " + SITE;
  }

  function sayfaHakkimizda() {
    var e = A.eposta;
    var link = e ? "mailto:" + e + "?subject=" + encodeURIComponent("Hatıram") : "https://ig.me/m/" + IG;
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="ust-yazi">Hikâyemiz</span><h1>Geldi geçti, hatıra oldu.</h1></header>' +
      '<div class="hakkinda"><div class="metin">' + (A.hakkimizda || []).map(function (p) { return "<p>" + kac(p) + "</p>"; }).join("") +
      '<p><a class="btn btn-ig" href="' + IG_PROFIL + '" target="_blank" rel="noopener">' + IKON.ig + "Instagram’da Takip Et</a></p></div>" +
      '<aside class="gonder-kart" id="gonder"><h2>💌 Hatıranı Gönder</h2><p>Eski bir fotoğrafınız, anlatmak istediğiniz bir hatıranız mı var? Gönderin; seçilen hatıralar sitemizde ve Instagram sayfamızda yayımlansın.</p>' +
      '<a class="btn btn-yesil" href="' + kac(link) + '" target="_blank" rel="noopener">' + (e ? "E-posta ile gönder" : "Instagram’dan mesaj gönder") + "</a>" +
      (e ? '<p style="margin:14px 0 0;font-size:14px">E-posta: <b>' + kac(e) + "</b></p>" : "") + "</aside></div></div>";
    document.title = "Hakkımızda — " + SITE;
  }

  function sayfaBulunamadi() {
    main.innerHTML = '<div class="kap" style="padding:80px 0 120px"><div class="bos"><b>Bu hatıra da geldi geçti…</b>Aradığınız sayfa bulunamadı.<br><a class="btn btn-yesil" href="#/">Ana sayfaya dön</a></div></div>';
  }

  /* ---------- Menüler ---------- */
  function menuleriKur() {
    $("#kategori-menu").innerHTML = '<a href="#/" data-rota="ana">Ana Sayfa</a>' +
      DOLU_KAT.map(function (k) { return '<a href="#/kategori/' + kac(k.id) + '" data-rota="kategori/' + kac(k.id) + '">' + kac(k.ad) + "</a>"; }).join("") +
      '<a href="#/reels" data-rota="reels">Reels</a><a href="#/hakkimizda" data-rota="hakkimizda">Hakkımızda</a>';
    $("#alt-kategoriler").innerHTML = DOLU_KAT.map(function (k) { return '<a href="#/kategori/' + kac(k.id) + '">' + kac(k.ad) + "</a>"; }).join("");
  }

  /* ---------- Yönlendirme ---------- */
  var aramaMetni = "", ilkYukleme = true;
  function yonlendir() {
    var h = location.hash || "#/";
    if (h.indexOf("#/") !== 0) return; // sayfa içi bağlantı (#kategoriler gibi)
    var p = h.slice(2).split("/"), rota = p[0] || "ana", arg = p[1] ? decodeURIComponent(p[1]) : "";
    document.title = SAYFA_BASLIGI;
    switch (rota) {
      case "ana": sayfaAna(); break;
      case "kategori": sayfaKategori(arg); break;
      case "hatiralar": case "kesfet": sayfaTum(); break;
      case "reels": sayfaReels(); break;
      case "etiket": sayfaEtiket(kucuk(arg)); break;
      case "hatira": sayfaHatira(arg); break;
      case "hakkimizda": sayfaHakkimizda(); break;
      default: sayfaBulunamadi();
    }
    var menuAnahtar = rota === "kategori" ? "kategori/" + arg : rota === "hatira" && ID[arg] ? "kategori/" + ID[arg].kat.id : rota;
    $$("#kategori-menu a").forEach(function (a) { a.classList.toggle("aktif", a.dataset.rota === menuAnahtar); });
    var aktif = $("#kategori-menu a.aktif");
    if (aktif && aktif.scrollIntoView && !ilkYukleme) aktif.scrollIntoView({ block: "nearest", inline: "center" });
    if (!ilkYukleme) window.scrollTo(0, 0);
    ilkYukleme = false;
  }

  /* ---------- Genel olaylar ---------- */
  function bildir(m) {
    var b = $("#bildirim");
    b.textContent = m;
    b.classList.add("goster");
    clearTimeout(bildir.t);
    bildir.t = setTimeout(function () { b.classList.remove("goster"); }, 2400);
  }
  document.addEventListener("click", function (e) {
    var p = e.target.closest("[data-paylas]");
    if (!p) return;
    var h = ID[p.dataset.paylas], url = location.href.split("#")[0] + "#/hatira/" + h.id;
    function kopyala() {
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { bildir("Bağlantı kopyalandı 🔗"); }, function () { bildir(url); });
      else bildir(url);
    }
    if (navigator.share) navigator.share({ title: h.baslik, text: h.baslik + " — " + SITE, url: url }).catch(kopyala);
    else kopyala();
  });

  var araBtn = $("#ara-btn"), araPanel = $("#arama-paneli"), araKutu = $("#arama");
  araBtn.addEventListener("click", function () {
    var ac = araPanel.hidden;
    araPanel.hidden = !ac;
    araBtn.setAttribute("aria-expanded", ac);
    if (ac) araKutu.focus();
  });
  araKutu.addEventListener("input", function () {
    aramaMetni = araKutu.value;
    if (location.hash !== "#/hatiralar") location.hash = "#/hatiralar";
    else { var k = $("#liste-ara"); if (k) { k.value = aramaMetni; k.dispatchEvent(new Event("input")); } }
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
  var duyuru = $("#duyuru");
  if (A.duyuru) $("[data-duyuru]").textContent = A.duyuru; else if (duyuru) duyuru.hidden = true;

  menuleriKur();
  window.addEventListener("hashchange", yonlendir);
  yonlendir();
})();
