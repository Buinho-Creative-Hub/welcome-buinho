/* Welcome to Buinho — service worker
   Buinho FabLab, Messejana · CC-BY-SA 4.0

   OBJECTIVO: o artista aterra em Beja, apanha boleia para Messejana com o SIM de
   casa e o roaming desligado, e precisa da morada, do código do portão e do
   número de emergência. A app tem de abrir em modo avião. Tudo — fontes, mapa,
   motor do mapa — vive dentro do repo; não há um único pedido a terceiros.

   DOIS CACHES, de propósito:
   - SHELL (versionado): HTML/CSS/JS/fontes/ícones. Apagado a cada versão nova.
   - TILES (NÃO versionado): as imagens do mapa. Sobrevivem às actualizações —
     seria absurdo obrigar a redescarregar o mapa de Messejana só porque se
     corrigiu uma vírgula no content.js.

   ESTRATÉGIA — a lição que custou caro no Mundo Buinho (v9):
   o shell é REDE-PRIMEIRO. A versão anterior deste ficheiro era cache-primeiro
   em tudo, o que significa que a equipa editava o content.js, fazia commit, e os
   telemóveis que já tinham a app continuavam a mostrar a morada velha até alguém
   se lembrar de subir o número do CACHE à mão. Agora: se há rede, vê-se sempre o
   mais recente; a cache é só a rede de segurança para quando não há rede. */

const SHELL = 'buinho-welcome-shell-v5';
const TILES = 'buinho-welcome-tiles';      /* sem versão — ver acima */

const ESTATICOS = [
  './', './index.html',
  './css/styles.css', './css/fonts.css',
  './js/content.js', './js/spots.js', './js/app.js',
  './fonts/asap-latin-wght-normal.woff2',
  './fonts/asap-latin-ext-wght-normal.woff2',
  './vendor/leaflet/leaflet.css', './vendor/leaflet/leaflet.js',
  './vendor/leaflet/images/marker-icon.png',
  './vendor/leaflet/images/marker-shadow.png',
  './vendor/leaflet/images/layers.png',
  './vendor/leaflet/images/layers-2x.png',
  './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'
];

/* Tile cinzenta 1x1 para os buracos do mapa quando se navega para fora da área
   descarregada estando offline. Sem isto o Leaflet desenha quadrados pretos e
   parece que a app rebentou. */
const TILE_VAZIA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(SHELL)
      /* allSettled, não addAll: com addAll basta UM ficheiro em falta para a
         instalação inteira falhar em silêncio — e ficamos sem offline nenhum,
         sem aviso. Assim guarda-se o que existe. */
      .then(c => Promise.allSettled(ESTATICOS.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(ks => Promise.all(
        ks.filter(k => k !== SHELL && k !== TILES).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

function guardar(cache, req, resp) {
  if (resp && resp.status === 200) {
    const copia = resp.clone();
    caches.open(cache).then(c => c.put(req, copia)).catch(() => {});
  }
  return resp;
}

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* Tiles do mapa (locais ou, em último recurso, do CARTO): cache primeiro e
     para sempre. O mapa de uma vila de 800 habitantes não muda de semana para
     semana, e cada tile poupada é dados móveis que o artista não gasta. */
  const ehTile = /\/tiles\/.*\.png$/.test(url.pathname) ||
                 /basemaps\.cartocdn\.com/.test(url.hostname);
  if (ehTile) {
    ev.respondWith(
      caches.match(req).then(hit => hit ||
        fetch(req).then(r => guardar(TILES, req, r))
          .catch(() => fetch(TILE_VAZIA))
      )
    );
    return;
  }

  /* Só tratamos o próprio domínio daqui para baixo. */
  if (url.origin !== self.location.origin) return;

  /* Shell (navegação + JS/CSS): REDE PRIMEIRO, cache como rede de segurança. */
  const ehShell = req.mode === 'navigate' || /\.(?:js|css)(?:\?|$)/.test(url.pathname);
  if (ehShell) {
    ev.respondWith(
      fetch(req)
        .then(r => guardar(SHELL, req, r))
        .catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  /* Fontes, ícones, imagens do Leaflet: cache primeiro (não mudam, e carregam
     instantaneamente em vez de esperar pela rede fraca do Alentejo). */
  ev.respondWith(
    caches.match(req).then(hit => hit ||
      fetch(req).then(r => guardar(SHELL, req, r)).catch(() => hit))
  );
});
