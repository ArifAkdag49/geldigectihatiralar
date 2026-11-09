# Geldi Geçti Hatıralar — Web Sitesi

Instagram’daki **@geldigecti_hatiralar** hesabının fotoğraflarını ve hatıra yazılarını yayınlayan site.
Site Instagram görünümünde değildir; kendine has, edebî bir tasarımı vardır.

Edebî bir hatıra almanağı gibi çalışır:

- **Bugün (ana sayfa):** Arkada eski fotoğraflardan oluşan tanıtım videosu, arama ve hatıra rafları;
  altında her gün değişen **takvim yaprağı** (günün sözü, geçmişte bugün, “yaprağı kopar”),
  **kaldığın yerden** (ziyaretçinin okuduğu hatıraları hatırlar), **bu ayın albümü**, öne çıkan hatıra,
  raflar, **hatıra arşivi** ve **geçen yıllarda bu ay**.
- **Aylık albümler:** Her ayın hatıraları bir albüm (dergi sayısı gibi). Arşivden geçmiş aylara gidilir.
- **Raflar (kategoriler), Keşfet (arama), etiket sayfaları.**
- **Okuma sayfası:** Fotoğraflar alt alta, yazı edebî düzende, Instagram’a bağlantı, önceki/sonraki sayfa.
- **Telefonda uygulama gibi:** yandan açılan menü, “Ana ekrana ekle” ile kurulabilir, bir kez açılan sayfalar
  internet yokken de okunur. Koyu/açık tema, yazı tipleri sitede barındırılır (Google’a bağlanmaz).

Kurulum gerekmez: düz HTML + CSS + JavaScript. Her web hostinginde (IONOS dahil) çalışır.

---

## Dosyalar

| Dosya / klasör | Ne işe yarar |
|---|---|
| `index.html` | Sitenin ana sayfası |
| `veri/ayarlar.js` | **Ayarlar:** Instagram adı, e-posta, tanıtım videosu, duyuru şeridi, Hakkımızda yazısı, kategoriler |
| `veri/icerik.js` | **Hatıralar:** bütün yazılar ve fotoğraf yolları |
| `veri/fotograf-kaynaklari.js` | Örnek fotoğrafların fotoğrafçı ve lisans bilgileri |
| `medya/` | Instagram’dan aktarılan fotoğraflar |
| `css/`, `js/`, `fontlar/`, `gorseller/` | Tasarım ve çalışma dosyaları |
| `araclar/instagram-aktar.js` | Instagram yedeğini siteye aktaran araç (sunucuya yüklemeye gerek yok) |
| `manifest.webmanifest`, `sw.js` | Telefonda “Ana ekrana ekle” ve internetsiz okuma |
| `.htaccess`, `404.html`, `robots.txt` | IONOS sunucu ayarları |

> Şu an `veri/icerik.js` içindeki yazılar **örnektir**. Fotoğraflar (`medya/ornek/`) Wikimedia Commons’tan
> serbest lisanslı gerçek eski fotoğraflardır; fotoğrafçı ve lisans adı her fotoğrafın altında ve
> “Fotoğraf kaynakları” sayfasında gösterilir. Ana sayfadaki `medya/tanitim.mp4` bu fotoğraflardan yapılmıştır.
> Instagram içeriğiniz aktarıldığında bunlara gerek kalmaz; kendi videonuzu `veri/ayarlar.js` içindeki
> `tanitimVideosu` satırından seçebilirsiniz.

## Bilgisayarda açıp bakmak

`index.html` dosyasına çift tıklamanız yeterli.

## Instagram içeriğini aktarmak

1. Instagram’da yedeği isteyin:
   **Profil → ☰ → Hesaplar Merkezi → Bilgileriniz ve izinleriniz → Bilgilerinizi indirin → Bilgileri cihaza aktar**
   → hesap: *geldigecti_hatiralar* → **Bazı bilgi türleri: Gönderiler, Reels**
   → **Tarih aralığı: Tüm zamanlar** → **Biçim: JSON** → **Medya kalitesi: Yüksek** → **Dosya oluştur**.
   (Doğrudan bağlantı: https://accountscenter.instagram.com/info_and_permissions/dyi/)
2. Hazır olunca ZIP’i indirin.
3. Aracı çalıştırın (Node.js ve Reels kapakları için ffmpeg gerekir):
   ```bash
   node araclar/instagram-aktar.js indirilen-yedek.zip
   ```
   Araç yazıları `veri/icerik.js`’e yazar, fotoğrafları `medya/` klasörüne kopyalar, Reels videolarından kapak görseli çıkarır.

Instagram yedeğinde gönderi bağlantıları yer almaz. “Instagram’da gör” düğmesi bu yüzden profil sayfasına gider.
Bir gönderinin doğrudan bağlantısını eklemek için `veri/icerik.js` içinde o kaydın `instagram` alanına
gönderinin adresini yazın (ör. `"https://www.instagram.com/p/ABC123/"`). Araç tekrar çalıştırılsa da bu bağlantılar korunur.

## Elle hatıra eklemek

`veri/icerik.js` dosyasında listenin en üstüne şu kalıpta bir kayıt ekleyin:

```js
{
  id: "yeni-hatira",
  tarih: "2026-11-08",
  tur: "foto",                       // "foto", "albüm" veya "reels"
  gorseller: ["medya/2026-11/foto1.jpg"],
  instagram: "https://www.instagram.com/p/XXXXXXX/",
  metin: `Başlık ilk satırdır

Yazının devamı… #nostalji #mahalle`
},
```

Kategori, yazıdaki kelimelere göre otomatik seçilir. Kategorileri `veri/ayarlar.js` içinden değiştirebilirsiniz.

---

## IONOS’ta yayına alma

### 1. Dosyaları indirin
GitHub’da depoyu açın → **Code → Download ZIP** → ZIP’i bilgisayarınızda açın.

### 2. Dosyaları IONOS’a yükleyin
**Yol A — Tarayıcıdan (en kolayı):**
1. ionos.com’a giriş yapın → **Menü → Hosting** → paketinizi seçin → **Webspace** (Webspace Explorer).
2. Yeni bir klasör oluşturun, ör. `geldigecti`.
3. Klasörün içine şunları yükleyin: `index.html`, `404.html`, `.htaccess`, `robots.txt`, `manifest.webmanifest`, `sw.js` ve `css`, `js`, `fontlar`, `gorseller`, `medya`, `veri` klasörleri.
   (`araclar` klasörünü ve `README.md`’yi yüklemeniz gerekmez.)
   Mac’te `.htaccess` gizli dosyadır; Finder’da **Cmd + Shift + .** ile görünür yapın.

**Yol B — FileZilla ile (çok dosya için hızlı):**
1. IONOS’ta **Hosting → SFTP & SSH** bölümünden sunucu adresini, kullanıcı adını ve şifreyi görün.
2. FileZilla’da: Sunucu `sftp://…webspace-host.com`, bağlantı noktası `22`, kullanıcı adı ve şifre → **Bağlan**.
3. Dosyaları `geldigecti` klasörüne sürükleyin.

> Şifrelerinizi kimseyle (sohbetlerde de) paylaşmayın.

### 3. Alan adını klasöre bağlayın
**Menü → Domains & SSL** → alan adınız → **Kullanım / Hedef (Destination)** → **Webspace** → klasör: `/geldigecti` → **Kaydet**.
Değişikliğin yayılması birkaç dakika ile bir saat arasında sürebilir.

### 4. SSL’i (https) açın
**Domains & SSL** → alan adınız → **SSL sertifikası** → etkinleştirin (IONOS paketlerinde ücretsizdir).
Etkinleşince `.htaccess` içindeki HTTPS yönlendirme satırlarının başındaki `#` işaretlerini kaldırıp dosyayı yeniden yükleyin.

### 5. Güncelleme
Yeni gönderilerden sonra aracı tekrar çalıştırın. Ardından yalnızca `veri/icerik.js` dosyasını ve `medya/` içindeki yeni fotoğrafları IONOS’a yükleyin.
