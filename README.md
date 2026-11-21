# Tribün sitesi: kurulum ve kullanım

Tek sayfalık bir 3D stadyum. **100.000 koltuk** (1.000'i loca). Takipçi listesindeki herkes geliş sırasıyla bir koltuğa oturur: **ilk 1.000 kişi her zaman locada**.

## Başlangıç: renk oylaması
Stat ilk açıldığında **boyanmamış** (gri) durur. Reel'in altına herkes tuttuğu takımı yazar; en çok yorum alan takımın renkleri stada, koltuklara, cepheye, panolara ve formalara işlenir.
- Oylama sürerken taraftarlar **oy verilen renklerin formalarını** oy oranında giyer, dev ekranda ilk 3 görünür.
- Sayımı `kararlar.json` → `renkOylamasi` içindeki `oy` alanlarına yazıp dosyayı yüklersin.
- Kazanan belli olunca `"renk": {"ad":"Sarı-Kırmızı","ana":"#A90432","ikinci":"#FDB912"}` yaz. Stat kalıcı olarak boyanır.
- `renk` alanını ve `renkOylamasi` listesini tamamen silersen site `AYAR.renk` marka renkleriyle açılır.

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sitenin tamamı. Marka, renk ve hesap adı en üstteki `AYAR` bloğunda |
| `takipciler.json` | `{"guncelleme":"2026-11-21T18:15:00+03:00","isimler":["ilk_gelen","ikinci",...],"kaldirilan":["koltugunu_kaldirtan"]}`. Sıra = geliş sırası. **Dosya yoksa site demo isimlerle çalışır** |
| `kararlar.json` | `renk`, `renkOylamasi` (ad, takim, ana, ikinci, oy), `locaHakki` (ilk kaç kişi locada, en fazla ~1.600), stadyum adı, takım adı, arma görseli, ilk 11 (`"kullanici#9"` = forma no), sıradaki karar, hedef, koreografi yazısı |
| `stad.json` | Hangi katlar açık / inşaatta: `{"otomatik":true}` ya da `{"otomatik":false,"acik":[...],"insaat":[...]}` |
| `logo.png` | (isteğe bağlı) yuvarlak logo |

## Yayına alma (GitHub Pages)
1. Yeni bir depo aç, bu dosyaları yükle.
2. Settings → Pages → "Deploy from branch" → `main` / root.
3. `AYAR.hesap` değerine Instagram hesabını yaz.

## Bölüm kodları
`LOCA` (Kuzey loca), `LOCA2` (Güney loca), sonra her tribün için `1` = alt kat, `2` = üst kat:
`B` 5. Tribün (batı kale arkası) · `G` Güney · `K` Kuzey · `D` Doğu kale arkası · `GB` `GD` `KBK` `KDK` köşeler.

## Link parametreleri
| Parametre | Örnek | Etki |
|---|---|---|
| `acik` | `?acik=LOCA,LOCA2,B1,G1` | Bu katlar açık; yazılış sırası = açılış sırası (koltuk dağıtımı bu sırayla yapılır) |
| `insaat` | `&insaat=K1,D1` | Kapalı katın yerinde şantiye (beton iskelet, iskele, vinç, "YAKINDA" tabelası) |
| `otomatik` | `?otomatik=1` | Katlar taraftar sayısına göre kendiliğinden açılır, sıradaki kat inşaatta görünür |
| `renk` | `?renk=Sarı-Lacivert` ya da `?renk=0B2A6F-FFED00` | O renklerle önizleme. Oylama sürerken "statımız bu renklerde olsa" reel'i için |
| `loca` | `?loca=1500` | Loca hakkını denemek için geçici olarak değiştirir |
| `u` | `?u=kullaniciadi` | Doğrudan o kişinin koltuğuna uçar (Story linki bunu kullanır) |
| `n` | `?n=1000` | Statı ilk 1000 taraftarla gösterir ("1.000. taraftar" reel'i çekmek için) |
| `demo` | `?demo=30000` | 30.000 sahte isimle dener |
| `yonetim` | `?yonetim=1` | 🛠️ Yönetim paneli: tıkla aç/kapat, link kopyala, `stad.json` indir |

## Reel çekim reçeteleri
- **Renk turu:** 🎨 Renkler. Stat ilk 6 adayın renkleri arasında 4 saniyede bir değişir, kamera kendiliğinden döner. "Hangisi olsun?" reel'i.
- **Tek aday önizleme:** 🗳️ → Önizle ya da `?renk=...` linki.
- **Kat açılışı:** `?yonetim=1` → katı önce "İnşaat", sonra "Açık" yap. Ekranı kaydet.
- **Koreografi:** 🎨 Koreo. Yazı `kararlar.json` → `koreo` (yoksa takım adı).
- **Dalga:** 🌊 Dalga, kuş bakışından.
- **Işık şovu:** ✨ Işık Şovu. Telefon ışıkları ve projektörler yanıp söner.
- **"Senin koltuğun":** `?u=kullanici` → 👀 Koltuğumdan izle.
