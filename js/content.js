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
    {id:"fablab",n:"03",title:{en:"FabLab: info & machines",pt:"FabLab: informação e máquinas"}},
    {id:"schedule",n:"04",title:{en:"Your week",pt:"A tua semana"}},
    {id:"contacts",n:"05",title:{en:"Contacts & safety",pt:"Contactos e segurança"}},
    {id:"checkin",n:"06",title:{en:"Talk to the team",pt:"Falar com a equipa"}}
  ],
  arrival:{intro:{en:"Buinho FabLab is in Messejana, a village of ~800 in the Alentejo (Aljustrel), southern Portugal.",pt:"O Buinho FabLab fica em Messejana, aldeia de ~800 pessoas no Alentejo (Aljustrel), sul de Portugal."},
    blocks:[
      {t:{en:"Where to arrive",pt:"Onde chegar"},b:{en:"Go straight to your residency house — we'll be waiting for you there with the keys (we tell you which house is yours before you arrive). Addresses, all in 7600 Messejana: Casa Buinho — Rua Nova de São Brás, 43 · Casa da Padaria — Rua Nova de São Brás, 12 · Casa de São João — Rua Nova de Palma, 33 · Casa da Avó — Praça 1º de Julho, 7. Coming by rental car or taxi? Put your house's address in the GPS. Tell us your arrival time beforehand.",pt:"Vem diretamente para a tua casa de residência — esperamos-te lá com as chaves (dizemos-te antes da chegada qual é a tua casa). Moradas, todas em 7600 Messejana: Casa Buinho — Rua Nova de São Brás, 43 · Casa da Padaria — Rua Nova de São Brás, 12 · Casa de São João — Rua Nova de Palma, 33 · Casa da Avó — Praça 1º de Julho, 7. Vens de carro alugado ou de táxi? Põe a morada da tua casa no GPS. Diz-nos antes a hora de chegada."}},
      {t:{en:"From Lisbon",pt:"Desde Lisboa"},b:{en:"Bus: Rede Expressos from Sete Rios to Aljustrel, then taxi (~10 min, ~€20). Train: from Oriente to Funcheira, then taxi (~30 min, ~€40). Tickets at rede-expressos.pt and cp.pt. We book the taxi for you only because most local drivers don't speak English — you pay the driver yourself.",pt:"Autocarro: Rede Expressos de Sete Rios até Aljustrel, depois táxi (~10 min, ~20€). Comboio: do Oriente até Funcheira, depois táxi (~30 min, ~40€). Bilhetes em rede-expressos.pt e cp.pt. Marcamos o táxi por ti só porque a maioria dos taxistas daqui não fala inglês — o táxi pagas tu ao motorista."}},
      {t:{en:"From Faro airport",pt:"Do aeroporto de Faro"},b:{en:"Take the city bus from the airport to Faro centre (train station and bus terminal are next to each other). Train: Intercidades from Faro to Funcheira (~1h30), then taxi (~30 min, ~€40) — tickets at cp.pt. Bus: Rede Expressos from Faro to Aljustrel (usually with a change), then taxi (~10 min, ~€20) — rede-expressos.pt. Rental car: about 1h30. Tell us your arrival time and we'll book the taxi (you pay the driver).",pt:"Apanha o autocarro do aeroporto para o centro de Faro (estação de comboios e terminal rodoviário ficam lado a lado). Comboio: Intercidades de Faro até Funcheira (~1h30), depois táxi (~30 min, ~40€) — bilhetes em cp.pt. Autocarro: Rede Expressos de Faro até Aljustrel (normalmente com mudança), depois táxi (~10 min, ~20€) — rede-expressos.pt. Carro alugado: cerca de 1h30. Diz-nos a hora de chegada e marcamos o táxi (pagas tu ao motorista)."}},
      {t:{en:"On arrival",pt:"À chegada"},b:{en:"We meet you at your house with the keys. Running late or arriving out of hours? Use «Talk to the team» or WhatsApp.",pt:"Recebemos-te na tua casa com as chaves. Vais chegar atrasado ou fora de horas? Usa «Falar com a equipa» ou o WhatsApp."}}
    ],mapLabel:{en:"See on the map",pt:"Ver no mapa"}},
  house:{intro:{en:"The residency home is shared. A few simple habits keep it good for everyone.",pt:"A casa de residência é partilhada. Alguns hábitos simples mantêm-na boa para todos."},
    wifi:{net:"Buinho (Starlink)",pass:"buinho15",note:{en:"Several Starlink networks across the village — same password everywhere.",pt:"Várias redes Starlink pela aldeia — a mesma password em todas."}},
    rules:{en:["Quiet hours after 23:00 — neighbours are close.","Clean the kitchen after use; your fridge shelf is labelled.","Separate waste: yellow (plastic/metal), blue (paper), green (glass), brown (organic).","Last one out switches off lights, heating/AC and locks up.","No smoking indoors — outside, away from the FabLab.","Overnight guests? Let your host know first."],
        pt:["Silêncio depois das 23:00 — os vizinhos estão perto.","Limpa a cozinha depois de usar; a tua prateleira do frigorífico está identificada.","Separa o lixo: amarelo (plástico/metal), azul (papel), verde (vidro), castanho (orgânico).","O último a sair apaga luzes, aquecimento/AC e tranca.","Não se fuma dentro — lá fora, longe do FabLab.","Hóspedes a dormir? Avisa o anfitrião primeiro."]}},
  fablab:{intro:{en:"The FabLab is open to residents on weekdays, 9am–5pm, following the team's hours. Machines are used with the team's supervision — talk to the team to arrange it, and do the induction before first use.",pt:"O FabLab está aberto aos residentes nos dias úteis, das 9h às 17h, no horário da equipa. As máquinas usam-se com supervisão da equipa — combina com a equipa e faz a indução antes do primeiro uso."},
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
      {w:{en:"Open studio",pt:"Estúdio aberto"},x:{en:"FabLab open in work hours. Arrange machine use with the team.",pt:"FabLab aberto em horário de trabalho. Combina com a equipa o uso das máquinas."}},
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
  local:{intro:{en:"Places on the map — tap one to see where it is.",pt:"Sítios no mapa — toca num para ver onde fica."}}
};
