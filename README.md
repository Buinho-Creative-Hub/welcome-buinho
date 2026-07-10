# Welcome to Buinho · AIR onboarding PWA

> **PT** primeiro · **EN** below · https://buinho.eu

Guia de bolso (PWA mobile-first) para artistas em residência no **Buinho FabLab**,
Messejana, Alentejo. Abre por QR code à chegada — sem instalação, funciona em iOS e
Android, e pode ser "instalada" no ecrã inicial.

**Online:** `welcome.buinho.pt` *(CNAME pendente)*

Direcção de design **B + azulejo** (Gris, aprovada pelo Carlos, 2026-07-10): índice
editorial numerado, cartão ESSENTIALS sempre no topo, e assinatura de azulejo
(motivos da Polina reconstruídos em SVG, na paleta Buinho Main).

### O que faz (v1)
- **Hub de informação curada:** como chegar, a casa e regras, o FabLab e equipamento,
  a semana, contactos e segurança, Messejana e arredores.
- **Mapa de Messejana:** mapa interactivo com marcadores por categoria (espaços Buinho,
  lojas, comer/café, saúde, multibanco, natureza) — cada um com um glifo com significado
  (café = chávena, loja = saco, etc.) numa tile de cor. Motor **Leaflet + tiles CARTO
  Positron** (open-source, **sem chave de API**, sem conta de facturação). Filtro por
  categoria e lista sincronizada com o mapa.
- **Camada interactiva:** check-in à chegada, e pedido de reserva de máquina.
  *(v1 entrega um email pronto a enviar à equipa; ver "Backend" abaixo.)*
- **Bilingue EN/PT** com botão de troca no topo.
- **Instalável + offline** (manifest + service worker). O mapa precisa de internet
  (tiles); o resto do app abre offline após a 1.ª visita.

### Editar CONTEÚDOS (sem programar)
Todo o texto está em **`js/content.js`**. Cada texto tem versão `en` e `pt`. Muda o
texto entre aspas, mantém vírgulas e parêntesis. Preenche os campos marcados com
`[•••]` (morada, Wi-Fi, telefones). Depois de editar, faz commit / upload — sobe o
número de `CACHE` em `service-worker.js` para forçar refresh em todos os telemóveis.

### Editar o MAPA (sem programar o mapa)
Os pontos do mapa vivem em **`js/spots.js`** — a "matriz" editável. Cada ponto tem
`id, cat, lat, lon, name{en,pt}, hours{en,pt}, note{en,pt}`.

**Corrigir um pin (5 segundos):** abre o Google Maps ou o openstreetmap.org, clica com
o botão direito no local exacto → copia os dois números (ex.: `37.8344, -8.2451`) e
cola o primeiro em `lat:` e o segundo em `lon:`. Os horários mudam-se no campo `hours`.

**Modo de edição da equipa (recomendado):** edita os pontos no Google My Maps
"Messejana for AIR", exporta KML e corre `tools/kml_to_spots.py` para gerar o
`spots.js` — aposenta o Google My Map antigo. As coordenadas actuais são pontos de
partida aproximados; vale validar cada pin uma vez.

### Backend (v1.1 — opcional)
Check-in e reservas produzem hoje um **email pronto a enviar**. Para recepção
automática: ligar um micro-backend Flask (`/api/checkin`, `/api/reserve`) com escrita
em SQLite ou no calendário partilhado. Um editor visual dos spots dentro da app é
também da fase com backend.

### Stack & deploy
HTML + CSS + JS vanilla, sem build step. Serve como **site estático** / GitHub Pages
(caminhos relativos — funciona no subcaminho `/welcome-buinho/`). Ficheiros:
`index.html` · `css/styles.css` · `js/content.js` · `js/spots.js` · `js/app.js` ·
`manifest.webmanifest` · `service-worker.js` · `tools/kml_to_spots.py`.

---

## EN — summary

Mobile-first PWA pocket guide for artists in residence at **Buinho FabLab**, Messejana,
Alentejo. Opens via QR code on arrival — no install, works on iOS/Android, installable
to the home screen. Design direction **B + azulejo** (approved 2026-07-10): numbered
editorial index, ESSENTIALS card on top, azulejo-tile signature in the Buinho Main palette.

**Content** is edited in `js/content.js` (bilingual EN/PT). **The map** is edited in
`js/spots.js` — each point has `id, cat, lat, lon, name, hours, note`; correct a pin by
right-clicking in Google/OSM and pasting the coordinates, or edit in Google My Maps and
run `tools/kml_to_spots.py`. Map engine: Leaflet + CARTO Positron tiles (no API key).
Static site / GitHub Pages, relative paths, CC-BY-SA 4.0 · Buinho FabLab, Messejana, Alentejo.
