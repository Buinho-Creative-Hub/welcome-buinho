/* Offline cache do app shell da welcome-buinho (PWA).
   Sobe o número de CACHE sempre que mudares assets, para os clientes refrescarem.
   NB: o mapa (Leaflet + tiles CARTO) vem do CDN e precisa de internet — não se
   pré-cacheia; o resto do app abre offline após a 1.ª visita. */
const CACHE = 'buinho-welcome-v4';
const ASSETS = [
  './', './index.html', './css/styles.css',
  './js/content.js', './js/spots.js', './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(hit=> hit || fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(()=> caches.match('./index.html')))
  );
});
