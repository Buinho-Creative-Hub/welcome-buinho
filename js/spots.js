/* ============================================================================
   spots.js — O MAPA de Messejana (a "matriz" de pontos editáveis)
   ----------------------------------------------------------------------------
   A EQUIPA EDITA AQUI, sem programar o mapa. Cada ponto tem:
     id, cat, lat, lon, name{en,pt}, hours{en,pt}, note{en,pt}
   e, opcional, addr (morada). O botão «Ir» abre o Google Maps na morada; sem
   morada, abre nas coordenadas lat/lon do pin.
   As categorias (cor + ícone) estão em CATS. Os pontos estão em SPOTS.

   COMO CORRIGIR UM PIN (5 segundos): abre o Google Maps ou o openstreetmap.org,
   clica com o botão direito no local exacto → copia os dois números
   (ex.: 37.8344, -8.2451), cola o primeiro em lat: e o segundo em lon:.
   Os horários mudam-se no campo hours.

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
  culture:{label:{en:"Heritage & culture",pt:"Património e cultura"}, color:"#7a4fb5", icon:"landmark"},
  nature: {label:{en:"Outdoors & sport",pt:"Ar livre e desporto"}, color:"#159a6b", icon:"tree"}
};
/* EDITÁVEL: a equipa muda estes pontos. lat/lon = posição real no mapa.
   Coordenadas seed à volta de Messejana; afinar com as reais. */
const SPOTS = [
  {id:"hq", addr:"Praça 1º de Julho, 11", cat:"buinho", lat:37.8344682, lon:-8.2451180, name:{en:"Buinho HQ / FabLab (you are here)",pt:"Sede Buinho / FabLab (estás aqui)"}, hours:{en:"Your base",pt:"A tua base"}, note:{en:"Praça 1º de Julho, 11, Messejana.",pt:"Praça 1º de Julho, 11, Messejana."}},
  {id:"educativo", addr:"Rua da Bicada, 11", cat:"buinho", lat:37.8337425, lon:-8.2436441, name:{en:"Buinho Educativo",pt:"Buinho Educativo"}, hours:{en:"—",pt:"—"}, note:{en:"The education space.",pt:"O espaço educativo."}},
  {id:"casadavo", addr:"Praça 1º de Julho, 7", cat:"buinho", lat:37.8349167, lon:-8.2451759, name:{en:"Casa d'Avó (residency house)",pt:"Casa d'Avó (casa de residência)"}, hours:{en:"—",pt:"—"}, note:{en:"Buinho residency accommodation.",pt:"Alojamento de residência do Buinho."}},
  {id:"saojoao", addr:"Rua Nova de Palma, 33", cat:"buinho", lat:37.8326427, lon:-8.2431600, name:{en:"São João house (residency)",pt:"Casa de São João (residência)"}, hours:{en:"—",pt:"—"}, note:{en:"Buinho residency accommodation.",pt:"Alojamento de residência do Buinho."}},
  {id:"buinhohouse", addr:"Rua Nova de São Brás, 43", cat:"buinho", lat:37.8310873, lon:-8.2454464, name:{en:"Buinho House (residency)",pt:"Buinho House (residência)"}, hours:{en:"—",pt:"—"}, note:{en:"Buinho residency accommodation.",pt:"Alojamento de residência do Buinho."}},
  /* --- Lojas (OpenStreetMap + guia; horários do GUIA AIR) --- */
  {id:"grocery1", cat:"shop", lat:37.8328831, lon:-8.2413800, name:{en:"Grocery store",pt:"Mercearia"}, hours:{en:"Mon–Fri 9–13 & 15–19, Sat 9–13",pt:"2ª–6ª 9h–13h e 15h–19h, sáb 9h–13h"}, note:{en:"Everyday basics.",pt:"O essencial do dia-a-dia."}},
  {id:"grocery2", cat:"shop", lat:37.8309405, lon:-8.2421102, name:{en:"Grocery store (south)",pt:"Mercearia (sul)"}, hours:{en:"Mon–Fri 9–13 & 15–19, Sat 9–13",pt:"2ª–6ª 9h–13h e 15h–19h, sáb 9h–13h"}, note:{en:"Everyday basics.",pt:"O essencial do dia-a-dia."}},
  {id:"minimarket", cat:"shop", lat:37.834734, lon:-8.245490, name:{en:"Mini-market (centre)",pt:"Minimercado (centro)"}, hours:{en:"",pt:""}, note:{en:"Small shop next to the main square.",pt:"Pequena loja junto à praça."}},
  {id:"bakery", cat:"shop", lat:37.8331534, lon:-8.2413857, name:{en:"Bakery",pt:"Padaria"}, hours:{en:"Mornings",pt:"De manhã"}, note:{en:"Fresh bread. A bread van also passes most mornings, 8:30–9.",pt:"Pão fresco. Também passa a carrinha do pão quase todas as manhãs, 8h30–9h."}},
  {id:"florist", cat:"shop", lat:37.830862, lon:-8.242203, name:{en:"Florist",pt:"Florista"}, hours:{en:"",pt:""}, note:{en:"Flowers and plants.",pt:"Flores e plantas."}},
  /* --- Comer e café --- */
  {id:"bangula", cat:"food", lat:37.833866, lon:-8.243960, name:{en:"Bangula (restaurant & café)",pt:"Bangula (restaurante e café)"}, hours:{en:"Tue–Sun · café from 9, lunch from 12, dinner 19:30",pt:"3ª–dom · café das 9h, almoço a partir das 12h, jantar 19h30"}, note:{en:"Full meals. Takes cards. Closed Monday.",pt:"Refeições completas. Aceita cartão. Fecha à 2ª."}},
  {id:"faustino", cat:"food", lat:37.8308646, lon:-8.2422207, name:{en:"Faustino (café / taberna)",pt:"Faustino (café / taberna)"}, hours:{en:"Closed Sunday",pt:"Fecha ao domingo"}, note:{en:"Opposite the petrol station — coffee and one dish of the day.",pt:"Em frente à bomba de gasolina — café e um prato do dia."}},
  {id:"ruina", cat:"food", lat:37.834654, lon:-8.245141, name:{en:"A Ruína (café)",pt:"A Ruína (café)"}, hours:{en:"",pt:""}, note:{en:"Café on the main square, by the clock tower.",pt:"Café na praça, junto à torre do relógio."}},
  {id:"soares", cat:"food", lat:37.833804, lon:-8.244373, name:{en:"Café O Soares",pt:"Café O Soares"}, hours:{en:"",pt:""}, note:{en:"Village café.",pt:"Café da vila."}},
  {id:"rianco", cat:"food", lat:37.833452, lon:-8.245248, name:{en:"Café O Rianço",pt:"Café O Rianço"}, hours:{en:"",pt:""}, note:{en:"Village café.",pt:"Café da vila."}},
  {id:"leonor", cat:"food", lat:37.832561, lon:-8.241855, name:{en:"Café Leonor",pt:"Café Leonor"}, hours:{en:"",pt:""}, note:{en:"Village café.",pt:"Café da vila."}},
  {id:"ana", cat:"food", lat:37.830967, lon:-8.242281, name:{en:"Café Ana",pt:"Café Ana"}, hours:{en:"",pt:""}, note:{en:"Village café, south side.",pt:"Café da vila, lado sul."}},
  {id:"rosa", cat:"food", lat:37.832175, lon:-8.238797, name:{en:"Café Rosa",pt:"Café Rosa"}, hours:{en:"",pt:""}, note:{en:"Café on the east side of the village.",pt:"Café no lado nascente da vila."}},
  {id:"passagem", addr:"Rua de Odemira, 22", cat:"food", lat:37.830126, lon:-8.241975, name:{en:"Passagem Bar",pt:"Passagem Bar"}, hours:{en:"",pt:""}, note:{en:"Bar, Rua de Odemira.",pt:"Bar, Rua de Odemira."}},
  {id:"narm", cat:"food", lat:37.831522, lon:-8.246626, name:{en:"NARM (club café)",pt:"NARM (café do clube)"}, hours:{en:"",pt:""}, note:{en:"The local sports club's café.",pt:"Café do clube desportivo local."}},
  /* --- Saúde --- */
  {id:"pharmacy", addr:"Rua do Engenho", cat:"health", lat:37.834050, lon:-8.244056, name:{en:"Pharmacy",pt:"Farmácia"}, hours:{en:"",pt:""}, note:{en:"Posto Farmacêutico (Farmácia Dias), Rua do Engenho.",pt:"Posto Farmacêutico (Farmácia Dias), Rua do Engenho."}},
  /* --- Dinheiro e serviços --- */
  {id:"atm", cat:"money", lat:37.834262, lon:-8.244743, name:{en:"ATM (Multibanco)",pt:"Multibanco"}, hours:{en:"24h",pt:"24h"}, note:{en:"Cash machine at the Crédito Agrícola bank. Carry cash — few places take cards.",pt:"Multibanco no Crédito Agrícola. Leva dinheiro — poucos sítios aceitam cartão."}},
  {id:"bank", cat:"money", lat:37.834315, lon:-8.244733, name:{en:"Crédito Agrícola (bank)",pt:"Crédito Agrícola (banco)"}, hours:{en:"",pt:""}, note:{en:"The village bank branch.",pt:"O balcão do banco na vila."}},
  {id:"junta", addr:"Praça 1º de Julho", cat:"money", lat:37.834607, lon:-8.244781, name:{en:"Parish council (Junta de Freguesia)",pt:"Junta de Freguesia"}, hours:{en:"",pt:""}, note:{en:"Local administration.",pt:"Administração local."}},
  {id:"fuel", cat:"money", lat:37.830889, lon:-8.241535, name:{en:"Petrol station & garage",pt:"Bomba de gasolina e oficina"}, hours:{en:"",pt:""}, note:{en:"Auto Reboques Messejanense — fuel, repairs and towing.",pt:"Auto Reboques Messejanense — combustível, reparações e reboque."}},
  {id:"toilets", cat:"money", lat:37.832326, lon:-8.245920, name:{en:"Public toilets",pt:"Casas de banho públicas"}, hours:{en:"",pt:""}, note:{en:"",pt:""}},
  /* --- Património e cultura --- */
  {id:"museu", addr:"Rua do Espírito Santo", cat:"culture", lat:37.834175, lon:-8.244773, name:{en:"Ethnographic Museum",pt:"Museu Etnográfico de Messejana"}, hours:{en:"",pt:""}, note:{en:"Rural life in Messejana. Tel. +351 284 655 177.",pt:"A vida rural em Messejana. Tel. 284 655 177."}},
  {id:"pelourinho", cat:"culture", lat:37.834535, lon:-8.244953, name:{en:"Pillory (Pelourinho)",pt:"Pelourinho"}, hours:{en:"",pt:""}, note:{en:"Old symbol of the town's charter, on the main square.",pt:"Antigo símbolo do foral, na praça."}},
  {id:"relogio", cat:"culture", lat:37.834685, lon:-8.245149, name:{en:"Clock tower",pt:"Torre do Relógio"}, hours:{en:"",pt:""}, note:{en:"On the main square.",pt:"Na praça."}},
  {id:"castelo", cat:"culture", lat:37.836357, lon:-8.246433, name:{en:"Castle ruins",pt:"Ruínas do Castelo"}, hours:{en:"",pt:""}, note:{en:"Remains of the medieval castle, at the top of the village.",pt:"Restos do castelo medieval, no alto da vila."}},
  {id:"matriz", cat:"culture", lat:37.836062, lon:-8.245825, name:{en:"Mother church (Igreja Matriz)",pt:"Igreja Matriz"}, hours:{en:"",pt:""}, note:{en:"Next to the castle ruins. Messejana is the «town of seven churches».",pt:"Junto às ruínas do castelo. Messejana é a «vila das sete igrejas»."}},
  {id:"remedios", cat:"culture", lat:37.83447, lon:-8.24530, name:{en:"Church of N. Sra. dos Remédios",pt:"Igreja de N. Sra. dos Remédios"}, hours:{en:"",pt:""}, note:{en:"By the main square.",pt:"Junto à praça."}},
  {id:"pracatouros", cat:"culture", lat:37.83501, lon:-8.24455, name:{en:"Bullring (Praça de Touros)",pt:"Praça de Touros Padre Serralheiro"}, hours:{en:"",pt:""}, note:{en:"",pt:""}},
  /* --- Ar livre e desporto --- */
  {id:"pool", addr:"Rua do Município", cat:"nature", lat:37.83183, lon:-8.24860, name:{en:"Swimming pool",pt:"Piscina"}, hours:{en:"Summer · Mon–Fri 10–19",pt:"Verão · 2ª–6ª 10h–19h"}, note:{en:"Municipal outdoor pool.",pt:"Piscina municipal ao ar livre."}},
  {id:"pavilhao", cat:"nature", lat:37.832251, lon:-8.246583, name:{en:"Sports hall",pt:"Pavilhão Desportivo"}, hours:{en:"",pt:""}, note:{en:"",pt:""}},
  {id:"playground", cat:"nature", lat:37.83321, lon:-8.24516, name:{en:"Playground & garden",pt:"Parque infantil e jardim"}, hours:{en:"",pt:""}, note:{en:"",pt:""}},
  {id:"futebol", far:true, cat:"nature", lat:37.83099, lon:-8.23390, name:{en:"Football ground",pt:"Campo de Futebol"}, hours:{en:"",pt:""}, note:{en:"East edge of the village.",pt:"Na saída nascente da vila."}}
];
