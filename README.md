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
- **Instalável e offline a sério — mapa incluído.** Depois da 1.ª visita com rede,
  a app abre em modo avião: textos, contactos e o mapa de Messejana com os pins.
  Zero pedidos a terceiros — fontes, motor do mapa e tiles vivem dentro do repo.
  Pensado para quem aterra em Beja com o SIM de casa e o roaming desligado.

### Editar CONTEÚDOS (sem programar)
Todo o texto está em **`js/content.js`**. Cada texto tem versão `en` e `pt`. Muda o
texto entre aspas, mantém vírgulas e parêntesis. Preenche os campos marcados com
`[•••]` (morada, Wi-Fi, telefones). Depois de editar, faz commit / upload — e é só.

> **Já não é preciso subir o número do `CACHE` à mão.** O service worker passou a ser
> rede-primeiro: quem tiver rede vê sempre a versão mais recente, e a cache serve só
> para quando não há rede. Antes era cache-primeiro, e um telemóvel que já tivesse a
> app ficava preso à morada velha até alguém se lembrar desse passo manual.

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

### O MAPA OFFLINE — o único passo manual
As imagens do mapa (tiles) vivem em `tiles/`. Se essa pasta estiver vazia, o mapa
funciona na mesma **mas só com internet**. Para o pôr a funcionar em modo avião,
corre uma vez, a partir da raiz do repo:

```bash
python3 tools/baixar-tiles.py
git add tiles && git commit -m "chore: tiles offline de Messejana" && git push
```

São ~270 imagens, à volta de 3 MB, zoom 14 a 18 sobre a vila. Demora menos de um
minuto. Repetir só se a área ou os zooms mudarem (constantes no topo do script).

Fora da área descarregada, e estando offline, o mapa mostra cinzento em vez de
quadrados pretos. Havendo rede, vai buscar ao CARTO como antes.

*Atribuição:* dados © OpenStreetMap (ODbL), desenho © CARTO. O crédito está visível
no canto do mapa e tem de lá ficar, também na cópia offline.

### Backend (v1.1 — opcional)
Check-in e reservas produzem hoje um **email pronto a enviar**. Para recepção
automática: ligar um micro-backend Flask (`/api/checkin`, `/api/reserve`) com escrita
em SQLite ou no calendário partilhado. Um editor visual dos spots dentro da app é
também da fase com backend.

### Stack & deploy
HTML + CSS + JS vanilla, sem build step. Serve como **site estático** / GitHub Pages
(caminhos relativos — funciona no subcaminho `/welcome-buinho/`). Ficheiros:
`index.html` · `css/styles.css` · `css/fonts.css` · `js/content.js` · `js/spots.js` ·
`js/app.js` · `manifest.webmanifest` · `service-worker.js` · `tools/kml_to_spots.py` ·
`tools/baixar-tiles.py`.

Servidos localmente, de propósito (nunca de CDN): `fonts/` (Asap variável, SIL OFL) ·
`vendor/leaflet/` (Leaflet 1.9.4, BSD-2) · `tiles/` (mapa de Messejana).

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

**Genuinely offline, map included.** Fonts, map engine and map tiles are all served
from the repo — no third-party requests at all — so the app opens in airplane mode
after the first visit. Tiles are not in git by default: run `python3 tools/baixar-tiles.py`
once and commit the `tiles/` folder (~270 tiles, ~3 MB, zooms 14–18 over the village).
Map data © OpenStreetMap (ODbL), style © CARTO — attribution stays visible offline too.

Static site / GitHub Pages, relative paths, CC-BY-SA 4.0 · Buinho FabLab, Messejana, Alentejo.
