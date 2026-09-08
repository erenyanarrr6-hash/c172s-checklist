# C172S Checklist Trainer

Cessna 172S NAV III (G1000) POH 2020 kaynaklı **boşluk doldurma** formatında ezber
çalışma uygulaması. Çoktan seçmeli soru yoktur — her maddeyi boş kutuya yazarsın,
cevabı görürsün ve kendini işaretlersin.

## Modlar

**Çalışma Modu** — üç kategori ayrı ayrı:
- Emergency (POH Bölüm 3 acil durum prosedürleri, memory item'lar `M` ile işaretli)
- Normal (POH Bölüm 4 normal checklistler)
- Hız & Limit (V-hızları, ağırlık ve motor limitleri) + "Karışık Deste" seçeneği

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

Prosedür metinleri POH orijinali olduğu için İngilizce bırakılmıştır; arayüz Türkçedir.
