# Fotorealistischer Lernweg

Die Startseite verwendet `assets/bpe6-alpine-learning-path.webp` (1672 x 941).
Die vorherige Grafik bleibt als Asset erhalten. Nur die sichtbare Karte und
die Positionen ihrer interaktiven Stationen wurden ersetzt.

## Bildgenerierung

Erstellt mit dem integrierten Image-Generation-Werkzeug, nicht mit einer API
oder einem CLI-Fallback. Die Grafik stellt eine erfundene Landschaft dar.

Prompt: Photorealistic aerial mountain landscape with five progressively
larger contemporary European settlements, connected in sequence by one pale
stone road. Blue hamlet, mint-green village, golden small town, violet
university town, coral city. Natural daylight, sharply visible buildings,
river and mountain scenery. No labels, numbers, interface, castles, toy-like
metallic relief, blur or watermarks. Leave ground below settlements for
interactive labels.

Gezielte Bildkorrektur: Remove the foreground bridge and its connecting road
to the golden town, replacing them with natural terrain, to remove an
unwanted shortcut. Preserve the five settlements and upper sequential road.

Die generierte PNG-Datei wurde ohne Beschnitt oder Farbkorrektur als WebP
komprimiert. Die L1-L5-Beschriftungen bleiben HTML-Schaltflaechen; Farben,
Freischaltungen und Menues werden weiterhin vom bestehenden Lernpfad gesteuert.

## Pruefung

`tests/settlement-map.browser.cjs` prueft Bildladung, fuenf getrennte Stationen,
Freischaltung in Reihenfolge, Maus- und Touch-Menues, Navigation und horizontale
Ueberlaeufe bei 390, 1440 und 1920 Pixeln Breite.
