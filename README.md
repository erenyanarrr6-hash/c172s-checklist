# C172S Checklist Trainer

Cessna 172S NAV III (G1000) POH 2020 kaynaklı **boşluk doldurma** formatında ezber
çalışma uygulaması. Çoktan seçmeli soru yoktur — her maddeyi boş kutuya yazarsın,
cevabı görürsün ve kendini işaretlersin.

## Modlar

**Ezber Kağıdı** — 49 memory item, 13 normal checklist ve 39 hız/limit değeri tek
sayfada. "Cevapları Gizle" ile sağ taraf kapanır, satıra dokununca açılır — sınavdan
önceki son tekrar için.

**Çalışma Modu** — üç kategori ayrı ayrı:
- Emergency (POH Bölüm 3 — **yalnızca memory item'lar**, yani POH'ta koyu yazılan
  ezberlenmesi zorunlu adımlar; POH bold taraması ile doğrulandı)
- Normal (POH Bölüm 4 normal checklistler)
- Hız & Limit (V-hızları, ağırlık ve motor limitleri) + "Karışık Deste" seçeneği

Checklist/prosedür maddelerinde üç çalışma biçimi var (seçim hatırlanır):
- **SIRALA** — adımlar karışık kutucuklar halinde havuzda; dokunarak doğru sıraya dizersin
- **AKSİYON** — sol tarafta madde adları sırayla yazılı, aksiyonları (OFF, RICH, IDLE CUTOFF…) yerleştirirsin
- **YAZ** — klasik boşluk doldurma: yaz, cevabı gör, kendini işaretle

Yerleştirme modlarında kontrol otomatiktir (sıra/eşleşme birebir karşılaştırılır);
12'den uzun checklistler 8 adımlık bölümlere ayrılır. Hız & Limit kartlarında
yazma korunur, sayısal cevaplarda telefonda sayı klavyesi açılır.

**Sınav Modu** — 20 dakika, 14 soru (3 emergency + 3 normal + 8 hız/limit),
sınav sırasında hiçbir geri bildirim yok. Bitince tüm sorular cevap anahtarıyla
gelir, her birini kendin işaretlersin, kategori bazlı skor çıkar.

## İlerleme

Her madde için `{ seen, wrong }` sayacı `localStorage`'da tutulur.
Hata oranı yüksek maddeler listelerde üste çıkar, karışık destede iki kat sık
gelir ve sınavda seçilme ağırlığı artar.

## PWA

`manifest.json` + `sw.js` ile iPhone'da Safari → Paylaş → **Ana Ekrana Ekle**
ile tam ekran uygulama gibi çalışır; uygulama kabuğu önbelleğe alındığı için
internetsiz de açılır.

## Yapı

```
index.html    uygulama kabuğu
styles.css    koyu kokpit/avionics teması
data.js       POH verisi (EMERGENCY / NORMAL / SPEEDS / CATEGORY_LABELS)
app.js        çalışma + sınav mantığı, ilerleme takibi
sw.js         service worker (offline)
manifest.json PWA manifesti
icons/        uygulama ikonları
```

Arayüz sınav kağıdı gibi beyaz temalıdır; memory item'lar fosforlu kalem vurgusuyla
işaretlidir. Prosedür metinleri POH orijinali olduğu için İngilizce bırakılmıştır.

POH'ta hiç koyu adımı olmayan 4 prosedür (Emergency Landing Without Engine Power,
Precautionary Landing With Engine Power, Ditching, Excessive Fuel Vapor) çalışma
listesinde yer almaz; Ezber Kağıdı'nda ayrı bir başlık altında listelenir.
