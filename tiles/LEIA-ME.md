# tiles/

Esta pasta guarda as imagens do mapa de Messejana para o mapa funcionar **sem
internet**. Está vazia até alguém correr, a partir da raiz do repo:

```bash
python3 tools/baixar-tiles.py
```

São ~270 ficheiros (~3 MB), zoom 14 a 18, organizados em `{z}/{x}/{y}.png`.
Depois: `git add tiles && git commit && git push`.

**Com a pasta vazia a app não parte** — o mapa continua a funcionar, mas vai
buscar as imagens ao CARTO e portanto precisa de rede. Offline, mostra cinzento.

Dados © OpenStreetMap (ODbL) · desenho © CARTO. A atribuição está visível no
canto do mapa e tem de lá ficar.
