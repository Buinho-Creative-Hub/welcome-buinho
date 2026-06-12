# ROADMAP — welcome-buinho

> Estado: **v1 no ar** (hub + check-in + reserva, EN/PT, Buinho Main).
> As ideias abaixo estao **PARQUEADAS para mais tarde** (decisao Carlos, 2026-06-13).
> Conversa exploratoria, NAO aprovada para execucao.

## Criterio-porta (decisao Carlos, obrigatorio antes de construir qualquer feature)
Antes de investir em qualquer das ideas abaixo, ela tem de passar em DOIS testes:
1. **Valor inequivoco para o artista** — resolve mesmo uma dor real do residente, nao e so "giro".
2. **Vende a marca Buinho** — reforca a identidade e a reputacao do Buinho, nao dilui.
Se nao passa nos dois, nao se faz. Ser criterioso > acumular features.

---

## Ideias parqueadas (v2+)

### 1. Mapa de Messejana + spots
Absorver para a app o **PDF de onboarding "manhoso"** e o **Google My Maps** com tags proprias.
- Exportar o Google My Maps em KML/GeoJSON -> converter em `spots.js` (editavel, bilingue).
- Cada spot: nome, categoria (padaria, restaurante, farmacia, mercearia, multibanco, natureza...),
  coordenadas, **horarios**, descricao, curiosidade, foto.
- Render: Leaflet + OpenStreetMap (gratis, sem API key) com pins por categoria; ou lista filtravel + "abrir no Maps".
- Ganho: reforma 2 ferramentas velhas (PDF + Google Map) numa so.

### 2. Tutoriais das maquinas
Campo `tutorials` por maquina no content.js (links YouTube). Botao "Ver tutorial" na ficha da maquina.
Fluxo encadeado: ver tutorial -> marcar checklist de seguranca -> reservar maquina.

### 3. NFC (liga-se ao know-how das Etiquetas Falantes)
Decisao tecnica-chave: **iPhone vs Android.**
- **Via A (recomendada, universal):** tag NFC grava um URL (ex: `welcome.buinho.pt/#fablab/laser`).
  Encostar o telemovel -> o SO abre a app no ecra certo. Funciona em iPhone E Android. Nao precisa de Web NFC.
- **Via B (so Android Chrome):** Web NFC API, a app le/escreve tags (como nas Etiquetas Falantes). iPhone nao suporta.
- Modelo: cada etiqueta = atalho fisico para um ecra (maquina -> tutorial+checklist; casa -> check-in; spot -> ficha).
- A app ja tem routing por hash (v1); deep-link `#fablab/laser` e extensao pequena, nao reescrita.

### 4. Upload de fotos -> pasta GDrive do artista
Precisa do backend v1.1. App envia fotos -> Flask com conta de servico Google -> subpasta do artista
(`Residencias/<artista>/`, criada no check-in). Artista nao faz login Google. 
Atender: **consentimento** (toggle "autorizo uso na comunicacao" -> Gris) e **privacidade** (so a sua pasta).
Resolve a dor real de andar a pedir fotos por email/WhatsApp no fim das residencias.

### 5. Interligacao com a plataforma (buinho-os)
A app como **front-end de hospede** do ecossistema; agentes/Pacheco = retaguarda; espinha de dados = sheets do Drive.
- Check-in -> avisa equipa (Pacheco/Telegram) + regista residente.
- Reservas -> escrevem em sheet/calendario que o Hugo vigia (MCP sheets ja existe).
- App LE da sheet de residencias (`ler_residencias`) -> personaliza ("Bem-vindo X, residencia DD-DD, quarto Y").
- Fotos -> Drive -> Gris puxa para Instagram/newsletter.
- FAQ IA (v2) partilha o cerebro Anthropic do Buinho Assistant -> e aqui que o "assistant light" fecha o circulo.
- Pacheco manda email de boas-vindas com link da app + codigo de check-in pessoal.

### 6. Multi-faixa (tracks) — nao so residentes
Mesmo motor, faixas escolhidas a entrada (ou pelo link/NFC): **residencia / curso Erasmus+ / summer camp / visitante**.
Conteudo por faixa nos ficheiros de dados; identidade troca (Main/Educativo) por faixa (governado pelo Gris).
Construir consciente de tracks desde cedo evita reescrita.
Bonus estrategico: ferramenta de onboarding multilingue bem documentada = **output open-source Erasmus+** (impacto p/ candidaturas — terreno do Ze).

---

## Ordem sugerida (SE e quando passar o criterio-porta)
1. Mapa + spots (mais usado, mata PDF+GoogleMap).  2. Tutoriais (rapido).  3. NFC por cima dos dois.
4. Backend v1.1 (desbloqueia check-in/reservas/fotos a serio).  5. Multi-faixa.  6. FAQ IA.
