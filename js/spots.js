/* ============================================================================
   spots.js — O MAPA de Messejana (a "matriz" de pontos editáveis)
   ----------------------------------------------------------------------------
   A EQUIPA EDITA AQUI, sem programar o mapa. Cada ponto tem:
     id, cat, lat, lon, name{en,pt}, hours{en,pt}, note{en,pt}
   As categorias (cor + ícone) estão em CATS. Os pontos estão em SPOTS.

   COMO CORRIGIR UM PIN (5 segundos): abre o Google Maps ou o openstreetmap.org,
   clica com o botão direito no local exacto → copia os dois números
   (ex.: 37.8344, -8.2451), cola o primeiro em lat: e o segundo em lon:.
   Os horários mudam-se no campo hours (substituir os [•••]).

   MODO DE EDIÇÃO DA EQUIPA (recomendado): edita os pontos no Google My Maps
   "Messejana for AIR", exporta KML, e corre tools/kml_to_spots.py para gerar
   este ficheiro. Ver o cabeçalho desse script. As coordenadas actuais são
   pontos de partida aproximados — vale validar cada pin uma vez.
   ============================================================================ */
const CATS = {
  buinho: {label:{en:"Buinho spaces",pt:"Espaços Buinho"}, color:"#2364ff", icon:"bmark"},
  shop:   {label:{en:"Shops & groceries",pt:"Lojas e mercearia"}, color:"#e6a417", icon:"bag"},
  food:   {label:{en:"Food & coffee",pt:"Comer e café"}, color:"#ff5050", icon:"coffee"},
  health: {label:{en:"Health & pharmacy",pt:"Saúde e farmácia"}, color:"#c0392b", icon:"cross"},
  money:  {label:{en:"ATM & services",pt:"Multibanco e serviços"}, color:"#2b3350", icon:"euro"},
  nature: {label:{en:"Nature & pool",pt:"Natureza e piscina"}, color:"#159a6b", icon:"tree"}
};
/* EDITÁVEL: a equipa muda estes pontos. lat/lon = posição real no mapa.
   Coordenadas seed à volta de Messejana; afinar com as reais. */
const SPOTS = [
  {id:"hq", cat:"buinho", lat:37.8344682, lon:-8.2451180, name:{en:"Buinho HQ / FabLab (you are here)",pt:"Sede Buinho / FabLab (estás aqui)"}, hours:{en:"Your base",pt:"A tua base"}, note:{en:"Rua [•••], Messejana.",pt:"Rua [•••], Messejana."}},
  {id:"educativo", cat:"buinho", lat:37.8337425, lon:-8.2436441, name:{en:"Buinho Educativo",pt:"Buinho Educativo"}, hours:{en:"—",pt:"—"}, note:{en:"The education space.",pt:"O espaço educativo."}},
  {id:"casadavo", cat:"buinho", lat:37.8349167, lon:-8.2451759, name:{en:"Casa d'Avó (residency house)",pt:"Casa d'Avó (casa de residência)"}, hours:{en:"—",pt:"—"}, note:{en:"Buinho residency accommodation.",pt:"Alojamento de residência do Buinho."}},
  {id:"saojoao", cat:"buinho", lat:37.8326427, lon:-8.2431600, name:{en:"São João house (residency)",pt:"Casa de São João (residência)"}, hours:{en:"—",pt:"—"}, note:{en:"Buinho residency accommodation.",pt:"Alojamento de residência do Buinho."}},
  {id:"buinhohouse", cat:"buinho", lat:37.8310873, lon:-8.2454464, name:{en:"Buinho House (residency)",pt:"Buinho House (residência)"}, hours:{en:"—",pt:"—"}, note:{en:"Buinho residency accommodation.",pt:"Alojamento de residência do Buinho."}},
  {id:"grocery1", cat:"shop", lat:37.8328831, lon:-8.2413800, name:{en:"Grocery store",pt:"Mercearia"}, hours:{en:"[•••]",pt:"[•••]"}, note:{en:"Everyday basics.",pt:"O essencial do dia-a-dia."}},
  {id:"grocery2", cat:"shop", lat:37.8309405, lon:-8.2421102, name:{en:"Grocery store (south)",pt:"Mercearia (sul)"}, hours:{en:"[•••]",pt:"[•••]"}, note:{en:"Everyday basics.",pt:"O essencial do dia-a-dia."}},
  {id:"bakery", cat:"shop", lat:37.8331534, lon:-8.2413857, name:{en:"Bakery",pt:"Padaria"}, hours:{en:"Daily, morning",pt:"Diário, de manhã"}, note:{en:"Fresh bread in the morning.",pt:"Pão fresco de manhã."}},
  {id:"faustino", cat:"food", lat:37.8308646, lon:-8.2422207, name:{en:"Faustino (café / taberna)",pt:"Faustino (café / taberna)"}, hours:{en:"[•••]",pt:"[•••]"}, note:{en:"Local café — coffee and a bite.",pt:"Café local — um café e petisco."}},
  {id:"pharmacy", cat:"health", lat:37.8341469, lon:-8.2442041, name:{en:"Pharmacy",pt:"Farmácia"}, hours:{en:"Mon–Fri [•••]",pt:"Seg–Sex [•••]"}, note:{en:"[•••]",pt:"[•••]"}},
  {id:"atm", cat:"money", lat:37.8343710, lon:-8.2450260, name:{en:"ATM (Multibanco)",pt:"Multibanco"}, hours:{en:"24h",pt:"24h"}, note:{en:"Cash withdrawal.",pt:"Levantamento de dinheiro."}},
  {id:"pool", cat:"nature", lat:37.8317236, lon:-8.2467606, name:{en:"Swimming pool",pt:"Piscina"}, hours:{en:"Summer",pt:"Verão"}, note:{en:"Municipal pool for hot days.",pt:"Piscina municipal para os dias quentes."}}
];
