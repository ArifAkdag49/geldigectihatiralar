#!/usr/bin/env node
/* ==========================================================
   INSTAGRAM YEDEĞİNİ SİTEYE AKTARMA ARACI
   ----------------------------------------------------------
   Instagram > Hesaplar Merkezi > Bilgilerinizi indirin > JSON biçiminde
   indirilen yedekteki gönderileri ve Reels'ları siteye aktarır:
     • Yazıları (açıklamaları) alır
     • Fotoğrafları  medya/ klasörüne kopyalar
     • Reels ve videolar için kapak görseli çıkarır (ffmpeg gerekir)
     • veri/icerik.js dosyasını yeniden oluşturur

   Kullanım:
     node araclar/instagram-aktar.js <yedek-klasörü veya yedek.zip> [--cikis <site-klasörü>]

   Daha önce icerik.js içine elle eklenen "instagram" bağlantıları ve
   "kategori" seçimleri korunur.
   ========================================================== */
"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const { execFileSync, spawnSync } = require("child_process");

const argv = process.argv.slice(2);
if (!argv.length || argv.includes("-h") || argv.includes("--help")) {
  console.log("Kullanım: node araclar/instagram-aktar.js <yedek-klasörü veya yedek.zip> [--cikis <site-klasörü>]");
  process.exit(argv.length ? 0 : 1);
}
const ci = argv.indexOf("--cikis");
const SITE = path.resolve(ci !== -1 ? argv[ci + 1] : path.join(__dirname, ".."));
let KAYNAK = path.resolve(argv.filter((a, i) => a !== "--cikis" && argv[i - 1] !== "--cikis")[0]);

const FOTO_UZANTI = /\.(jpe?g|png|webp|gif|heic)$/i;
const VIDEO_UZANTI = /\.(mp4|mov|m4v|webm)$/i;
const FFMPEG = spawnSync("ffmpeg", ["-version"]).status === 0;

/* ---------- ZIP ise aç ---------- */
if (/\.zip$/i.test(KAYNAK)) {
  const hedef = fs.mkdtempSync(path.join(os.tmpdir(), "ig-yedek-"));
  console.log("ZIP açılıyor…");
  try { execFileSync("unzip", ["-q", "-o", KAYNAK, "-d", hedef]); }
  catch (e) { console.error("ZIP açılamadı. Dosyayı elle açıp klasörü verin."); process.exit(1); }
  KAYNAK = hedef;
}
if (!fs.existsSync(KAYNAK)) { console.error("Bulunamadı: " + KAYNAK); process.exit(1); }

/* ---------- Yardımcılar ---------- */
function tumDosyalar(kok) {
  const sonuc = [];
  (function gez(d) {
    for (const ad of fs.readdirSync(d)) {
      const p = path.join(d, ad);
      const st = fs.statSync(p);
      if (st.isDirectory()) gez(p); else sonuc.push(p);
    }
  })(kok);
  return sonuc;
}
// Meta yedekleri Türkçe karakterleri bozuk kodlar ("Ã§" gibi). Düzelt.
function duzelt(s) {
  if (!s) return "";
  s = String(s);
  if (/[Ā-￿]/.test(s)) return s; // zaten doğru
  try {
    const d = Buffer.from(s, "latin1").toString("utf8");
    return d.includes("�") ? s : d;
  } catch (e) { return s; }
}
const TR = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u", â: "a", î: "i", û: "u" };
function kisaAd(m) {
  return String(m || "").replace(/[çğıİöşüÇĞÖŞÜâîû]/g, (c) => TR[c]).toLowerCase()
    .replace(/#[^\s#]+/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "hatira";
}
function tarih(ts) {
  const d = new Date((ts || 0) * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function bul(dosyalar, uri) {
  if (!uri) return null;
  const norm = uri.replace(/\\/g, "/");
  const tam = path.join(KAYNAK, norm);
  if (fs.existsSync(tam)) return tam;
  return dosyalar.find((f) => f.replace(/\\/g, "/").endsWith("/" + norm)) ||
         dosyalar.find((f) => path.basename(f) === path.basename(norm)) || null;
}

/* ---------- Mevcut elle yapılan düzenlemeleri oku ---------- */
const ICERIK_YOLU = path.join(SITE, "veri", "icerik.js");
const eskiAyar = {};
if (fs.existsSync(ICERIK_YOLU)) {
  try {
    const kum = { window: {} };
    vm.runInNewContext(fs.readFileSync(ICERIK_YOLU, "utf8"), kum);
    (kum.window.ICERIK || []).forEach((h) => { if (h.kaynak) eskiAyar[h.kaynak] = { instagram: h.instagram, kategori: h.kategori, baslik: h.baslik }; });
  } catch (e) { /* yoksay */ }
}

/* ---------- Yedeği oku ---------- */
const dosyalar = tumDosyalar(KAYNAK);
const gonderiJson = dosyalar.filter((f) => /(^|[\\/])posts_\d+\.json$/i.test(f));
const reelsJson = dosyalar.filter((f) => /(^|[\\/])reels\.json$/i.test(f));
if (!gonderiJson.length && !reelsJson.length) {
  console.error("Yedekte posts_1.json ya da reels.json bulunamadı.\nYedeği JSON biçiminde indirdiğinizden emin olun.");
  process.exit(1);
}

const kayitlar = [];
function ekle(medyalar, baslikMetni, ts, tur) {
  const ilk = medyalar[0] || {};
  const metin = duzelt(baslikMetni || ilk.title || "");
  const zaman = ts || ilk.creation_timestamp || 0;
  kayitlar.push({ medyalar, metin, zaman, tur, kaynak: path.basename(ilk.uri || String(zaman)) });
}
for (const f of gonderiJson) {
  let veri = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!Array.isArray(veri)) veri = veri.ig_posts || veri.posts || [];
  for (const g of veri) {
    const medya = g.media || [];
    if (!medya.length) continue;
    const videoMu = medya.length === 1 && VIDEO_UZANTI.test(medya[0].uri || "");
    ekle(medya, g.title, g.creation_timestamp, videoMu ? "reels" : medya.length > 1 ? "albüm" : "foto");
  }
}
for (const f of reelsJson) {
  const veri = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const r of veri.ig_reels_media || veri.reels || []) ekle(r.media || [], r.title, r.creation_timestamp, "reels");
}

/* ---------- Medyaları kopyala ---------- */
const MEDYA = path.join(SITE, "medya");
fs.mkdirSync(MEDYA, { recursive: true });
let fotoSay = 0, kapakSay = 0, atlanan = 0;
const kullanilanId = new Set();

const cikti = kayitlar.sort((a, b) => b.zaman - a.zaman).map((k) => {
  const gun = tarih(k.zaman);
  const klasor = path.join(MEDYA, gun.slice(0, 7));
  fs.mkdirSync(klasor, { recursive: true });
  const gorseller = [];
  for (const m of k.medyalar) {
    const kaynak = bul(dosyalar, m.uri);
    if (!kaynak) { atlanan++; continue; }
    const ad = path.basename(kaynak);
    if (FOTO_UZANTI.test(ad)) {
      fs.copyFileSync(kaynak, path.join(klasor, ad));
      gorseller.push("medya/" + gun.slice(0, 7) + "/" + ad);
      fotoSay++;
    } else if (VIDEO_UZANTI.test(ad)) {
      // Video sitede oynatılmaz; kapak görseli çıkarılır, izlemek için Instagram'a gidilir.
      const kapak = ad.replace(VIDEO_UZANTI, "-kapak.jpg");
      const hedef = path.join(klasor, kapak);
      if (FFMPEG) {
        const r = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "1", "-i", kaynak, "-frames:v", "1", "-q:v", "3", "-vf", "scale='min(1080,iw)':-2", hedef]);
        if (r.status !== 0 || !fs.existsSync(hedef)) spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-i", kaynak, "-frames:v", "1", "-q:v", "3", hedef]);
      }
      if (fs.existsSync(hedef)) { gorseller.push("medya/" + gun.slice(0, 7) + "/" + kapak); kapakSay++; }
      else atlanan++;
    }
  }
  const ilkSatir = (k.metin.split("\n")[0] || "").trim();
  let id = kisaAd(ilkSatir || k.metin) ;
  if (id === "hatira" || id.length < 3) id = "hatira-" + gun;
  let aday = id, n = 2;
  while (kullanilanId.has(aday)) aday = id + "-" + n++;
  kullanilanId.add(aday);
  const eski = eskiAyar[k.kaynak] || {};
  const kayit = { id: aday, tarih: gun, tur: k.tur, kaynak: k.kaynak, gorseller, instagram: eski.instagram || "", metin: k.metin };
  if (eski.kategori) kayit.kategori = eski.kategori;
  if (eski.baslik) kayit.baslik = eski.baslik;
  return kayit;
}).filter((k) => k.gorseller.length || k.metin);

/* ---------- icerik.js yaz ---------- */
const bas = `/* ==========================================================
   HATIRALAR (İÇERİK) — Instagram yedeğinden otomatik oluşturuldu
   Oluşturma: ${new Date().toLocaleString("tr-TR")}
   Her kayıtta "instagram" alanına gönderinin Instagram bağlantısını
   (ör. https://www.instagram.com/p/XXXX/) yazabilirsiniz; boş kalırsa
   profil sayfasına gider. Aracı yeniden çalıştırınca bu bağlantılar korunur.
   ========================================================== */
`;
fs.mkdirSync(path.dirname(ICERIK_YOLU), { recursive: true });
fs.writeFileSync(ICERIK_YOLU, bas + "window.ICERIK = " + JSON.stringify(cikti, null, 2) + ";\n", "utf8");

console.log("✔ Aktarım tamam");
console.log("  Hatıra sayısı : " + cikti.length + " (" + cikti.filter((k) => k.tur === "reels").length + " Reels)");
console.log("  Fotoğraf      : " + fotoSay);
console.log("  Reels kapağı  : " + kapakSay + (FFMPEG ? "" : "  (ffmpeg bulunamadı, kapak çıkarılamadı)"));
if (atlanan) console.log("  Atlanan medya : " + atlanan);
console.log("  Yazılan dosya : " + path.relative(process.cwd(), ICERIK_YOLU));
