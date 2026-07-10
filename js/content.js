/* ============================================================================
   content.js — TEXTO da welcome-buinho (bilingue EN/PT)
   ----------------------------------------------------------------------------
   A EQUIPA EDITA AQUI. Cada texto tem versão { en: "...", pt: "..." }.
   Muda o texto entre aspas, mantém vírgulas, chavetas e parêntesis.
   Preenche os campos marcados com [•••] (morada, Wi-Fi, telefones, horários).
   Depois de editar: commit / upload. Sobe o número de CACHE no service-worker.js
   para forçar o refresh nos telemóveis.

   NÃO edites o MAPA aqui — os pontos do mapa vivem em js/spots.js.
   ============================================================================ */
const C = {
  appName:{en:"Welcome to Buinho",pt:"Bem-vindo ao Buinho"},
  heroKicker:{en:"BUINHO AIR · MESSEJANA, ALENTEJO",pt:"BUINHO AIR · MESSEJANA, ALENTEJO"},
  heroTitle:{en:["The residency,","mapped."],pt:["A residência,","mapeada."]},
  sections:[
    {id:"arrival",n:"01",title:{en:"Getting here",pt:"Como chegar"}},
    {id:"house",n:"02",title:{en:"The house & rules",pt:"A casa e regras"}},
    {id:"fablab",n:"03",title:{en:"The FabLab",pt:"O FabLab"}},
    {id:"schedule",n:"04",title:{en:"Your week",pt:"A tua semana"}},
    {id:"contacts",n:"05",title:{en:"Contacts & safety",pt:"Contactos e segurança"}},
    {id:"local",n:"06",title:{en:"Messejana & around",pt:"Messejana e arredores"}},
    {id:"checkin",n:"07",title:{en:"Check-in",pt:"Check-in"},todo:{en:"to do",pt:"a fazer"}},
    {id:"reserve",n:"08",title:{en:"Reserve a machine",pt:"Reservar máquina"}}
  ],
  arrival:{intro:{en:"Buinho FabLab is in Messejana, a village of ~800 in the Alentejo (Aljustrel), southern Portugal.",pt:"O Buinho FabLab fica em Messejana, aldeia de ~800 pessoas no Alentejo (Aljustrel), sul de Portugal."},
    blocks:[
      {t:{en:"Address",pt:"Morada"},b:{en:"Rua [•••], 7600-[•••] Messejana, Aljustrel.",pt:"Rua [•••], 7600-[•••] Messejana, Aljustrel."}},
      {t:{en:"From Lisbon",pt:"Desde Lisboa"},b:{en:"Train or Rede Expressos coach to Aljustrel / Ferreira (~2h30), then a short taxi or a pickup we arrange. Tell us your arrival time.",pt:"Comboio ou Rede Expressos até Aljustrel / Ferreira (~2h30), depois táxi curto ou boleia combinada. Diz-nos a hora de chegada."}},
      {t:{en:"From Faro airport",pt:"Do aeroporto de Faro"},b:{en:"~1h15 by car. Coach via Ourique. Coordinate in advance.",pt:"~1h15 de carro. Autocarro via Ourique. Combina com antecedência."}},
      {t:{en:"On arrival",pt:"À chegada"},b:{en:"Do the Check-in in this app and message your host. Someone meets you with the keys.",pt:"Faz o Check-in nesta app e avisa o anfitrião. Alguém te recebe com as chaves."}}
    ],mapLabel:{en:"See on the map",pt:"Ver no mapa"}},
  house:{intro:{en:"The residency home is shared. A few simple habits keep it good for everyone.",pt:"A casa de residência é partilhada. Alguns hábitos simples mantêm-na boa para todos."},
    wifi:{net:"Buinho_AIR",pass:"[•••]"},
    rules:{en:["Quiet hours after 23:00 — neighbours are close.","Clean the kitchen after use; your fridge shelf is labelled.","Separate waste: yellow (plastic/metal), blue (paper), green (glass), brown (organic).","Last one out switches off lights, heating/AC and locks up.","No smoking indoors — outside, away from the FabLab.","Overnight guests? Let your host know first."],
        pt:["Silêncio depois das 23:00 — os vizinhos estão perto.","Limpa a cozinha depois de usar; a tua prateleira do frigorífico está identificada.","Separa o lixo: amarelo (plástico/metal), azul (papel), verde (vidro), castanho (orgânico).","O último a sair apaga luzes, aquecimento/AC e tranca.","Não se fuma dentro — lá fora, longe do FabLab.","Hóspedes a dormir? Avisa o anfitrião primeiro."]}},
  fablab:{intro:{en:"The FabLab is yours during the residency. Before any machine, do its safety checklist and, if it needs booking, reserve a slot.",pt:"O FabLab é teu durante a residência. Antes de qualquer máquina, faz a checklist de segurança e, se precisar, reserva horário."},
    machines:[
      {id:"3dprinter",name:{en:"3D printers (FDM)",pt:"Impressoras 3D (FDM)"},book:true,notes:{en:"PLA on the materials shelf. Ask Hugo before changing filament or nozzle.",pt:"PLA na prateleira de materiais. Pergunta ao Hugo antes de mudar filamento ou bico."}},
      {id:"laser",name:{en:"Laser cutter",pt:"Cortadora laser"},book:true,notes:{en:"Never run unattended. Approved materials only — no PVC, ever. Extraction ON.",pt:"Nunca sem vigilância. Só materiais aprovados — nunca PVC. Extração LIGADA."}},
      {id:"cnc",name:{en:"CNC / milling",pt:"CNC / fresagem"},book:true,notes:{en:"Eye and ear protection required. Induction before first use.",pt:"Proteção de olhos e ouvidos. Indução antes do 1.º uso."}},
      {id:"electronics",name:{en:"Electronics & soldering",pt:"Eletrónica e soldadura"},book:false,notes:{en:"Ventilation on while soldering. Tools back in place.",pt:"Ventilação ligada ao soldar. Ferramentas no lugar."}},
      {id:"bio",name:{en:"Bio-lab (mycelium)",pt:"Bio-lab (micélio)"},book:true,notes:{en:"Sterile protocol — ask Hugo. Sensitive area, access on request.",pt:"Protocolo estéril — fala com o Hugo. Área sensível, acesso a pedido."}}
    ]},
  schedule:{intro:{en:"A typical rhythm. Your host confirms your exact plan.",pt:"Um ritmo típico. O anfitrião confirma o teu plano."},
    items:[
      {w:{en:"Day 1 · Welcome",pt:"Dia 1 · Boas-vindas"},x:{en:"Check-in, house tour, FabLab induction, dinner together.",pt:"Check-in, visita à casa, indução no FabLab, jantar em conjunto."}},
      {w:{en:"Open studio",pt:"Estúdio aberto"},x:{en:"FabLab open in work hours. Book machines as needed.",pt:"FabLab aberto em horário de trabalho. Reserva máquinas conforme precisares."}},
      {w:{en:"Community moment",pt:"Momento comunidade"},x:{en:"Share your work-in-progress with the team / village.",pt:"Partilha o teu trabalho-em-curso com a equipa / aldeia."}},
      {w:{en:"Final · Open day",pt:"Final · Dia aberto"},x:{en:"Show what you made. Pack-down and check-out.",pt:"Mostra o que fizeste. Arrumação e check-out."}}
    ]},
  contacts:{emgLabel:{en:"National emergency (free)",pt:"Emergência nacional (grátis)"},emg:"112",
    people:[{r:{en:"Director",pt:"Diretor"},nm:"Carlos Alcobia",ph:"[•••]"},
      {r:{en:"Production / admin",pt:"Produção / admin"},nm:"Mónica Reis",ph:"[•••]"},
      {r:{en:"FabLab manager",pt:"Responsável FabLab"},nm:"Hugo Camacho",ph:"[•••]"}],
    practical:[{l:{en:"Nearest health centre",pt:"Centro de saúde mais próximo"},v:{en:"Aljustrel — [•••]",pt:"Aljustrel — [•••]"}},
      {l:{en:"Pharmacy (Messejana)",pt:"Farmácia (Messejana)"},v:{en:"[•••]",pt:"[•••]"}},
      {l:{en:"Fire safety",pt:"Segurança contra incêndio"},v:{en:"Extinguisher by the FabLab door; assembly point in the front yard.",pt:"Extintor junto à porta do FabLab; ponto de encontro no pátio."}}]},
  local:{intro:{en:"Messejana is small and warm. Tap a place to see it on the map.",pt:"Messejana é pequena e acolhedora. Toca num sítio para o ver no mapa."}}
};
