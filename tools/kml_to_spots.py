#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
kml_to_spots.py — converte o Google My Maps "Messejana for AIR" no ficheiro `spots`
da app welcome-buinho. É o modo de edição do mapa para a equipa (sem programar o mapa):

  1. Edita os pontos no Google My Maps (arrastar, renomear, adicionar).
  2. Exporta:  ⋮  →  "Descarregar KML"  →  marca "Exportar para um ficheiro .KML"
     (ou usa o link:  https://www.google.com/maps/d/kml?mid=SEU_MID&forcekml=1 )
  3. Corre:  python3 kml_to_spots.py "Messejana for AIR.kml" > spots.js
  4. Dá o spots.js ao Albano (ou substitui o array SPOTS no HTML).

A CATEGORIA de cada ponto vem do nome, pela tabela CAT_RULES abaixo — ajusta à vontade.
Pontos de "Directions"/rotas são ignorados.
"""
import sys, re, xml.etree.ElementTree as ET

# nome (minúsculas, contém) -> categoria da app
CAT_RULES = [
    ("buinho",        "buinho"),
    ("casa",          "buinho"),
    ("house",         "buinho"),
    ("educativo",     "buinho"),
    ("grocery",       "shop"),
    ("mercearia",     "shop"),
    ("bakery",        "shop"),
    ("padaria",       "shop"),
    ("faustino",      "food"),
    ("caf",           "food"),
    ("restaur",       "food"),
    ("pharmac",       "health"),
    ("farmác",        "health"),
    ("estética",      "health"),
    ("masseuse",      "health"),
    ("therap",        "health"),
    ("atm",           "money"),
    ("multibanco",    "money"),
    ("pool",          "nature"),
    ("piscina",       "nature"),
    ("swimming",      "nature"),
    ("bus",           "services"),
    ("recycl",        "services"),
    ("workshop",      "services"),
]
DEFAULT_CAT = "shop"

def categorize(name):
    n = (name or "").lower()
    for key, cat in CAT_RULES:
        if key in n:
            return cat
    return DEFAULT_CAT

def slug(name, i):
    s = re.sub(r"[^a-z0-9]+", "", (name or "").lower())[:16]
    return s or f"spot{i}"

def main(path):
    ns = {"k": "http://www.opengis.net/kml/2.2"}
    tree = ET.parse(path); root = tree.getroot()
    rows = []
    for i, pm in enumerate(root.iter("{http://www.opengis.net/kml/2.2}Placemark")):
        name = (pm.findtext("k:name", default="", namespaces=ns) or "").strip()
        pt = pm.find(".//k:Point/k:coordinates", ns)
        if pt is None:                      # ignora rotas/linhas (Directions)
            continue
        if "direction" in name.lower():
            continue
        lon, lat = pt.text.strip().split(",")[:2]
        cat = categorize(name)
        rows.append((slug(name, i), cat, float(lat), float(lon), name))
    # emite o array SPOTS (JS)
    print("const SPOTS = [")
    for sid, cat, lat, lon, name in rows:
        nm = name.replace('"', "'")
        print(f'  {{id:"{sid}", cat:"{cat}", lat:{lat:.7f}, lon:{lon:.7f}, '
              f'name:{{en:"{nm}",pt:"{nm}"}}, hours:{{en:"[•••]",pt:"[•••]"}}, '
              f'note:{{en:"[•••]",pt:"[•••]"}}}},')
    print("];")
    print(f"// {len(rows)} pontos importados de {path}", file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("uso: python3 kml_to_spots.py <ficheiro.kml>  > spots.js")
    main(sys.argv[1])
