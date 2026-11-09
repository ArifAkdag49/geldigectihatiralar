/* ==========================================================
   Geldi Geçti Hatıralar — çevrimdışı okuma
   Önce internetten en güncel hâli almaya çalışır; bağlantı yoksa
   daha önce görülmüş sayfa, yazı ve fotoğrafları önbellekten gösterir.
   Site güncellendiğinde ziyaretçiler her zaman yeni içeriği görür.
   ========================================================== */
var ONBELLEK = "ggh-v1";
var TEMEL = [
  "./", "index.html", "css/site.css", "js/uygulama.js", "js/ornek-gorseller.js",
  "veri/ayarlar.js", "veri/icerik.js", "veri/fotograf-kaynaklari.js",
  "gorseller/favicon.svg", "gorseller/ikon-192.png", "manifest.webmanifest"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(ONBELLEK).then(function (c) { return c.addAll(TEMEL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (adlar) {
    return Promise.all(adlar.filter(function (a) { return a !== ONBELLEK; }).map(function (a) { return caches.delete(a); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var istek = e.request;
  if (istek.method !== "GET" || new URL(istek.url).origin !== location.origin) return;
  // Video dosyaları parça parça istendiği için önbelleğe alınmaz
  if (/\.(mp4|webm|mov)$/i.test(new URL(istek.url).pathname)) return;
  e.respondWith(
    fetch(istek).then(function (yanit) {
      if (yanit && yanit.ok) {
        var kopya = yanit.clone();
        caches.open(ONBELLEK).then(function (c) { c.put(istek, kopya); });
      }
      return yanit;
    }).catch(function () {
      return caches.match(istek).then(function (o) { return o || caches.match("index.html"); });
    })
  );
});
