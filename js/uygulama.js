/* ==========================================================
   GELDİ GEÇTİ HATIRALAR — UYGULAMA
   İçerik veri/icerik.js'ten, ayarlar veri/ayarlar.js'ten okunur.
   Sayfalar (#/ adresleri):
     #/                 Akış (ana sayfa)
     #/kesfet           Keşfet (tüm görseller)
     #/reels            Reels
     #/kategori/<id>    Kategoriye göre hatıralar
     #/etiket/<etiket>  Etikete göre hatıralar
     #/hatira/<id>      Tek bir hatıranın sayfası
     #/kaydedilenler    Ziyaretçinin kaydettikleri
     #/hakkimizda       Hakkımızda + Hatıranı Gönder
   ========================================================== */
(function () {
  "use strict";

  var A = window.AYARLAR || {};
  var HAM = window.ICERIK || [];
  var IG = (A.instagram || "").replace(/^@/, "");
  var IG_PROFIL = IG ? "https://www.instagram.com/" + IG + "/" : "https://www.instagram.com/";
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
  function sade(m) {
    return kucuk(m).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ı/g, "i");
  }
  var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  function tarihYaz(t) {
    var p = String(t || "").split("-");
    if (p.length < 3) return t || "";
    return parseInt(p[2], 10) + " " + AYLAR[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function sakla(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function oku(k, v) { try { var x = localStorage.getItem(k); return x ? JSON.parse(x) : v; } catch (e) { return v; } }

  var IKON = {
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" class="dolu"/></svg>',
    disari: '<svg class="ok-ikon" viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    kaydet: '<svg viewBox="0 0 24 24"><path d="M6 4h12v17l-6-4.5L6 21z"/></svg>',
    paylas: '<svg viewBox="0 0 24 24"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    sol: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    sag: '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    album: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="13" height="13" rx="2.5"/><path d="M4 16V6.5A2.5 2.5 0 0 1 6.5 4H16"/></svg>',
    reels: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.5h18M8.5 3l3 5.5M14.5 3l3 5.5"/><path d="M10 12.2v5l4.3-2.5z" class="dolu"/></svg>',
    foto: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/></svg>',
    oynat: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15l12.5-7.5z"/></svg>'
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
  function hazirla(h, sira) {
    var metin = String(h.metin || "").replace(/\r/g, "").trim();
    var satirlar = metin.split("\n");
    var baslik = h.baslik || "";
    var govde = metin;
    var ilk = (satirlar[0] || "").trim();
    if (!baslik) {
      if (ilk && ilk.length <= 90 && satirlar.length > 1) { baslik = ilk; govde = satirlar.slice(1).join("\n").trim(); }
      else {
        var c = metin.replace(/#[^\s#]+/g, "").split(/(?<=[.!?…])\s/)[0] || metin;
        baslik = c.length > 70 ? c.slice(0, 67).replace(/\s+\S*$/, "") + "…" : c;
      }
    }
    var temizBaslik = baslik.replace(/#[^\s#]+/g, "").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, "").trim() || "Hatıra";
    var etiketler = [];
    (metin.match(/#[0-9A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû_]+/g) || []).forEach(function (e) {
      var t = kucuk(e.slice(1));
      if (etiketler.indexOf(t) === -1) etiketler.push(t);
    });
    var paragraflar = govde.split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean);
    // Sadece etiketlerden oluşan son paragrafı metinden ayır
    if (paragraflar.length && /^(#[^\s]+\s*)+$/.test(paragraflar[paragraflar.length - 1])) paragraflar.pop();
    var duz = paragraflar.join(" ").replace(/#[^\s#]+/g, "").replace(/\s+/g, " ").trim();
    var ozet = duz.length > 230 ? duz.slice(0, 225).replace(/\s+\S*$/, "") + "…" : duz;
    var kat = (h.kategori && katBul(h.kategori)) || katTahmin(metin + " " + etiketler.join(" "));
    var gorseller = (h.gorseller || []).map(function (g) { return typeof g === "string" ? { src: g } : g; });
    var tur = h.tur || (gorseller.length > 1 ? "albüm" : "foto");
    return {
      id: String(h.id || ("hatira-" + sira)),
      sira: sira,
      tarih: h.tarih || "",
      tarihMetni: tarihYaz(h.tarih),
      tur: tur,
      reels: tur === "reels",
      gorseller: gorseller.length ? gorseller : [{ sahne: "mahalle" }],
      instagram: h.instagram || IG_PROFIL,
      baslik: temizBaslik,
      paragraflar: paragraflar,
      ozet: ozet,
      etiketler: etiketler,
      kat: kat,
      aranan: sade(metin + " " + kat.ad)
    };
  }
  var TUM = HAM.map(hazirla).sort(function (a, b) { return (b.tarih || "").localeCompare(a.tarih || "") || a.sira - b.sira; });
  var ID = {};
  TUM.forEach(function (h) { ID[h.id] = h; });
  function katSayisi(id) { return TUM.filter(function (h) { return h.kat.id === id; }).length; }
  var KULLANILAN_KAT = KATEGORILER.concat([VARSAYILAN]).filter(function (k) { return katSayisi(k.id) > 0; });

  /* ---------- Kaydedilenler ---------- */
  var kayitli = oku("ggh-kayitli", []);
  function kayitliMi(id) { return kayitli.indexOf(id) !== -1; }
  function kayitDegistir(id) {
    if (kayitliMi(id)) kayitli = kayitli.filter(function (x) { return x !== id; });
    else kayitli.unshift(id);
    sakla("ggh-kayitli", kayitli);
    return kayitliMi(id);
  }

  /* ---------- Görsel çizimi ---------- */
  function gorselHTML(g, alt, yukle) {
    if (g && g.src) {
      return '<img src="' + kac(g.src) + '" alt="' + kac(alt) + '"' + (yukle === "hemen" ? "" : ' loading="lazy"') + ' decoding="async">';
    }
    return window.sahneSvg ? window.sahneSvg(g && g.sahne) : "";
  }
  function kapak(h) { return h.gorseller[0]; }

  function medyaHTML(h, detay) {
    var n = h.gorseller.length;
    var slaytlar = h.gorseller.map(function (g, i) {
      var alt = h.baslik + (n > 1 ? " — " + (i + 1) + ". fotoğraf" : "");
      var ic = gorselHTML(g, alt, detay && i === 0 ? "hemen" : "");
      return detay ? '<div class="gorsel">' + ic + "</div>" : '<a class="gorsel" href="#/hatira/' + kac(h.id) + '" tabindex="-1" aria-hidden="true">' + ic + "</a>";
    }).join("");
    var ek = "";
    if (n > 1) {
      ek += '<span class="medya-sayac">1 / ' + n + "</span>";
      ek += '<button class="medya-ok sol" type="button" aria-label="Önceki fotoğraf" disabled>' + IKON.sol + "</button>";
      ek += '<button class="medya-ok sag" type="button" aria-label="Sonraki fotoğraf">' + IKON.sag + "</button>";
      ek += '<div class="medya-nokta">' + h.gorseller.map(function (_, i) { return "<i" + (i === 0 ? ' class="aktif"' : "") + "></i>"; }).join("") + "</div>";
    }
    if (h.reels) {
      ek += '<span class="reels-isareti">' + IKON.reels + "Reels</span>";
      ek += '<a class="oynat" href="' + kac(h.instagram) + '" target="_blank" rel="noopener"><span class="daire">' + IKON.oynat + "</span>Instagram’da izle</a>";
    }
    return '<div class="medya"><div class="medya-ray">' + slaytlar + "</div>" + ek + "</div>";
  }

  function turBilgi(h) {
    if (h.reels) return IKON.reels + "Reels";
    if (h.gorseller.length > 1) return IKON.album + h.gorseller.length + " fotoğraf";
    return IKON.foto + "Fotoğraf";
  }
  function katRozet(k) {
    return '<a class="kat-rozet" href="#/kategori/' + kac(k.id) + '" style="--kat:' + kac(k.renk) + '"><span aria-hidden="true">' + k.emoji + "</span>" + kac(k.ad) + "</a>";
  }
  function igBaglanti(h, metin) {
    return '<a class="ig-baglanti" href="' + kac(h.instagram) + '" target="_blank" rel="noopener"><span class="ig-daire">' + IKON.ig + "</span>" + (metin || (h.reels ? "Instagram’da izle" : "Instagram’da gör")) + IKON.disari + "</a>";
  }
  function eylemler(h) {
    var k = kayitliMi(h.id);
    return '<div class="eylemler">' +
      '<button class="eylem" type="button" data-kaydet="' + kac(h.id) + '" aria-pressed="' + k + '" aria-label="Kaydet" title="Kaydet">' + IKON.kaydet + "</button>" +
      '<button class="eylem" type="button" data-paylas="' + kac(h.id) + '" aria-label="Paylaş" title="Paylaş">' + IKON.paylas + "</button></div>";
  }

  function kartHTML(h, i) {
    return '<article class="kart" style="animation-delay:' + Math.min(i, 5) * 60 + 'ms">' +
      '<div class="kart-ust">' + katRozet(h.kat) + '<time datetime="' + kac(h.tarih) + '">' + kac(h.tarihMetni) + '</time><span class="tur">' + turBilgi(h) + "</span></div>" +
      medyaHTML(h, false) +
      '<div class="kart-govde"><h2 class="kart-baslik"><a href="#/hatira/' + kac(h.id) + '">' + kac(h.baslik) + "</a></h2>" +
      '<p class="kart-metin">' + kac(h.ozet) + "</p>" +
      '<a class="devam" href="#/hatira/' + kac(h.id) + '">Devamını oku →</a>' +
      (h.etiketler.length ? '<div class="etiketler">' + h.etiketler.slice(0, 5).map(function (e) { return '<a href="#/etiket/' + encodeURIComponent(e) + '">#' + kac(e) + "</a>"; }).join("") + "</div>" : "") +
      "</div>" +
      '<div class="kart-alt">' + igBaglanti(h) + eylemler(h) + "</div></article>";
  }

  /* ---------- Akış (sonsuz kaydırma) ---------- */
  var gozlemci = null;
  function akisKur(liste, kutu) {
    var sayfa = 0, ADIM = 5;
    if (gozlemci) { gozlemci.disconnect(); gozlemci = null; }
    kutu.innerHTML = "";
    if (!liste.length) {
      kutu.innerHTML = '<div class="bos"><b>Burada henüz hatıra yok</b>Başka bir kategoriye ya da etikete göz atabilirsiniz.<br><a class="btn btn-koyu" href="#/">Akışa dön</a></div>';
      return;
    }
    var alt = document.createElement("div");
    alt.className = "daha-fazla";
    function ekle() {
      var parca = liste.slice(sayfa * ADIM, (sayfa + 1) * ADIM);
      var html = parca.map(function (h, i) { return kartHTML(h, i); }).join("");
      alt.insertAdjacentHTML("beforebegin", html);
      sayfa++;
      medyaBagla(kutu);
      if (sayfa * ADIM >= liste.length) { alt.remove(); if (gozlemci) gozlemci.disconnect(); }
    }
    alt.innerHTML = '<button class="btn btn-cizgi" type="button">Daha fazla hatıra</button>';
    kutu.appendChild(alt);
    alt.querySelector("button").addEventListener("click", ekle);
    ekle();
    if ("IntersectionObserver" in window && alt.isConnected) {
      gozlemci = new IntersectionObserver(function (g) { if (g[0].isIntersecting) ekle(); }, { rootMargin: "600px" });
      gozlemci.observe(alt);
    }
  }

  /* ---------- Fotoğraf kaydırıcı ---------- */
  function medyaBagla(kok) {
    $$(".medya", kok).forEach(function (m) {
      if (m.dataset.bagli) return;
      m.dataset.bagli = "1";
      var ray = $(".medya-ray", m);
      var n = ray.children.length;
      if (n < 2) return;
      var sol = $(".medya-ok.sol", m), sag = $(".medya-ok.sag", m), sayac = $(".medya-sayac", m), noktalar = $$(".medya-nokta i", m);
      function aktif() { return Math.round(ray.scrollLeft / ray.clientWidth); }
      function guncelle() {
        var i = aktif();
        sayac.textContent = (i + 1) + " / " + n;
        noktalar.forEach(function (d, j) { d.classList.toggle("aktif", j === i); });
        sol.disabled = i <= 0; sag.disabled = i >= n - 1;
      }
      ray.addEventListener("scroll", function () { window.requestAnimationFrame(guncelle); }, { passive: true });
      sol.addEventListener("click", function () { ray.scrollTo({ left: (aktif() - 1) * ray.clientWidth }); });
      sag.addEventListener("click", function () { ray.scrollTo({ left: (aktif() + 1) * ray.clientWidth }); });
    });
  }

  /* ---------- Yan panel ---------- */
  function yanPanelHTML() {
    var etiketSay = {};
    TUM.forEach(function (h) { h.etiketler.forEach(function (e) { etiketSay[e] = (etiketSay[e] || 0) + 1; }); });
    var populer = Object.keys(etiketSay).sort(function (a, b) { return etiketSay[b] - etiketSay[a]; }).slice(0, 10);
    var mini = TUM.slice(0, 9).map(function (h) {
      return '<a href="#/hatira/' + kac(h.id) + '" title="' + kac(h.baslik) + '"><div class="gorsel">' + gorselHTML(kapak(h), h.baslik) + "</div></a>";
    }).join("");
    return '<aside class="yan" aria-label="Yan panel">' +
      '<div class="panel profil-panel"><div class="kapak"></div><div class="avatar"><img src="gorseller/favicon.svg" alt=""></div>' +
      "<b>" + kac(A.siteAdi || "Geldi Geçti Hatıralar") + '</b><span class="kadi">@' + kac(IG) + "</span>" +
      "<p>Her gün yeni bir fotoğraf, yeni bir hatıra. Instagram’da da bizi takip edin, yorumlarda buluşalım.</p>" +
      '<a class="btn btn-ig" href="' + IG_PROFIL + '" target="_blank" rel="noopener">' + IKON.ig + "Instagram’da Takip Et</a></div>" +
      '<div class="panel"><h3>Keşfet</h3><div class="mini-izgara">' + mini + "</div></div>" +
      (populer.length ? '<div class="panel"><h3>Popüler etiketler</h3><div class="etiket-bulutu">' + populer.map(function (e) { return '<a href="#/etiket/' + encodeURIComponent(e) + '">#' + kac(e) + "</a>"; }).join("") + "</div></div>" : "") +
      '<div class="panel gonder-panel"><h3>Sizin de bir hatıranız var mı?</h3><p>Eski bir fotoğraf, bir anı… Gönderin, birlikte yaşatalım.</p><a class="btn" href="#/hakkimizda">💌 Hatıranı Gönder</a></div>' +
      '<div class="yan-alt"><a href="#/hakkimizda">Hakkımızda</a><a href="' + IG_PROFIL + '" target="_blank" rel="noopener">Instagram</a><span>© ' + new Date().getFullYear() + " Geldi Geçti Hatıralar</span></div>" +
      "</aside>";
  }

  /* ---------- SAYFALAR ---------- */
  var filtreTur = "hepsi";

  function sayfaAkis() {
    var one = TUM[0];
    var fotoSay = TUM.reduce(function (t, h) { return t + (h.reels ? 0 : h.gorseller.length); }, 0);
    var reelsSay = TUM.filter(function (h) { return h.reels; }).length;
    main.innerHTML =
      '<section class="karsilama"><div class="kap karsilama-ic"><div>' +
        '<span class="ust-etiket"><i>' + IKON.ig + "</i>@" + kac(IG) + "</span>" +
        "<h1>Geldi geçti ama <em>unutulmadı.</em></h1>" +
        '<p class="giris">Vapur düdükleri, bakkal defterleri, kasetler ve tek kanallı televizyon akşamları… Instagram’da paylaştığımız bütün fotoğraflar ve hatıra yazıları burada, bir akış hâlinde.</p>' +
        '<div class="btn-grup"><a class="btn btn-marka" href="#akis">Akışa Başla ↓</a><a class="btn btn-cizgi" href="' + IG_PROFIL + '" target="_blank" rel="noopener">' + IKON.ig + "Instagram’da Takip Et</a></div>" +
        '<div class="sayilar"><div><b>' + TUM.length + "</b><span>hatıra</span></div><div><b>" + fotoSay + "</b><span>fotoğraf</span></div><div><b>" + reelsSay + "</b><span>Reels</span></div></div>" +
      "</div>" +
      (one ? '<a class="one-cikan" href="#/hatira/' + kac(one.id) + '"><span class="one-cikan-rozet">✨ Son hatıra</span><div class="one-cikan-kart"><div class="gorsel">' + gorselHTML(kapak(one), one.baslik, "hemen") + '</div><div class="one-cikan-yazi"><small>' + one.kat.emoji + " " + kac(one.kat.ad) + " · " + kac(one.tarihMetni) + "</small><h2>" + kac(one.baslik) + "</h2></div></div></a>" : "") +
      "</div></section>" +
      '<section class="kategori-bolum"><div class="kap"><div class="bolum-ust"><div><h2>Ne hatırlamak istersiniz?</h2><p>Bir kategori seçin, hatıralar önünüze dökülsün.</p></div><a href="#/kesfet">Tümünü keşfet →</a></div>' +
        '<div class="kategori-kaydir">' + KULLANILAN_KAT.map(function (k) {
          return '<a class="kategori-karti" href="#/kategori/' + kac(k.id) + '" style="--kat:' + kac(k.renk) + '"><span class="emoji" aria-hidden="true">' + k.emoji + "</span><span><b>" + kac(k.ad) + "</b><small>" + katSayisi(k.id) + " hatıra</small></span></a>";
        }).join("") + "</div></div></section>" +
      '<div class="kap duzen"><section id="akis" aria-label="Hatıra akışı">' +
        '<div class="akis-ust"><h2>Hatıra Akışı</h2><div class="sekme-grup" role="group" aria-label="Türe göre süz">' +
          [["hepsi", "Tümü"], ["foto", "Fotoğraflar"], ["reels", "Reels"]].map(function (t) {
            return '<button type="button" data-tur="' + t[0] + '" aria-pressed="' + (filtreTur === t[0]) + '">' + t[1] + "</button>";
          }).join("") + "</div></div>" +
        '<div class="akis" id="akis-liste"></div></section>' + yanPanelHTML() + "</div>";

    var kutu = $("#akis-liste");
    function listele() {
      var l = TUM.filter(function (h) { return filtreTur === "hepsi" || (filtreTur === "reels" ? h.reels : !h.reels); });
      akisKur(l, kutu);
    }
    $$(".sekme-grup button").forEach(function (b) {
      b.addEventListener("click", function () {
        filtreTur = b.dataset.tur;
        $$(".sekme-grup button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        listele();
      });
    });
    listele();
    medyaBagla(main);
  }

  function sayfaListe(baslik, aciklama, liste, rozet) {
    main.innerHTML = '<div class="kap"><header class="sayfa-ust">' + (rozet || "") + "<h1>" + baslik + "</h1>" + (aciklama ? "<p>" + aciklama + "</p>" : "") + "</header></div>" +
      '<div class="kap duzen" style="padding-top:0"><section aria-label="Hatıralar"><div class="akis" id="akis-liste"></div></section>' + yanPanelHTML() + "</div>";
    akisKur(liste, $("#akis-liste"));
    medyaBagla(main);
  }

  function sayfaKategori(id) {
    var k = katBul(id);
    if (!k) return sayfaBulunamadi();
    var l = TUM.filter(function (h) { return h.kat.id === id; });
    sayfaListe(kac(k.ad), l.length + " hatıra", l, '<span class="ust-etiket" style="padding-left:12px">' + k.emoji + " Kategori</span>");
    document.title = k.ad + " — " + (A.siteAdi || "Geldi Geçti Hatıralar");
  }

  function sayfaEtiket(e) {
    var l = TUM.filter(function (h) { return h.etiketler.indexOf(e) !== -1; });
    sayfaListe("<em>#" + kac(e) + "</em>", l.length + " hatıra bu etiketle paylaşıldı.", l, '<span class="ust-etiket" style="padding-left:12px"># Etiket</span>');
    document.title = "#" + e + " — " + (A.siteAdi || "Geldi Geçti Hatıralar");
  }

  function sayfaKaydedilenler() {
    var l = kayitli.map(function (id) { return ID[id]; }).filter(Boolean);
    sayfaListe("Kaydettiklerim", l.length ? "Kaydettiğiniz hatıralar yalnızca bu cihazda saklanır." : "Bir hatırayı kaydetmek için kartındaki kaydet simgesine dokunun.", l, '<span class="ust-etiket" style="padding-left:12px">🔖 Kişisel</span>');
  }

  var kesfetDurum = { kat: "hepsi", ara: "" };
  var ORANLAR = ["1/1", "4/5", "1/1", "3/4", "5/4", "1/1", "4/5"];
  function sayfaKesfet() {
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><h1>Keşfet</h1><p>Bütün fotoğraflar tek bir duvarda. Kategoriye göre süzün ya da aradığınızı yazın.</p></header>' +
      '<div class="filtre-satiri"><button class="cip" type="button" data-kat="hepsi">Tümü</button>' +
      KULLANILAN_KAT.map(function (k) { return '<button class="cip" type="button" data-kat="' + kac(k.id) + '"><span aria-hidden="true">' + k.emoji + "</span>" + kac(k.ad) + "</button>"; }).join("") +
      '<label class="kesfet-ara"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><span class="gizli">Ara</span><input type="search" id="kesfet-ara" placeholder="Ara… (ör. vapur)" value="' + kac(kesfetDurum.ara) + '"></label></div>' +
      '<p class="sonuc-bilgi" id="sonuc-bilgi" aria-live="polite"></p><div class="duvar" id="duvar"></div></div>';
    function ciz() {
      $$(".filtre-satiri .cip").forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.kat === kesfetDurum.kat); });
      var q = sade(kesfetDurum.ara).trim();
      var l = TUM.filter(function (h) {
        return (kesfetDurum.kat === "hepsi" || h.kat.id === kesfetDurum.kat) && (!q || h.aranan.indexOf(q) !== -1);
      });
      $("#sonuc-bilgi").textContent = l.length ? l.length + " hatıra" : "";
      $("#duvar").innerHTML = l.length ? l.map(function (h, i) {
        var tip = h.reels ? IKON.reels : (h.gorseller.length > 1 ? IKON.album : "");
        return '<a class="duvar-oge" href="#/hatira/' + kac(h.id) + '" style="--oran:' + (h.reels ? "9/14" : ORANLAR[i % ORANLAR.length]) + ";animation-delay:" + Math.min(i, 8) * 40 + 'ms"><div class="gorsel">' + gorselHTML(kapak(h), h.baslik) + "</div>" +
          (tip ? '<span class="tur-ikon">' + tip + "</span>" : "") +
          '<div class="ortu"><small>' + h.kat.emoji + " " + kac(h.kat.ad) + "</small><b>" + kac(h.baslik) + "</b></div></a>";
      }).join("") : '<div class="bos" style="column-span:all"><b>Sonuç bulunamadı</b>Başka bir kelimeyle aramayı deneyin.</div>';
    }
    $$(".filtre-satiri .cip").forEach(function (c) { c.addEventListener("click", function () { kesfetDurum.kat = c.dataset.kat; ciz(); }); });
    $("#kesfet-ara").addEventListener("input", function (e) { kesfetDurum.ara = e.target.value; ciz(); });
    ciz();
  }

  function sayfaReels() {
    var l = TUM.filter(function (h) { return h.reels; });
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="ust-etiket"><i>' + IKON.ig + "</i>Instagram Reels</span><h1>Hareketli <em>hatıralar</em></h1><p>Videolarımızın kapakları ve hikâyeleri burada; izlemek için Instagram’a geçebilirsiniz.</p></header>" +
      (l.length ? '<div class="reels-izgara">' + l.map(function (h, i) {
        return '<a class="reel-kart" href="' + kac(h.instagram) + '" target="_blank" rel="noopener" style="animation-delay:' + Math.min(i, 8) * 50 + 'ms"><div class="gorsel">' + gorselHTML(kapak(h), h.baslik) + "</div>" +
          '<span class="izle" aria-hidden="true">' + IKON.oynat + "</span>" +
          '<div class="ortu"><div class="ust-satir"><span>' + h.kat.emoji + " " + kac(h.kat.ad) + "</span><span>" + kac(h.tarihMetni) + "</span></div><div><b>" + kac(h.baslik) + "</b><p>" + kac(h.ozet) + "</p></div></div></a>";
      }).join("") + "</div>" : '<div class="bos"><b>Henüz Reels eklenmedi</b></div>') + "</div>";
  }

  function sayfaHatira(id) {
    var h = ID[id];
    if (!h) return sayfaBulunamadi();
    var i = TUM.indexOf(h), onceki = TUM[i - 1], sonraki = TUM[i + 1];
    var benzer = TUM.filter(function (x) { return x !== h && x.kat.id === h.kat.id; });
    if (benzer.length < 4) benzer = benzer.concat(TUM.filter(function (x) { return x !== h && benzer.indexOf(x) === -1; }));
    benzer = benzer.slice(0, 4);
    function metinHTML(p) {
      return kac(p).replace(/\n/g, "<br>").replace(/#([0-9A-Za-zÇĞİÖŞÜçğıöşüÂâÎîÛû_]+)/g, function (_, e) { return '<a href="#/etiket/' + encodeURIComponent(kucuk(e)) + '">#' + e + "</a>"; });
    }
    main.innerHTML = '<div class="kap"><nav class="kirinti" aria-label="Konum"><a href="#/">Akış</a><span>›</span><a href="#/kategori/' + kac(h.kat.id) + '">' + kac(h.kat.ad) + "</a><span>›</span><span>" + kac(h.baslik) + "</span></nav>" +
      '<article class="detay"><div class="detay-medya">' + medyaHTML(h, true) + "</div>" +
      '<div class="detay-yazi"><div class="meta">' + katRozet(h.kat) + '<time datetime="' + kac(h.tarih) + '">' + kac(h.tarihMetni) + "</time><span>· " + turBilgi(h).replace(/<svg[\s\S]*?<\/svg>/, "") + "</span></div>" +
      "<h1>" + kac(h.baslik) + "</h1>" +
      '<div class="metin">' + (h.paragraflar.length ? h.paragraflar.map(function (p) { return "<p>" + metinHTML(p) + "</p>"; }).join("") : "<p>" + kac(h.ozet) + "</p>") + "</div>" +
      (h.etiketler.length ? '<div class="etiketler">' + h.etiketler.map(function (e) { return '<a href="#/etiket/' + encodeURIComponent(e) + '">#' + kac(e) + "</a>"; }).join("") + "</div>" : "") +
      '<div class="detay-eylem"><a class="btn btn-ig" href="' + kac(h.instagram) + '" target="_blank" rel="noopener">' + IKON.ig + (h.reels ? "Instagram’da İzle" : "Instagram’da Gör") + "</a>" +
      '<button class="btn btn-cizgi" type="button" data-paylas="' + kac(h.id) + '">' + IKON.paylas + "Paylaş</button>" +
      '<button class="btn btn-cizgi" type="button" data-kaydet="' + kac(h.id) + '" aria-pressed="' + kayitliMi(h.id) + '">' + IKON.kaydet + '<span data-kaydet-yazi>' + (kayitliMi(h.id) ? "Kaydedildi" : "Kaydet") + "</span></button></div>" +
      '<nav class="gezinme" aria-label="Diğer hatıralar">' +
        (onceki ? '<a href="#/hatira/' + kac(onceki.id) + '"><small>← Daha yeni</small><b>' + kac(onceki.baslik) + "</b></a>" : "<span></span>") +
        (sonraki ? '<a class="sonraki" href="#/hatira/' + kac(sonraki.id) + '"><small>Daha eski →</small><b>' + kac(sonraki.baslik) + "</b></a>" : "") +
      "</nav></div></article>" +
      '<section class="benzer"><div class="bolum-ust"><h2>Benzer hatıralar</h2><a href="#/kategori/' + kac(h.kat.id) + '">Tümü →</a></div><div class="benzer-izgara">' +
      benzer.map(function (b) {
        return '<a class="benzer-kart" href="#/hatira/' + kac(b.id) + '" style="--kat:' + kac(b.kat.renk) + '"><div class="gorsel">' + gorselHTML(kapak(b), b.baslik) + '</div><div class="yazi"><small>' + b.kat.emoji + " " + kac(b.kat.ad) + "</small><b>" + kac(b.baslik) + "</b></div></a>";
      }).join("") + "</div></section></div>";
    medyaBagla(main);
    document.title = h.baslik + " — " + (A.siteAdi || "Geldi Geçti Hatıralar");
  }

  function sayfaHakkimizda() {
    var eposta = A.eposta;
    var gonderLink = eposta ? "mailto:" + eposta + "?subject=" + encodeURIComponent("Hatıram") : "https://ig.me/m/" + IG;
    main.innerHTML = '<div class="kap"><header class="sayfa-ust"><span class="ust-etiket" style="padding-left:12px">🕰️ Hikâyemiz</span><h1>Geldi geçti, <em>hatıra oldu.</em></h1></header>' +
      '<div class="hakkinda"><div class="metin">' + (A.hakkimizda || []).map(function (p) { return "<p>" + kac(p) + "</p>"; }).join("") +
      '<div class="btn-grup" style="margin-top:26px"><a class="btn btn-ig" href="' + IG_PROFIL + '" target="_blank" rel="noopener">' + IKON.ig + "Instagram’da Takip Et</a><a class=\"btn btn-cizgi\" href=\"#/\">Akışa dön</a></div></div>" +
      '<aside class="gonder-kart"><h2>💌 Hatıranı Gönder</h2><p>Eski bir fotoğrafınız, anlatmak istediğiniz bir hatıranız mı var? Bize gönderin; seçilen hatıralar sitemizde ve Instagram sayfamızda yayımlansın.</p>' +
      '<a class="btn btn-marka" href="' + kac(gonderLink) + '" target="_blank" rel="noopener">' + (eposta ? "E-posta ile gönder" : "Instagram’dan mesaj gönder") + "</a>" +
      '<a class="btn btn-cizgi" href="' + IG_PROFIL + '" target="_blank" rel="noopener">@' + kac(IG) + "</a></aside></div></div>";
    document.title = "Hakkımızda — " + (A.siteAdi || "Geldi Geçti Hatıralar");
  }

  function sayfaBulunamadi() {
    main.innerHTML = '<div class="kap" style="padding:80px 24px 120px"><div class="bos"><b>Bu hatıra da geldi geçti…</b>Aradığınız sayfa bulunamadı.<br><a class="btn btn-koyu" href="#/">Akışa dön</a></div></div>';
  }

  /* ---------- Yönlendirme ---------- */
  var sonRota = null;
  function yonlendir() {
    var h = location.hash || "#/";
    if (h.indexOf("#/") !== 0) return; // sayfa içi bağlantı (#akis gibi)
    var parca = h.slice(2).split("/");
    var rota = parca[0] || "akis";
    var arg = parca[1] ? decodeURIComponent(parca[1]) : "";
    document.title = SAYFA_BASLIGI;
    if (gozlemci) { gozlemci.disconnect(); gozlemci = null; }
    switch (rota) {
      case "akis": sayfaAkis(); break;
      case "kesfet": sayfaKesfet(); break;
      case "reels": sayfaReels(); break;
      case "kategori": sayfaKategori(arg); break;
      case "etiket": sayfaEtiket(kucuk(arg)); break;
      case "hatira": sayfaHatira(arg); break;
      case "kaydedilenler": sayfaKaydedilenler(); break;
      case "hakkimizda": sayfaHakkimizda(); break;
      default: sayfaBulunamadi();
    }
    var menuRota = { akis: "akis", kesfet: "kesfet", reels: "reels", kaydedilenler: "kaydedilenler", hakkimizda: "hakkimizda" }[rota];
    $$(".ana-menu a").forEach(function (a) { a.classList.toggle("aktif", a.dataset.rota === menuRota); });
    menuKapat();
    if (sonRota !== null) window.scrollTo(0, 0);
    sonRota = h;
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
    var k = e.target.closest("[data-kaydet]");
    if (k) {
      var id = k.dataset.kaydet, durum = kayitDegistir(id);
      $$('[data-kaydet="' + id + '"]').forEach(function (x) {
        x.setAttribute("aria-pressed", durum);
        var y = $("[data-kaydet-yazi]", x);
        if (y) y.textContent = durum ? "Kaydedildi" : "Kaydet";
      });
      bildir(durum ? "Kaydettiklerinize eklendi 🔖" : "Kaydettiklerinizden çıkarıldı");
      return;
    }
    var p = e.target.closest("[data-paylas]");
    if (p) {
      var h = ID[p.dataset.paylas];
      var url = location.href.split("#")[0] + "#/hatira/" + h.id;
      if (navigator.share) {
        navigator.share({ title: h.baslik, text: h.baslik + " — Geldi Geçti Hatıralar", url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () { bildir("Bağlantı kopyalandı 🔗"); }, function () { window.prompt("Bağlantıyı kopyalayın:", url); });
      } else {
        window.prompt("Bağlantıyı kopyalayın:", url);
      }
    }
  });

  var menuBtn = $("#menu-btn"), menu = $("#ana-menu");
  function menuKapat() { menu.classList.remove("acik"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var acik = menu.classList.toggle("acik");
    menuBtn.setAttribute("aria-expanded", acik);
  });

  var araBtn = $("#ara-btn"), araPanel = $("#arama-paneli"), araKutu = $("#arama");
  araBtn.addEventListener("click", function () {
    var ac = araPanel.hidden;
    araPanel.hidden = !ac;
    araBtn.setAttribute("aria-expanded", ac);
    if (ac) araKutu.focus();
  });
  araKutu.addEventListener("input", function () {
    kesfetDurum.ara = araKutu.value;
    kesfetDurum.kat = "hepsi";
    if (location.hash !== "#/kesfet") location.hash = "#/kesfet";
    else { var k = $("#kesfet-ara"); if (k) { k.value = araKutu.value; k.dispatchEvent(new Event("input")); } }
  });

  $("#tema-btn").addEventListener("click", function () {
    var kok = document.documentElement;
    var simdi = kok.getAttribute("data-tema") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "koyu" : "acik");
    var yeni = simdi === "koyu" ? "acik" : "koyu";
    kok.setAttribute("data-tema", yeni);
    try { localStorage.setItem("ggh-tema", yeni); } catch (e) {}
  });

  var ust = $("#ust");
  window.addEventListener("scroll", function () { ust.classList.toggle("golgeli", window.scrollY > 8); }, { passive: true });

  $$("[data-ig-profil]").forEach(function (a) { a.href = IG_PROFIL; });
  $$("[data-ig-ad]").forEach(function (a) { a.textContent = "@" + IG; });
  $$("[data-yil]").forEach(function (s) { s.textContent = new Date().getFullYear(); });
  $$("[data-slogan]").forEach(function (s) { if (A.slogan) s.textContent = A.slogan + "."; });

  window.addEventListener("hashchange", yonlendir);
  yonlendir();
})();
