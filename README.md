# Welcome to Buinho · AIR onboarding PWA

> **PT** primeiro · **EN** below · https://buinho.eu

Guia de bolso (PWA mobile-first) para artistas em residência no **Buinho FabLab**,
Messejana, Alentejo. Abre por QR code à chegada — sem instalação, funciona em iOS e
Android, e pode ser "instalada" no ecrã inicial.

**Online:** `welcome.buinho.pt` *(CNAME pendente)*

### O que faz (v1)
- **Hub de informação curada:** como chegar, a casa e regras, o FabLab e equipamento,
  a semana, contactos e segurança, Messejana e arredores.
- **Camada interativa:** check-in à chegada, e pedido de reserva de máquina.
  *(v1 entrega um email pronto a enviar à equipa; ver "Backend" abaixo.)*
- **Bilingue EN/PT** com botão de troca no topo.
- **Instalável + offline** (manifest + service worker).

### Editar conteúdos (sem programar)
Tudo o que a equipa precisa de mudar está em **`js/content.js`**. Cada texto tem
versão `en` e `pt`. Muda o texto entre aspas, mantém vírgulas e parêntesis. Depois
de editar, faz commit / upload — o service worker serve a versão nova (subir o número
em `CACHE` no `service-worker.js` força refresh em todos os telemóveis).

Preenche os campos marcados com `[•••]` (morada, passwords Wi-Fi, telefones).

### Backend (v1.1 — opcional)
Check-in e reservas têm um **hook documentado** no `js/app.js` (procurar `BACKEND HOOK`).
Hoje produzem um email pronto a enviar. Para receção automática pela equipa: ligar um
micro-backend Flask (`/api/checkin`, `/api/reserve`) com escrita em SQLite ou no
calendário partilhado. Encaixa no padrão habitual do Buinho.

### Stack & deploy
HTML + CSS + JS vanilla, sem build step. Serve como **site estático** (Render Static
Site / GitHub Pages). Identidade **Buinho Main**. Tipografia ASAP.

---

## EN

Mobile-first PWA pocket guide for artists in residence at **Buinho FabLab**, Messejana,
Portugal. Opens via QR on arrival — no install, works on iOS and Android, installable to
the home screen.

**Features (v1):** curated info hub (getting here, house & rules, FabLab & machines,
weekly rhythm, contacts & safety, local life) · interactive check-in and machine booking
request · bilingual EN/PT · installable + offline.

**Edit content** without code in `js/content.js` (every string has `en`/`pt`). **Backend
hook** for v1.1 marked in `js/app.js` (`BACKEND HOOK`). Vanilla stack, no build step,
deploy as a static site.

---

Buinho FabLab · Messejana, Alentejo · CC-BY-SA 4.0
