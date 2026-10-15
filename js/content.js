/* ============================================================================
   content.js — TEXTO da welcome-buinho (bilingue EN/PT)
   ----------------------------------------------------------------------------
   A EQUIPA EDITA AQUI. Cada texto tem versão { en: "...", pt: "..." }.
   Muda o texto entre aspas, mantém vírgulas, chavetas e parêntesis.
   Campos de morada, Wi-Fi e telefones já preenchidos. Faltam só horários da semana, se quiseres afinar.
   Depois de editar: commit / upload. Sobe o número de CACHE no service-worker.js
   para forçar o refresh nos telemóveis.

   NÃO edites o MAPA aqui — os pontos do mapa vivem em js/spots.js.
   ============================================================================ */
const C = {
  appName:{en:"Welcome to Buinho",pt:"Bem-vindo ao Buinho"},
  heroKicker:{en:"BUINHO AIR · MESSEJANA, ALENTEJO",pt:"BUINHO AIR · MESSEJANA, ALENTEJO"},
  heroTitle:{en:["The residency,","mapped."],pt:["A residência,","mapeada."]},
  sections:[
    {id:"arrival",n:"01",title:{en:"Start here",pt:"Começa aqui"}},
    {id:"house",n:"02",title:{en:"Guide: house, Buinho & surroundings",pt:"Guia: casa, Buinho e arredores"}},
    {id:"fablab",n:"03",title:{en:"FabLab: info & bookings",pt:"FabLab: informação e reservas"}},
    {id:"schedule",n:"04",title:{en:"Your week",pt:"A tua semana"}},
    {id:"contacts",n:"05",title:{en:"Contacts & safety",pt:"Contactos e segurança"}},
    {id:"checkin",n:"06",title:{en:"Talk to the team",pt:"Falar com a equipa"}}
  ],
  arrival:{intro:{en:"Buinho FabLab is in Messejana, a village of ~800 in the Alentejo (Aljustrel), southern Portugal.",pt:"O Buinho FabLab fica em Messejana, aldeia de ~800 pessoas no Alentejo (Aljustrel), sul de Portugal."},
    blocks:[
      {t:{en:"Where to arrive",pt:"Onde chegar"},b:{en:"Head to the Espaço Comunitário — Praça 1º de Julho, 11, 7600-318 Messejana. That's where the team is; they'll meet you and take you to your house.",pt:"Vem ter ao Espaço Comunitário — Praça 1º de Julho, 11, 7600-318 Messejana. É onde a equipa está; recebem-te e levam-te à tua casa."}},
      {t:{en:"From Lisbon",pt:"Desde Lisboa"},b:{en:"Train or Rede Expressos coach to Aljustrel / Ferreira (~2h30), then a short taxi or a pickup we arrange. Tell us your arrival time.",pt:"Comboio ou Rede Expressos até Aljustrel / Ferreira (~2h30), depois táxi curto ou boleia combinada. Diz-nos a hora de chegada."}},
      {t:{en:"From Faro airport",pt:"Do aeroporto de Faro"},b:{en:"~1h15 by car. Coach via Ourique. Coordinate in advance.",pt:"~1h15 de carro. Autocarro via Ourique. Combina com antecedência."}},
      {t:{en:"On arrival",pt:"À chegada"},b:{en:"Open «Talk to the team» → «I've arrived» in this app. Someone meets you with the keys.",pt:"Abre «Falar com a equipa» → «Cheguei» nesta app. Alguém te recebe com as chaves."}}
    ],mapLabel:{en:"See on the map",pt:"Ver no mapa"}},
  house:{intro:{en:"The residency home is shared. A few simple habits keep it good for everyone.",pt:"A casa de residência é partilhada. Alguns hábitos simples mantêm-na boa para todos."},
    wifi:{net:"Buinho (Starlink)",pass:"buinho15",note:{en:"Several Starlink networks across the village — same password everywhere.",pt:"Várias redes Starlink pela aldeia — a mesma password em todas."}},
    rules:{en:["Quiet hours after 23:00 — neighbours are close.","Clean the kitchen after use; your fridge shelf is labelled.","Separate waste: yellow (plastic/metal), blue (paper), green (glass), brown (organic).","Last one out switches off lights, heating/AC and locks up.","No smoking indoors — outside, away from the FabLab.","Overnight guests? Let your host know first."],
        pt:["Silêncio depois das 23:00 — os vizinhos estão perto.","Limpa a cozinha depois de usar; a tua prateleira do frigorífico está identificada.","Separa o lixo: amarelo (plástico/metal), azul (papel), verde (vidro), castanho (orgânico).","O último a sair apaga luzes, aquecimento/AC e tranca.","Não se fuma dentro — lá fora, longe do FabLab.","Hóspedes a dormir? Avisa o anfitrião primeiro."]}},
  fablab:{intro:{en:"The FabLab is open to residents on weekdays, 9am–5pm, following the team's hours. Machines are used with the team's supervision — book a slot below and do the induction before first use.",pt:"O FabLab está aberto aos residentes nos dias úteis, das 9h às 17h, no horário da equipa. As máquinas usam-se com supervisão da equipa — reserva em baixo e faz a indução antes do primeiro uso."},
    rules:{en:["Supervision by the team is required for every machine.","Induction before first use of each machine.","Small amounts of the materials we have are included; for bigger quantities or specific materials, talk to the team and we'll help you source them.","Leave tools and machines clean and back in place."],
      pt:["O uso de qualquer máquina tem supervisão da equipa.","Indução antes do primeiro uso de cada máquina.","Pequenas quantidades do material que temos estão incluídas; para quantidades maiores ou materiais específicos, fala com a equipa e ajudamos a encontrá-los.","Deixa ferramentas e máquinas limpas e no lugar."]},
    machines:[
      {id:"3dprinter",name:{en:"3D printing",pt:"Impressão 3D"},book:true,spec:{en:"About 20 FDM printers (Creality Ender 3 Pro, CR-10S and others) + 2 resin printers (Anycubic Photon).",pt:"Cerca de 20 impressoras FDM (Creality Ender 3 Pro, CR-10S e outras) + 2 impressoras de resina (Anycubic Photon)."},notes:{en:"PLA on the materials shelf. Ask the team before changing filament or nozzle.",pt:"PLA na prateleira de materiais. Pergunta à equipa antes de mudar filamento ou bico."}},
      {id:"laser",name:{en:"Laser cutters",pt:"Corte a laser"},book:true,spec:{en:"Two CO2 lasers: 100 W (900 × 700 mm) and 60 W (700 × 500 mm).",pt:"Dois lasers CO2: 100 W (900 × 700 mm) e 60 W (700 × 500 mm)."},notes:{en:"Never leave it running unattended. Approved materials only — never PVC. Extraction on.",pt:"Nunca sem vigilância. Só materiais aprovados — nunca PVC. Extração ligada."}},
      {id:"cnc",name:{en:"CNC routers",pt:"CNC (fresagem)"},book:true,spec:{en:"CNC 1212 (1200 × 1200 mm), OpenBuilds WorkBee (1000 × 1000 mm) and a Shaper handheld CNC.",pt:"CNC 1212 (1200 × 1200 mm), OpenBuilds WorkBee (1000 × 1000 mm) e uma Shaper portátil."},notes:{en:"Eye and ear protection. Mostly wood; long jobs are planned with the team.",pt:"Proteção de olhos e ouvidos. Sobretudo madeira; trabalhos longos combinam-se com a equipa."}},
      {id:"textile",name:{en:"Textile lab",pt:"Laboratório têxtil"},book:true,spec:{en:"Sewing machines, digital embroidery machine and tufting guns.",pt:"Máquinas de costura, máquina de bordar digital e pistolas de tufting."},notes:{en:"You're welcome to join the weekly sewing sessions with women from Messejana.",pt:"Podes juntar-te às sessões semanais de costura com mulheres de Messejana."}},
      {id:"plastic",name:{en:"Precious Plastic",pt:"Precious Plastic"},book:true,spec:{en:"Plastic recycling machines built at Buinho: shredder, extruders, injector and compression press.",pt:"Máquinas de reciclagem de plástico construídas no Buinho: trituradora, extrusoras, injetora e prensa."},notes:{en:"We show you how to sort and prepare plastic before you start.",pt:"Mostramos-te como separar e preparar o plástico antes de começares."}},
      {id:"electronics",name:{en:"Electronics & physical computing",pt:"Eletrónica e computação física"},book:false,spec:{en:"Arduino, Raspberry Pi, micro:bit, sensors and motors, soldering stations, oscilloscope and power supply.",pt:"Arduino, Raspberry Pi, micro:bit, sensores e motores, estações de soldadura, osciloscópio e fonte de alimentação."},notes:{en:"Ventilation on while soldering. Components back in their boxes.",pt:"Ventilação ligada ao soldar. Componentes de volta às caixas."}},
      {id:"workshop",name:{en:"Wood & metal workshop",pt:"Oficina de madeira e metal"},book:false,spec:{en:"Power tools (saws, drills, sanders, planer), hand tools, MIG and arc welders, vinyl cutters.",pt:"Ferramentas eléctricas (serras, berbequins, lixadoras, plaina), ferramentas manuais, soldadura MIG e por arco, plotters de vinil."},notes:{en:"Welding only with the team present.",pt:"Soldadura só com a equipa presente."}},
      {id:"media",name:{en:"Scanning & media",pt:"Digitalização e media"},book:false,spec:{en:"3D scanner (Revopoint POP 2), DSLR cameras (Canon 5D, 80D) and audio recorders (Zoom H1, H2n).",pt:"Scanner 3D (Revopoint POP 2), câmaras DSLR (Canon 5D, 80D) e gravadores áudio (Zoom H1, H2n)."},notes:{en:"Ask the team to borrow them.",pt:"Pede à equipa para os usares."}}
    ]},
  schedule:{intro:{en:"A typical rhythm. Your host confirms your exact plan.",pt:"Um ritmo típico. O anfitrião confirma o teu plano."},
    items:[
      {w:{en:"Day 1 · Welcome",pt:"Dia 1 · Boas-vindas"},x:{en:"Check-in, house tour, FabLab induction, dinner together.",pt:"Check-in, visita à casa, indução no FabLab, jantar em conjunto."}},
      {w:{en:"Open studio",pt:"Estúdio aberto"},x:{en:"FabLab open in work hours. Book machines as needed.",pt:"FabLab aberto em horário de trabalho. Reserva máquinas conforme precisares."}},
      {w:{en:"Community moment",pt:"Momento comunidade"},x:{en:"Share your work-in-progress with the team / village.",pt:"Partilha o teu trabalho-em-curso com a equipa / aldeia."}},
      {w:{en:"Final · Open day",pt:"Final · Dia aberto"},x:{en:"Show what you made. Pack-down and check-out.",pt:"Mostra o que fizeste. Arrumação e check-out."}}
    ]},
  contacts:{emgLabel:{en:"National emergency (free)",pt:"Emergência nacional (grátis)"},emg:"112",
    whatsapp:{label:{en:"Buinho AIR group — your main line to us",pt:"Grupo Buinho AIR — a tua via principal para nós"},
      url:"https://chat.whatsapp.com/9h0grYfRxRa9T4RvIGDWSR",
      cta:{en:"Join the WhatsApp group",pt:"Entrar no grupo de WhatsApp"},
      note:{en:"Day-to-day questions, arrivals, anything — ask here first. The team answers fastest on WhatsApp.",pt:"Dúvidas do dia-a-dia, chegadas, o que for — pergunta aqui primeiro. A equipa responde mais depressa no WhatsApp."}},
    peopleLabel:{en:"If you need to call",pt:"Se precisares de ligar"},
    people:[{r:{en:"Director",pt:"Diretor"},nm:"Carlos Alcobia",ph:"+351 918 283 288"},
      {r:{en:"Production / admin",pt:"Produção / admin"},nm:"Mónica Reis",ph:"+351 939 760 933"}]},
  local:{intro:{en:"Messejana is small and warm. Here's how to get around, eat, and settle in. Tap a place below to see it on the map.",pt:"Messejana é pequena e acolhedora. Aqui fica como te moveres, comeres e instalares. Toca num sítio em baixo para o ver no mapa."},
    blocks:[
      {t:{en:"Getting around",pt:"Transportes"},b:{
        en:"Buses run Monday–Friday only (none on weekends or public holidays) — arrive 30 min early. To Aljustrel: 8:56am, back 4:58pm. To Beja: 8:56am, back 4:10pm. To Zambujeira do Mar (the coast): 5:10pm, back 6:40am — good for a weekend by the sea. To Lisbon: taxi to Funcheira station (~40€) then train (cp.pt), or bus from Aljustrel (rede-expressos.pt). Ask us to book a taxi in advance.",
        pt:"Autocarros só de 2ª a 6ª (nenhum a fins de semana ou feriados) — chega 30 min antes. Para Aljustrel: 8:56, volta 16:58. Para Beja: 8:56, volta 16:10. Para Zambujeira do Mar (o mar): 17:10, volta 6:40 — bom para um fim de semana na praia. Para Lisboa: táxi até à estação de Funcheira (~40€) e comboio (cp.pt), ou autocarro de Aljustrel (rede-expressos.pt). Pede-nos para reservar o táxi com antecedência."}},
      {t:{en:"Food & groceries",pt:"Comida e mercearia"},b:{
        en:"Grocery shops on Rua de Aljustrel, Rua de Alvalade and Rua da Conceição: Mon–Fri 9am–1pm & 3pm–7pm, Sat 9am–1pm, closed Sunday. Vans drive through honking: fruit & veg on Tuesday, Thursday and Sunday (a red and a white truck); fresh fish on Tuesday, Thursday and Saturday; bread most mornings 8:30–9am. For bigger supermarkets (Pingo Doce, Intermarché, Continente) go to Aljustrel. Cash is handy — there's an ATM in town; a couple of shops and Bangula take card.",
        pt:"Mercearias na Rua de Aljustrel, Rua de Alvalade e Rua da Conceição: 2ª–6ª 9h–13h e 15h–19h, Sáb 9h–13h, Dom fechado. Carrinhas passam a buzinar: fruta e legumes à 3ª, 5ª e Dom (uma vermelha e uma branca); peixe fresco à 3ª, 5ª e Sáb; pão quase todas as manhãs 8h30–9h. Para supermercados maiores (Pingo Doce, Intermarché, Continente) vai a Aljustrel. Dinheiro dá jeito — há multibanco na vila; algumas lojas e o Bangula aceitam cartão."}},
      {t:{en:"Eating out",pt:"Comer fora"},b:{
        en:"Faustino café — opposite the gas station; one dish a day, different each day, closed Sunday. Bangula — full meals, café from 9am, lunch from 12pm, dinner at 7:30pm, open Tuesday–Sunday (closed Monday).",
        pt:"Café Faustino — em frente à bomba de gasolina; um prato por dia, diferente a cada dia, fecha Domingo. Bangula — refeições completas, café das 9h, almoço a partir das 12h, jantar às 19h30, aberto de 3ª a Domingo (fecha 2ª)."}},
      {t:{en:"Rubbish",pt:"Lixo"},b:{
        en:"The bin lorry passes on Tuesday, Thursday and Sunday evenings. Put your bin out by the road in front of the house at the end of the day. Separate: yellow (plastic/metal), blue (paper), green (glass), brown (organic).",
        pt:"O camião do lixo passa às terças, quintas e domingos à noite. Põe o contentor à beira da estrada, à frente da casa, ao fim do dia. Separa: amarelo (plástico/metal), azul (papel), verde (vidro), castanho (orgânico)."}},
      {t:{en:"Swimming pool",pt:"Piscina"},b:{
        en:"Rua do Município, Mon–Fri 10am–7pm — summer months only.",
        pt:"Rua do Município, 2ª–6ª 10h–19h — só nos meses de verão."}}
    ]}
};
