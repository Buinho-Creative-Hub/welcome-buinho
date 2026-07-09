/* =========================================================================
   WELCOME · BUINHO AIR  —  CONTENT (bilingual EN / PT)
   -------------------------------------------------------------------------
   This is the ONLY file the Buinho team needs to edit to keep the app
   up to date. No code knowledge required: change the text between the
   quotes. Every field has an `en` (English) and `pt` (Português) version.
   Keep the structure (commas, brackets) intact.
   ========================================================================= */

const CONTENT = {

  // ---- App-wide ----------------------------------------------------------
  appName: { en: "Welcome to Buinho", pt: "Bem-vindo ao Buinho" },
  tagline: {
    en: "Your pocket guide to the residency in Messejana.",
    pt: "O teu guia de bolso para a residência em Messejana."
  },
  emergencyShort: { en: "Emergency", pt: "Emergência" },

  // ---- Home section cards (order = display order) ------------------------
  sections: [
    { id: "arrival",   icon: "🧭", title: { en: "Getting here",      pt: "Como chegar" } },
    { id: "map",       icon: "🗺️", title: { en: "Map & services",    pt: "Mapa e serviços" } },
    { id: "house",     icon: "🏠", title: { en: "The house & rules", pt: "A casa e regras" } },
    { id: "fablab",    icon: "🛠️", title: { en: "The FabLab",        pt: "O FabLab" } },
    { id: "schedule",  icon: "🗓️", title: { en: "Your week",         pt: "A tua semana" } },
    { id: "contacts",  icon: "☎️", title: { en: "Contacts & safety", pt: "Contactos e segurança" } },
    { id: "local",     icon: "🌾", title: { en: "Messejana & around",pt: "Messejana e arredores" } },
    { id: "checkin",   icon: "✅", title: { en: "Check-in",          pt: "Check-in" } },
    { id: "reserve",   icon: "📌", title: { en: "Reserve a machine", pt: "Reservar máquina" } }
  ],

  // ---- ARRIVAL -----------------------------------------------------------
  arrival: {
    intro: {
      en: "Buinho FabLab is in Messejana, a village of ~800 people in the Alentejo (Aljustrel municipality), southern Portugal.",
      pt: "O Buinho FabLab fica em Messejana, uma aldeia de ~800 pessoas no Alentejo (concelho de Aljustrel), no sul de Portugal."
    },
    blocks: [
      {
        title: { en: "Address", pt: "Morada" },
        body: {
          en: "Buinho FabLab, Rua [•••], 7600-[•••] Messejana, Aljustrel.",
          pt: "Buinho FabLab, Rua [•••], 7600-[•••] Messejana, Aljustrel."
        }
      },
      {
        title: { en: "From Lisbon", pt: "Desde Lisboa" },
        body: {
          en: "Train or Rede Expressos coach to Aljustrel / Ferreira do Alentejo (~2h30), then a short taxi or a pre-arranged pickup. Tell us your arrival time and we help with the last leg.",
          pt: "Comboio ou Rede Expressos até Aljustrel / Ferreira do Alentejo (~2h30), depois táxi curto ou boleia combinada. Diz-nos a hora de chegada e ajudamos no último troço."
        }
      },
      {
        title: { en: "From Faro airport", pt: "Do aeroporto de Faro" },
        body: {
          en: "~1h15 by car. Coach connections via Ourique. Coordinate with us in advance.",
          pt: "~1h15 de carro. Ligações de autocarro via Ourique. Combina connosco com antecedência."
        }
      },
      {
        title: { en: "On arrival", pt: "À chegada" },
        body: {
          en: "Do the Check-in in this app and message your host. Someone will meet you with the keys.",
          pt: "Faz o Check-in nesta app e avisa o teu anfitrião. Alguém te recebe com as chaves."
        }
      }
    ],
    mapLabel: { en: "Open in Maps", pt: "Abrir no Maps" },
    mapUrl: "https://maps.google.com/?q=Messejana,+Aljustrel,+Portugal"
  },

  // ---- MAP & SERVICES ----------------------------------------------------
  //  Interactive map of Messejana & around, powered by OpenStreetMap (no API
  //  key, free, open-source). Every pin below is EDITABLE by the team — no
  //  code needed. Change the text between quotes; keep commas and brackets.
  //
  //  ▸ HOW TO FIX A PIN'S POSITION (5 seconds):
  //    1. Open Google Maps or https://www.openstreetmap.org in a browser.
  //    2. Right-click the exact spot → "What's here?" (or copy coordinates).
  //    3. It shows two numbers, e.g.  37.7855, -8.2450
  //    4. Paste the FIRST into  lat:  and the SECOND into  lng:  below.
  //
  //  ▸ Opening hours: replace the [•••] with real hours, e.g. "9:00–13:00, 15:00–19:00".
  //  ▸ Categories (pick one per place): grocery, bakery, pharmacy, food,
  //    health, money, transport, nature, buinho.  (Controls the pin colour/icon.)
  //  ▸ The coordinates below are APPROXIMATE starting points — please verify
  //    each pin once with the steps above.
  map: {
    intro: {
      en: "Everyday spots around Messejana. Tap a pin or a card for hours and directions.",
      pt: "Sítios do dia-a-dia em Messejana. Toca num pin ou cartão para horários e como ir."
    },
    // Map starting view (centre + zoom). Messejana village centre.
    center: { lat: 37.7855, lng: -8.2450 },
    zoom: 15,
    // Labels for the category filter chips (bilingual).
    categories: {
      buinho:    { en: "Buinho",       pt: "Buinho",       icon: "🛠️" },
      grocery:   { en: "Groceries",    pt: "Mercearia",    icon: "🛒" },
      bakery:    { en: "Bakery",       pt: "Padaria",      icon: "🥖" },
      pharmacy:  { en: "Pharmacy",     pt: "Farmácia",     icon: "💊" },
      food:      { en: "Café & food",  pt: "Café e comida",icon: "☕" },
      health:    { en: "Health",       pt: "Saúde",        icon: "🏥" },
      money:     { en: "ATM / bank",   pt: "Multibanco",   icon: "🏧" },
      transport: { en: "Transport",    pt: "Transportes",  icon: "🚌" },
      nature:    { en: "Nature",       pt: "Natureza",     icon: "🏞️" }
    },
    places: [
      {
        cat: "buinho",
        name: { en: "Buinho FabLab", pt: "Buinho FabLab" },
        note: { en: "The FabLab & residency base. Start here.", pt: "O FabLab e base da residência. Começa aqui." },
        address: "Messejana, Aljustrel",
        hours: { en: "Working hours (ask your host)", pt: "Horário de trabalho (pergunta ao anfitrião)" },
        lat: 37.7855, lng: -8.2450
      },
      {
        cat: "buinho",
        name: { en: "Residency house", pt: "Casa de residência" },
        note: { en: "Where you sleep. Your host gives the exact door.", pt: "Onde dormes. O anfitrião indica a porta exata." },
        address: "[•••] Messejana",
        hours: { en: "—", pt: "—" },
        lat: 37.7860, lng: -8.2445
      },
      {
        cat: "grocery",
        name: { en: "Village grocery / mini-market", pt: "Mercearia da aldeia" },
        note: { en: "Basics: bread, milk, fruit, tinned goods.", pt: "Básicos: pão, leite, fruta, conservas." },
        address: "[•••] Messejana",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.7851, lng: -8.2458
      },
      {
        cat: "bakery",
        name: { en: "Bakery", pt: "Padaria" },
        note: { en: "Fresh bread in the morning. Try the local loaf.", pt: "Pão fresco de manhã. Prova o pão da terra." },
        address: "[•••] Messejana",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.7858, lng: -8.2461
      },
      {
        cat: "pharmacy",
        name: { en: "Pharmacy (Messejana)", pt: "Farmácia (Messejana)" },
        note: { en: "Medicines & basic health advice.", pt: "Medicamentos e conselho de saúde básico." },
        address: "[•••] Messejana",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.7849, lng: -8.2452
      },
      {
        cat: "food",
        name: { en: "Café on the square", pt: "Café da praça" },
        note: { en: "Coffee, snacks and a place to sit. Praça 1º de Julho.", pt: "Café, petiscos e sítio para estar. Praça 1º de Julho." },
        address: "Praça 1º de Julho, Messejana",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.7853, lng: -8.2447
      },
      {
        cat: "food",
        name: { en: "Restaurant / tasca", pt: "Restaurante / tasca" },
        note: { en: "Local Alentejo dishes. Ask about the daily special.", pt: "Pratos alentejanos. Pergunta pelo prato do dia." },
        address: "[•••] Messejana",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.7856, lng: -8.2440
      },
      {
        cat: "health",
        name: { en: "Health post (Messejana)", pt: "Extensão de Saúde (Messejana)" },
        note: { en: "Local health extension. For emergencies call 112.", pt: "Extensão de saúde local. Em emergência liga 112." },
        address: "Rua da Bicada 11, 7600-320 Messejana",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.7847, lng: -8.2463
      },
      {
        cat: "health",
        name: { en: "Aljustrel Health Centre", pt: "Centro de Saúde de Aljustrel" },
        note: { en: "Main health centre, ~15 km. For non-urgent care.", pt: "Centro de saúde principal, ~15 km. Cuidados não urgentes." },
        address: "Rua de Beja, 7600-073 Aljustrel",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.8710, lng: -8.1660
      },
      {
        cat: "money",
        name: { en: "ATM (Multibanco)", pt: "Multibanco (ATM)" },
        note: { en: "Cash. Some village shops are cash-only.", pt: "Dinheiro. Algumas lojas da aldeia são só a dinheiro." },
        address: "[•••] Messejana",
        hours: { en: "24h", pt: "24h" },
        lat: 37.7852, lng: -8.2451
      },
      {
        cat: "transport",
        name: { en: "Bus stop", pt: "Paragem de autocarro" },
        note: { en: "Coaches to Aljustrel / Ferreira / Lisbon. Check times ahead.", pt: "Camionetas para Aljustrel / Ferreira / Lisboa. Confirma horários antes." },
        address: "[•••] Messejana",
        hours: { en: "See timetable", pt: "Ver horário" },
        lat: 37.7862, lng: -8.2455
      },
      {
        cat: "grocery",
        name: { en: "Supermarket (Aljustrel)", pt: "Supermercado (Aljustrel)" },
        note: { en: "Bigger shop for a full week's groceries, ~15 km.", pt: "Loja maior para compras da semana, ~15 km." },
        address: "Aljustrel",
        hours: { en: "[•••]", pt: "[•••]" },
        lat: 37.8720, lng: -8.1685
      },
      {
        cat: "nature",
        name: { en: "Barragem do Roxo", pt: "Barragem do Roxo" },
        note: { en: "Reservoir nearby — walking and a summer swim.", pt: "Barragem perto — passeio e banho no verão." },
        address: "Barragem do Roxo",
        hours: { en: "Daylight", pt: "Durante o dia" },
        lat: 37.8300, lng: -8.1600
      }
    ]
  },

  // ---- HOUSE -------------------------------------------------------------
  house: {
    intro: {
      en: "The residency home is shared. A few simple habits keep it good for everyone.",
      pt: "A casa de residência é partilhada. Alguns hábitos simples mantêm-na boa para todos."
    },
    wifi: {
      label: { en: "Wi-Fi", pt: "Wi-Fi" },
      network: "Buinho_AIR",
      password: "[•••]"
    },
    rules: {
      en: [
        "Quiet hours after 23:00 — neighbours are close.",
        "Clean the kitchen after use; shared fridge shelf is labelled.",
        "Separate your waste: yellow (plastic/metal), blue (paper), green (glass), brown (organic).",
        "Last one out switches off lights, heating/AC and locks the door.",
        "No smoking indoors. Please smoke outside, away from the FabLab.",
        "Guests overnight? Let your host know first."
      ],
      pt: [
        "Silêncio depois das 23:00 — os vizinhos estão perto.",
        "Limpa a cozinha depois de usar; a prateleira partilhada do frigorífico está identificada.",
        "Separa o lixo: amarelo (plástico/metal), azul (papel), verde (vidro), castanho (orgânico).",
        "O último a sair apaga luzes, aquecimento/AC e tranca a porta.",
        "Não se fuma dentro de casa. Fuma lá fora, longe do FabLab.",
        "Hóspedes a dormir? Avisa o anfitrião primeiro."
      ]
    }
  },

  // ---- FABLAB ------------------------------------------------------------
  fablab: {
    intro: {
      en: "The FabLab is yours to use during the residency. Before using any machine, complete its safety checklist and, if it needs booking, reserve a slot.",
      pt: "O FabLab é teu para usar durante a residência. Antes de usar qualquer máquina, completa a checklist de segurança e, se precisar de marcação, reserva um horário."
    },
    machines: [
      {
        id: "3dprinter",
        name: { en: "3D printers (FDM)", pt: "Impressoras 3D (FDM)" },
        needsBooking: true,
        notes: {
          en: "PLA is in the materials shelf. Ask Hugo before changing filament or nozzle.",
          pt: "O PLA está na prateleira de materiais. Pergunta ao Hugo antes de mudar filamento ou bico."
        }
      },
      {
        id: "laser",
        name: { en: "Laser cutter", pt: "Cortadora laser" },
        needsBooking: true,
        notes: {
          en: "Never run unattended. Only approved materials — no PVC, ever. Extraction ON.",
          pt: "Nunca deixar sem vigilância. Só materiais aprovados — nunca PVC. Extração LIGADA."
        }
      },
      {
        id: "cnc",
        name: { en: "CNC / milling", pt: "CNC / fresagem" },
        needsBooking: true,
        notes: {
          en: "Eye and ear protection required. Induction with a manager before first use.",
          pt: "Proteção de olhos e ouvidos obrigatória. Indução com um responsável antes do 1.º uso."
        }
      },
      {
        id: "electronics",
        name: { en: "Electronics & soldering", pt: "Eletrónica e soldadura" },
        needsBooking: false,
        notes: {
          en: "Ventilation on while soldering. Tools back in their place.",
          pt: "Ventilação ligada ao soldar. Ferramentas no devido lugar."
        }
      },
      {
        id: "bio",
        name: { en: "Bio-lab (mycelium)", pt: "Bio-lab (micélio)" },
        needsBooking: true,
        notes: {
          en: "Sterile protocol — ask Hugo. This is a sensitive area, access on request.",
          pt: "Protocolo estéril — fala com o Hugo. Área sensível, acesso a pedido."
        }
      }
    ]
  },

  // ---- SCHEDULE ----------------------------------------------------------
  schedule: {
    intro: {
      en: "A typical rhythm. Your host confirms the exact plan for your stay.",
      pt: "Um ritmo típico. O teu anfitrião confirma o plano exato da tua estadia."
    },
    items: [
      { when: { en: "Day 1 · Welcome", pt: "Dia 1 · Boas-vindas" },
        what: { en: "Check-in, house tour, FabLab induction, dinner together.", pt: "Check-in, visita à casa, indução no FabLab, jantar em conjunto." } },
      { when: { en: "Open studio", pt: "Estúdio aberto" },
        what: { en: "FabLab open during work hours. Book machines as needed.", pt: "FabLab aberto em horário de trabalho. Reserva máquinas conforme precisares." } },
      { when: { en: "Community moment", pt: "Momento comunidade" },
        what: { en: "Share your work-in-progress with the team / village.", pt: "Partilha o teu trabalho-em-curso com a equipa / aldeia." } },
      { when: { en: "Final · Open day", pt: "Final · Dia aberto" },
        what: { en: "Show what you made. Pack-down and check-out.", pt: "Mostra o que fizeste. Arrumação e check-out." } }
    ]
  },

  // ---- CONTACTS & SAFETY -------------------------------------------------
  contacts: {
    emergency: {
      label: { en: "National emergency (free)", pt: "Emergência nacional (grátis)" },
      number: "112"
    },
    people: [
      { role: { en: "Director", pt: "Diretor" }, name: "Carlos Alcobia", phone: "[•••]" },
      { role: { en: "Production / admin", pt: "Produção / admin" }, name: "Mónica Reis", phone: "[•••]" },
      { role: { en: "FabLab manager", pt: "Responsável FabLab" }, name: "Hugo Camacho", phone: "[•••]" }
    ],
    practical: [
      { label: { en: "Nearest health centre", pt: "Centro de saúde mais próximo" }, value: { en: "Aljustrel — [•••]", pt: "Aljustrel — [•••]" } },
      { label: { en: "Pharmacy (Messejana)", pt: "Farmácia (Messejana)" }, value: { en: "[•••]", pt: "[•••]" } },
      { label: { en: "Fire safety", pt: "Segurança contra incêndio" }, value: { en: "Extinguisher by the FabLab door; assembly point in the front yard.", pt: "Extintor junto à porta do FabLab; ponto de encontro no pátio da frente." } }
    ]
  },

  // ---- LOCAL -------------------------------------------------------------
  local: {
    intro: {
      en: "Messejana is small and warm. Here is what helps day to day.",
      pt: "Messejana é pequena e acolhedora. Isto ajuda no dia-a-dia."
    },
    items: [
      { title: { en: "Groceries", pt: "Compras" }, body: { en: "Small shops and a café-mercearia in the village. Bigger supermarkets in Aljustrel/Ferreira.", pt: "Pequenas lojas e um café-mercearia na aldeia. Supermercados maiores em Aljustrel/Ferreira." } },
      { title: { en: "Coffee & meals", pt: "Café e refeições" }, body: { en: "A couple of cafés around the main square — try the local bread and queijo.", pt: "Alguns cafés à volta da praça — prova o pão local e o queijo." } },
      { title: { en: "The reservoir", pt: "A barragem" }, body: { en: "Barragem do Roxo nearby — good for a walk and a swim in summer.", pt: "Barragem do Roxo perto — boa para passear e nadar no verão." } },
      { title: { en: "Etiquette", pt: "Etiqueta" }, body: { en: "A 'bom dia' goes a long way. The village is part of the residency.", pt: "Um 'bom dia' faz toda a diferença. A aldeia faz parte da residência." } }
    ]
  }
};

if (typeof module !== "undefined") { module.exports = CONTENT; }
