#!/usr/bin/env python3
"""Descarrega as tiles de Messejana para dentro do repo, para o mapa funcionar
sem internet.

Corre-se UMA vez (e outra vez só se a área ou os zooms mudarem):

    python3 tools/baixar-tiles.py

Depois: git add tiles && git commit && git push.

Porque é que isto é um script e não algo que o Albano corre sozinho: o sandbox
do Cowork tem os CDNs de tiles bloqueados pelo proxy. Só a tua máquina lhes
chega. É um comando, demora menos de um minuto.

ATRIBUIÇÃO E BOM SENSO
Os dados são © OpenStreetMap (ODbL) e o desenho © CARTO — a atribuição já está
visível no canto do mapa e tem de lá continuar. Estamos a falar de ~1 km² de
uma vila de 800 habitantes descarregado uma vez, não de raspar uma região: é
uso razoável, e o script anda devagar de propósito para não incomodar ninguém.
"""

import math
import os
import time
import urllib.error
import urllib.request

# Área a cobrir. Caixa à volta de Messejana com folga suficiente para os pontos
# de todas as categorias e para a estrada de entrada na vila.
LAT_MIN, LAT_MAX = 37.8255, 37.8400
LON_MIN, LON_MAX = -8.2530, -8.2350

# z14 = a vila inteira no ecrã · z18 = ao nível da porta de casa.
ZOOM_MIN, ZOOM_MAX = 14, 18

URL = "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
DESTINO = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "tiles")
PAUSA = 0.12  # segundos entre pedidos — não martelar o servidor


def tile_de(lat, lon, z):
    """Converte lat/lon em coordenadas de tile (esquema Web Mercator/XYZ)."""
    n = 2.0 ** z
    x = int((lon + 180.0) / 360.0 * n)
    rad = math.radians(lat)
    y = int((1.0 - math.asinh(math.tan(rad)) / math.pi) / 2.0 * n)
    return x, y


def main():
    total = descarregadas = existentes = falhadas = 0

    for z in range(ZOOM_MIN, ZOOM_MAX + 1):
        x0, y0 = tile_de(LAT_MAX, LON_MIN, z)   # canto noroeste
        x1, y1 = tile_de(LAT_MIN, LON_MAX, z)   # canto sudeste
        print(f"zoom {z}: {(x1 - x0 + 1) * (y1 - y0 + 1)} tiles")

        for x in range(x0, x1 + 1):
            for y in range(y0, y1 + 1):
                total += 1
                caminho = os.path.join(DESTINO, str(z), str(x), f"{y}.png")
                if os.path.exists(caminho):
                    existentes += 1
                    continue
                os.makedirs(os.path.dirname(caminho), exist_ok=True)
                pedido = urllib.request.Request(
                    URL.format(z=z, x=x, y=y),
                    headers={"User-Agent": "welcome-buinho/1.0 (Buinho FabLab, Messejana; buinho.eu)"},
                )
                try:
                    with urllib.request.urlopen(pedido, timeout=30) as r:
                        dados = r.read()
                    with open(caminho, "wb") as f:
                        f.write(dados)
                    descarregadas += 1
                    time.sleep(PAUSA)
                except (urllib.error.URLError, OSError) as e:
                    # Uma tile em falta faz um quadrado cinzento, não parte a app.
                    falhadas += 1
                    print(f"  falhou {z}/{x}/{y}: {e}")

    tamanho = sum(
        os.path.getsize(os.path.join(raiz, f))
        for raiz, _, fs in os.walk(DESTINO) for f in fs
    ) if os.path.isdir(DESTINO) else 0

    print(
        f"\n{total} tiles · {descarregadas} novas · {existentes} já cá estavam · "
        f"{falhadas} falhadas\npasta tiles/: {tamanho / 1_048_576:.1f} MB"
    )
    if falhadas:
        print("Corre outra vez para tentar as que falharam (as boas não se repetem).")


if __name__ == "__main__":
    main()
