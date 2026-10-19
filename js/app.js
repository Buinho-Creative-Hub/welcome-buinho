/* ============================================================================
   app.js — welcome-buinho (lógica: i18n, frieze de azulejo, vistas, mapa, router)
   ----------------------------------------------------------------------------
   Depende de: content.js (objecto C) e spots.js (CATS + SPOTS), carregados antes.
   Mapa: Leaflet + tiles OpenStreetMap em tons de cinza (o CARTO passou a exigir chave, Out 2026).

   ⚠️ NOTA (não repetir o bug): o helper de idioma chama-se LANG(), NUNCA L —
   "L" é o namespace global do Leaflet; chamar-lhe L partiria o mapa
   ("L.map is not a function").
   ============================================================================ */
/* ================= i18n / helpers ================= */
const M={lang:"en"};
const LANG=()=>M.lang, t=o=>(o&&typeof o==="object"&&("en"in o))?(o[LANG()]??o.en):o;
const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const val=id=>(document.getElementById(id)?.value||"").trim();

/* azulejo frieze: repeat 4 motifs across a band */
function frieze(color){
  const seq=["az-weave","az-diamond","az-quatre"];
  let tiles="";
  for(let i=0;i<8;i++){const m=seq[i%3];
    const stroke=(m==="az-diamond")?`fill="none" stroke="${color}" stroke-width="7"`:`fill="${color}"`;
    tiles+=`<g transform="translate(${i*46},0)"><use href="#${m}" ${stroke}/></g>`;}
  return `<svg class="frieze" viewBox="0 0 368 48" preserveAspectRatio="xMidYMid slice">${tiles}</svg>`;
}
/* meaningful line-icons — white, stroke 2, on the coloured tile. A café reads as a café. */
const ICONS={
  coffee:'<path d="M5 9h11v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z"/><path d="M16 10h2.2a2 2 0 0 1 0 4H16"/><path d="M8 3.2c-.6.8-.6 1.6 0 2.4M11.5 3.2c-.6.8-.6 1.6 0 2.4"/>',
  bag:'<path d="M6 8h12l-1 11H7L6 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  cross:'<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',
  euro:'<path d="M16.5 6.8A6 6 0 1 0 16.5 17"/><path d="M4.5 10.5h8M4.5 13.5h7"/>',
  tree:'<path d="M12 3 6.5 12h11L12 3Z"/><path d="M12 8.5 8 15h8l-4-6.5Z"/><path d="M12 15v5"/>',
  house:'<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>',
  landmark:'<path d="M4 9 12 4l8 5"/><path d="M5 20h14"/><path d="M7 10v8M12 10v8M17 10v8"/>',
  star:'<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"/>'
};
function catGlyph(cat){
  const ic=CATS[cat].icon;
  if(ic==="bmark") return `<svg viewBox="0 0 24 24" width="20" height="20"><text x="12" y="18.5" text-anchor="middle" font-family="Asap,system-ui,sans-serif" font-weight="800" font-size="20" fill="#fff">B</text></svg>`;
  return `<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${ICONS[ic]}</svg>`;
}

/* ================= HOME ================= */
function renderHome(){
  const v=document.getElementById("v-home"); v.innerHTML="";
  v.appendChild(el("div","eyebrow",esc(t(C.heroKicker))));
  const ttl=t(C.heroTitle);
  v.appendChild(el("h1","h1",`${esc(ttl[0])}<br>${esc(ttl[1]).replace(/[.．]$/,'')}<span class="dot">.</span>`));
  v.insertAdjacentHTML("beforeend",frieze("#2364ff"));

  // essentials (sun) card
  const ess=el("div","ess");
  ess.innerHTML=`<svg class="ess-tile" viewBox="0 0 48 48"><use href="#az-quatre" fill="#1a1a1a"/></svg>
    <div class="lbl">${LANG()==="pt"?"ESSENCIAL":"ESSENTIALS"}</div>
    <div class="row"><span class="k">Wi-Fi</span><span class="v">${esc(C.house.wifi.net)} · ${esc(C.house.wifi.pass)}</span></div>
    <div class="row"><span class="k">${LANG()==="pt"?"Morada":"Address"}</span><span class="v"><a href="#" data-map="fablab">Praça 1º de Julho, 11, Messejana</a></span></div>
    <div class="row"><span class="k">${LANG()==="pt"?"Emergência":"Emergency"}</span><span class="v red">112 →</span></div>`;
  ess.querySelector('[data-map]').onclick=e=>{e.preventDefault();openMap("fablab");};
  ess.querySelectorAll('.row')[2].onclick=()=>go("contacts");
  v.appendChild(ess);

  // numbered index
  const ul=el("ul","idx");
  C.sections.forEach(s=>{
    const li=el("li");
    li.innerHTML=`<span class="n">${s.n}</span><span class="ti">${esc(t(s.title))}</span>
      ${s.todo?`<span class="todo">${esc(t(s.todo))}</span>`:""}<span class="arr">›</span>`;
    li.onclick=()=>go(s.id); ul.appendChild(li);
  });
  /* Mapa e Assistente também no índice (feedback Mónica, 19 Out): em alguns telemóveis a barra de baixo não se vê. */
  [{id:"map",n:"07",title:{en:"Map of Messejana",pt:"Mapa de Messejana"}},{id:"ask",n:"08",title:{en:"Assistant",pt:"Assistente"}}].forEach(s=>{
    const li=el("li");li.innerHTML=`<span class="n">${s.n}</span><span class="ti">${esc(t(s.title))}</span><span class="arr">›</span>`;
    li.onclick=()=>go(s.id);ul.appendChild(li);});
  v.appendChild(ul);
  v.appendChild(el("div","foot","Buinho FabLab · Messejana, Alentejo · CC-BY-SA 4.0"));
}

/* ================= DETAIL ================= */
function head(title,lead){const w=el("div");w.appendChild(el("h2","h2",esc(t(title))));if(lead)w.appendChild(el("p","lead",esc(t(lead))));return w;}
const EXTRA_TIT={ask:{en:"Assistant",pt:"Assistente"}};
function secTitle(id){const s=C.sections.find(s=>s.id===id);return s?s.title:EXTRA_TIT[id];}
function block(title,html){const b=el("div","block");if(title)b.appendChild(el("h3",null,esc(t(title))));if(html)b.insertAdjacentHTML("beforeend",html);return b;}

const DETAIL={
  arrival(){const d=C.arrival,v=el("div"),pt=LANG()==="pt";v.appendChild(head(secTitle("arrival"),d.intro));
    const w=C.contacts.whatsapp;
    if(w){const wa=el("div","block");wa.appendChild(el("h3",null,esc(t(w.label))));
      if(w.note)wa.appendChild(el("p",null,esc(t(w.note))));
      const wb=el("a","btn",esc(t(w.cta))+" →");wb.href=w.url;wb.target="_blank";wb.rel="noopener";wa.appendChild(wb);v.appendChild(wa);}
    d.blocks.forEach(bk=>v.appendChild(block(bk.t,`<p>${esc(t(bk.b))}</p>`)));
    const ch=el("button","btn",(pt?"Já cheguei — avisar a equipa":"I've arrived — tell the team")+" →");ch.onclick=()=>go("checkin");v.appendChild(ch);
    const a=el("button","btn ghost",t(d.mapLabel)+" →");a.onclick=()=>openMap("fablab");v.appendChild(a);return v;},
  house(){const d=C.house,v=el("div");const pt=LANG()==="pt";
    v.appendChild(head(secTitle("house"),{en:"Practical answers about the house, Buinho and Messejana.",pt:"Respostas práticas sobre a casa, o Buinho e Messejana."}));
    const ak=el("div","ask ask-link");ak.innerHTML=`<span>${pt?"Não encontras? Pergunta ao assistente.":"Can't find it? Ask the assistant."}</span><span class="arr">›</span>`;
    ak.onclick=()=>go("ask");v.appendChild(ak);
    const linhas=guiaVisivel();
    if(linhas.length){
      const ordem=[];linhas.forEach(g=>{if(!ordem.includes(g.secao))ordem.push(g.secao);});
      if(ordem.includes("Messejana"))ordem.push(ordem.splice(ordem.indexOf("Messejana"),1)[0]); /* Messejana por último, junto ao mapa */
      ordem.forEach(sec=>{const bl=el("div","block");bl.appendChild(el("h3",null,esc(SEC_NOME[sec]?t(SEC_NOME[sec]):sec)));
        linhas.filter(g=>g.secao===sec).forEach(g=>{const det=el("details","faq");
          const q=pt?g.pergunta:(g.pergunta_en||g.pergunta),r=pt?(g.pt||g.en):(g.en||g.pt);
          det.innerHTML=`<summary>${esc(q)}${g.casa&&g.casa!=="todas"?` <span class="todo">${esc(g.casa)}</span>`:""}</summary><p>${esc(r)}</p>`;bl.appendChild(det);});
        v.appendChild(bl);});
      v.appendChild(arredores());return v;}
    /* sem guia (offline e sem cópia): conteúdo de base */
    v.appendChild(block({en:"Wi-Fi",pt:"Wi-Fi"},`<div class="kv"><span class="k">SSID</span><span class="v">${esc(d.wifi.net)}</span></div><div class="kv"><span class="k">Password</span><span class="v">${esc(d.wifi.pass)}</span></div>`));
    const r=el("div","block");r.appendChild(el("h3",null,pt?"Regras da casa":"House rules"));
    const ul=el("ul","rules");t(d.rules).forEach(x=>ul.appendChild(el("li",null,esc(x))));r.appendChild(ul);v.appendChild(r);v.appendChild(arredores());return v;},
  fablab(){const d=C.fablab,v=el("div"),pt=LANG()==="pt";v.appendChild(head(secTitle("fablab"),d.intro));
    if(d.rules){const r=el("div","block");r.appendChild(el("h3",null,pt?"Como funciona":"How it works"));
      const ul=el("ul","rules");t(d.rules).forEach(x=>ul.appendChild(el("li",null,esc(x))));r.appendChild(ul);v.appendChild(r);}
    d.machines.forEach(m=>{const tag=m.book?`<span class="mtag">${pt?"reserva":"booking"}</span>`:"";
      const b=block(null,`<h3>${esc(t(m.name))}${tag}</h3>${m.spec?`<p>${esc(t(m.spec))}</p>`:""}${m.notes?`<p class="note">${esc(t(m.notes))}</p>`:""}`);
      if(m.book){const rb=el("button","btn ghost",(pt?"Reservar":"Book")+" ↓");rb.onclick=()=>{const s=document.getElementById("res-m");if(s)s.value=m.id;document.getElementById("reservar")?.scrollIntoView({behavior:"smooth"});};b.appendChild(rb);}
      else b.insertAdjacentHTML("beforeend",`<p class="note">${pt?"Sem reserva — fala com a equipa no FabLab.":"No booking needed — ask the team at the FabLab."}</p>`);
      v.appendChild(b);});
    v.appendChild(formReserva());return v;},
  schedule(){const d=C.schedule,v=el("div");
    const ag=agendaProxima();
    if(ag.length){
      v.appendChild(head(secTitle("schedule"),{en:"What's on at Buinho in the coming days.",pt:"O que há no Buinho nos próximos dias."}));
      const loc=LANG()==="pt"?"pt-PT":"en-GB";
      let dia=null,bl=null;
      ag.forEach(a=>{
        if(a.data!==dia){dia=a.data;
          const nome=new Date(a.data+"T12:00:00").toLocaleDateString(loc,{weekday:"long",day:"numeric",month:"long"});
          bl=block(nome.charAt(0).toUpperCase()+nome.slice(1),"");v.appendChild(bl);}
        const hora=a.ini+(a.fim?"–"+a.fim:"");
        const tit=LANG()==="pt"?(a.tpt||a.ten):(a.ten||a.tpt), nota=LANG()==="pt"?(a.npt||a.nen):(a.nen||a.npt);
        bl.insertAdjacentHTML("beforeend",`<div class="ag"><div class="ag-h">${esc(hora)}</div><div><div class="ag-t">${esc(tit)}</div>${a.local?`<div class="ag-m">📍 ${esc(a.local)}</div>`:""}${nota?`<div class="ag-m">${esc(nota)}</div>`:""}</div></div>`);
      });
      if(AGENDA&&AGENDA.at){const quando=new Date(AGENDA.at).toLocaleString(loc,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
        v.appendChild(el("p","ag-stamp",esc((LANG()==="pt"?"Actualizado a ":"Updated ")+quando)));}
    } else {
      v.appendChild(head(secTitle("schedule"),d.intro));
      d.items.forEach(it=>v.appendChild(block(it.w,`<p>${esc(t(it.x))}</p>`)));
    }
    return v;},
  contacts(){const d=C.contacts,v=el("div");v.appendChild(head(secTitle("contacts")));
    const sos=el("div","sos");sos.innerHTML=`<div class="n">112</div><div><strong>${esc(t(d.emgLabel))}</strong></div>`;v.appendChild(sos);
    const call=el("a","btn red","📞 112");call.href="tel:112";v.appendChild(call);
    if(d.whatsapp){const wa=el("div","block");wa.style.marginTop="16px";
      wa.appendChild(el("h3",null,t(d.whatsapp.label)));
      if(d.whatsapp.note)wa.appendChild(el("p",null,esc(t(d.whatsapp.note))));
      const wb=el("a","btn",t(d.whatsapp.cta)+" →");wb.href=d.whatsapp.url;wb.target="_blank";wb.rel="noopener";wa.appendChild(wb);
      v.appendChild(wa);}
    const ppl=el("div","block");ppl.style.marginTop="16px";ppl.appendChild(el("h3",null,d.peopleLabel?t(d.peopleLabel):(LANG()==="pt"?"Equipa":"Team")));
    d.people.forEach(p=>{const row=el("div","kv");row.innerHTML=`<span class="k">${esc(t(p.r))} · ${esc(p.nm)}</span><a class="v" href="tel:${esc(p.ph)}">${esc(p.ph)}</a>`;ppl.appendChild(row);});v.appendChild(ppl);
    return v;},
  checkin(){const v=el("div");const pt=LANG()==="pt";
    v.appendChild(head(secTitle("checkin"),{en:"Arrived, something wrong in the house, a question, or feedback — tell us here. It goes straight to the team.",pt:"Chegaste, há um problema na casa, uma dúvida ou feedback — diz-nos aqui. Vai direto para a equipa."}));
    const tipos=[["arrived",{en:"I've arrived",pt:"Cheguei"}],["problem",{en:"Problem in the house",pt:"Problema na casa"}],["question",{en:"Question",pt:"Dúvida"}],["feedback",{en:"Feedback",pt:"Feedback"}]];
    const eu=quemSou();let tipo="arrived";
    const f=el("div");f.innerHTML=`
      <label class="f">${pt?"Sobre o quê?":"What's it about?"}</label><div class="tp" id="eq-tipo"></div>
      <div class="two"><div><label class="f">${pt?"Nome":"Name"}</label><input id="eq-nome" autocomplete="name"></div>
      <div><label class="f">${pt?"Casa":"House"}</label><select id="eq-casa">${CASAS.map(c=>`<option>${esc(t(c))}</option>`).join("")}</select></div></div>
      <div id="eq-fb" style="display:none">
        <p class="note" style="margin:14px 0 4px">${pt?"De 1 (mau) a 5 (excelente). Salta o que não se aplica.":"From 1 (poor) to 5 (excellent). Skip what doesn't apply."}</p>
        <div id="eq-dims"></div>
        <label class="f">${pt?"Recomendarias o Buinho a outro artista?":"Would you recommend Buinho to another artist?"}</label><div class="tp" id="eq-rec"></div>
        <label class="f">${pt?"O que correu melhor?":"What worked best?"}</label><textarea id="eq-bem" rows="2"></textarea>
        <label class="f">${pt?"O que devíamos mudar?":"What should we change?"}</label><textarea id="eq-mudar" rows="2"></textarea>
      </div>
      <div id="eq-msg-w"><label class="f" id="eq-msg-l"></label><textarea id="eq-msg" rows="3"></textarea></div>
      <input id="eq-hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">`;
    v.appendChild(f);
    const tp=f.querySelector("#eq-tipo"),msgL=f.querySelector("#eq-msg-l"),fbW=f.querySelector("#eq-fb"),msgW=f.querySelector("#eq-msg-w");
    const pinta=()=>{tp.querySelectorAll(".cat").forEach(b=>b.classList.toggle("on",b.dataset.t===tipo));
      fbW.style.display=tipo==="feedback"?"block":"none";msgW.style.display=tipo==="feedback"?"none":"block";
      msgL.textContent=tipo==="arrived"?(pt?"Alguma nota? (opcional)":"Anything to add? (optional)"):(pt?"Conta-nos numa frase":"Tell us in a sentence");};
    tipos.forEach(([k,l])=>{const b=el("span","cat",esc(t(l)));b.dataset.t=k;b.onclick=()=>{tipo=k;pinta();};tp.appendChild(b);});
    const aval={};let rec="";
    const dims=f.querySelector("#eq-dims");
    FB_DIMS.forEach(([k,l])=>{const row=el("div","fb-row");row.appendChild(el("span","fb-l",esc(t(l))));const pills=el("div","tp");
      [1,2,3,4,5].forEach(n=>{const b=el("span","cat",String(n));b.onclick=()=>{aval[k]=(aval[k]===n?undefined:n);pills.querySelectorAll(".cat").forEach(x=>x.classList.toggle("on",+x.textContent===aval[k]));};pills.appendChild(b);});
      row.appendChild(pills);dims.appendChild(row);});
    const rc=f.querySelector("#eq-rec");[["sim",{en:"Yes",pt:"Sim"}],["talvez",{en:"Maybe",pt:"Talvez"}],["nao",{en:"No",pt:"Não"}]].forEach(([k,l])=>{const b=el("span","cat",esc(t(l)));b.onclick=()=>{rec=k;rc.querySelectorAll(".cat").forEach(x=>x.classList.toggle("on",x===b));};rc.appendChild(b);});
    f.querySelector("#eq-nome").value=eu.nome||"";if(eu.casa)f.querySelector("#eq-casa").value=eu.casa;pinta();
    const btn=el("button","btn",(pt?"Enviar à equipa":"Send to the team")+" →");const done=el("div","done");
    btn.onclick=()=>{const nome=val("eq-nome").trim(),casa=val("eq-casa");let msg=val("eq-msg").trim();
      if(!nome){done.classList.add("show");done.textContent=pt?"Escreve o teu nome, por favor.":"Please add your name.";return;}
      let extra={};
      if(tipo==="feedback"){const ns=Object.values(aval).filter(Boolean),bem=val("eq-bem"),mudar=val("eq-mudar");
        if(!ns.length&&!bem&&!mudar){done.classList.add("show");done.textContent=pt?"Dá pelo menos uma nota ou escreve uma frase.":"Give at least one score or write a sentence.";return;}
        msg=[bem&&("Bem: "+bem),mudar&&("Mudar: "+mudar)].filter(Boolean).join(" | ");
        extra={aval:Object.fromEntries(FB_DIMS.map(([k])=>[k,aval[k]||""])),recomenda:rec,
          nota:ns.length?Math.round(ns.reduce((a,b)=>a+b,0)/ns.length*10)/10:""};}
      else if(tipo!=="arrived"&&!msg){done.classList.add("show");done.textContent=pt?"Escreve uma frase, por favor.":"Please write a sentence.";return;}
      guardarQuemSou(nome,casa);btn.disabled=true;
      enviarEquipa(Object.assign({tipo,nome,casa,mensagem:msg,nota:"",hp:val("eq-hp")},extra),done,()=>{btn.disabled=false;["eq-msg","eq-bem","eq-mudar"].forEach(i=>{const x=f.querySelector("#"+i);if(x)x.value="";});});};
    v.appendChild(btn);v.appendChild(done);
    v.appendChild(el("p","ag-stamp",esc(pt?"Urgência ou perigo? Liga 112 (ver Contactos e segurança).":"Emergency or danger? Call 112 (see Contacts & safety).")));
    return v;}
,
  ask(){const v=el("div"),pt=LANG()==="pt";
    v.appendChild(head(secTitle("ask"),{en:"Ask anything practical about the house, Buinho, the FabLab or Messejana — in any language.",pt:"Pergunta qualquer coisa prática sobre a casa, o Buinho, o FabLab ou Messejana — em qualquer língua."}));
    const log=el("div","chat");v.appendChild(log);
    const box=el("div","ask");box.innerHTML=`<div class="ask-row"><input id="ask-q" maxlength="300" placeholder="${pt?"Ex.: onde compro pão?":"E.g. where can I buy bread?"}"><button class="btn" id="ask-b">${pt?"Perguntar":"Ask"}</button></div>`;v.appendChild(box);
    const team=el("button","btn ghost",(pt?"Falar com a equipa":"Talk to the team")+" →");team.style.display="none";team.onclick=()=>go("checkin");v.appendChild(team);
    const qi=box.querySelector("#ask-q"),ab=box.querySelector("#ask-b");
    const perguntar=()=>{const q=qi.value.trim();if(q.length<3)return;ab.disabled=true;qi.value="";
      log.appendChild(el("div","msg me",esc(q)));const a=el("div","msg bot",pt?"A pensar…":"Thinking…");log.appendChild(a);a.scrollIntoView({block:"nearest"});
      perguntarGuia(q).then(r=>{a.textContent=r;team.style.display="";}).finally(()=>{ab.disabled=false;qi.focus();});};
    ab.onclick=perguntar;qi.onkeydown=e=>{if(e.key==="Enter")perguntar();};
    v.appendChild(el("p","ag-stamp",esc(pt?"O assistente responde a partir do guia do Buinho. Se não souber, diz-te para falares com a equipa.":"The assistant answers from Buinho's guide. If it can't help, it will point you to the team.")));
    return v;}
};

/* Messejana e arredores — subsecção do Guia */
function arredores(){const pt=LANG()==="pt",w=el("div");
  w.insertAdjacentHTML("beforeend",frieze("#159a6b"));
  w.appendChild(el("p","lead",esc(t(C.local.intro))));
  const ob=el("button","btn","🗺 "+(pt?"Abrir o mapa de Messejana":"Open the Messejana map"));ob.onclick=()=>go("map");w.appendChild(ob);
  const ul=el("div");ul.style.marginTop="8px";SPOTS.filter(s=>s.id!=="fablab").forEach(s=>ul.appendChild(spotRow(s)));w.appendChild(ul);return w;}
/* Reserva de máquina — no fim da secção FabLab */
function formReserva(){const pt=LANG()==="pt",v=el("div","block");v.id="reservar";
  v.appendChild(el("h3",null,pt?"Pedir reserva":"Request a booking"));
  v.appendChild(el("p","note",esc(pt?"Escolhe máquina e horário. A equipa confirma.":"Pick a machine and a slot. The team confirms.")));
  const opts=C.fablab.machines.filter(m=>m.book).map(m=>`<option value="${m.id}">${esc(t(m.name))}</option>`).join("");
  const f=el("div");f.innerHTML=`<label class="f">${pt?"Máquina":"Machine"}</label><select id="res-m">${opts}</select>
    <label class="f">${pt?"Nome":"Name"}</label><input id="res-name">
    <div class="two"><div><label class="f">${pt?"Dia":"Day"}</label><input id="res-date" type="date"></div>
    <div><label class="f">${pt?"Hora":"Time"}</label><input id="res-time" type="time"></div></div>
    <label class="f">${pt?"Notas (opcional)":"Notes (optional)"}</label><textarea id="res-notes" rows="2"></textarea>`;v.appendChild(f);
  f.querySelector("#res-name").value=quemSou().nome||"";
  const btn=el("button","btn","📌 "+(pt?"Pedir reserva":"Request booking"));const done=el("div","done");
  btn.onclick=()=>{const mN=f.querySelector('#res-m option:checked').textContent,nome=val("res-name").trim();
    if(!nome||!val("res-date")){done.classList.add("show");done.textContent=pt?"Falta o nome ou o dia.":"Name and day, please.";return;}
    guardarQuemSou(nome,quemSou().casa||"");btn.disabled=true;
    enviarEquipa({tipo:"booking",nome,casa:quemSou().casa||"",mensagem:`${mN} · ${val("res-date")} ${val("res-time")}${val("res-notes")?" · "+val("res-notes"):""}`,nota:"",hp:""},done,()=>{btn.disabled=false;});};
  v.appendChild(btn);v.appendChild(done);return v;}

/* ================= MAP ================= */
let mapFilter=null, mapSel=null;
/* «Ir»: abre o Google Maps no sítio certo — morada se houver, senão as coordenadas do pin. */
/* Feedback Mónica (19 Out): com a morada, o Google não encontrava «Praça 1º de Julho, 7» nem a Junta.
   Agora vai sempre às coordenadas do pin, em modo direcções. */
function goUrl(s){
  return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(s.lat + ',' + s.lon);
}
function spotRow(s){
  const c=CATS[s.cat];
  const row=el("div","spot");row.dataset.id=s.id;
  row.innerHTML=`<span class="sq" style="background:${c.color}">${catGlyph(s.cat)}</span>
    <div><div class="nm">${esc(t(s.name))}</div><div class="meta">${[t(c.label),t(s.hours),t(s.note)].filter(x=>x&&x!=="—").map(esc).join(" · ")}</div></div>
    <a class="go" href="${goUrl(s)}" target="_blank" rel="noopener">${LANG()==="pt"?"Ir":"Go"} →</a>`;
  row.onclick=e=>{if(e.target.closest('.go'))return;openMap(s.id);};
  return row;
}
let LMAP=null, LMARKERS={};
function renderMap(){
  const v=document.getElementById("v-map");v.innerHTML="";LMAP=null;LMARKERS={};
  v.appendChild(head({en:"Messejana map",pt:"Mapa de Messejana"},{en:"The village, from your door. Tap a pin or a place.",pt:"A aldeia, a partir da tua porta. Toca num pino ou num sítio."}));
  const wrap=el("div","mapwrap");wrap.innerHTML='<div id="leaflet"></div>';v.appendChild(wrap);
  const locBtn=el("button","btn ghost","📍 "+(LANG()==="pt"?"Onde estou":"Where am I"));
  locBtn.style.marginTop="8px";locBtn.onclick=()=>locateMe(locBtn);v.appendChild(locBtn);
  // category filters
  const cats=el("div","cats");
  const all=el("span","cat"+(mapFilter===null?" on":""),(LANG()==="pt"?"Todos":"All"));all.onclick=()=>{mapFilter=null;drawMarkers();refreshList();cats.querySelectorAll('.cat').forEach(x=>x.classList.remove('on'));all.classList.add('on');};cats.appendChild(all);
  Object.entries(CATS).forEach(([k,c])=>{const b=el("span","cat"+(mapFilter===k?" on":""));
    b.innerHTML=`<span class="sw" style="background:${c.color}"></span>${esc(t(c.label))}`;
    b.onclick=()=>{mapFilter=(mapFilter===k?null:k);renderMap();};cats.appendChild(b);});
  v.appendChild(cats);
  const listWrap=el("div");listWrap.id="spotlist";v.appendChild(listWrap);
  refreshList();
  initLeaflet();
}
function refreshList(){
  const lw=document.getElementById("spotlist");if(!lw)return;lw.innerHTML="";
  SPOTS.forEach(s=>{if(mapFilter && s.cat!==mapFilter)return;const r=spotRow(s);if(mapSel===s.id)r.style.background="#f4f0e8";lw.appendChild(r);});
}
function markerHTML(s,sel){const c=CATS[s.cat];
  return `<div class="mk-tile${sel?' mk-sel':''}" style="background:${c.color}">${catGlyph(s.cat)}</div>`;}
function drawMarkers(){
  if(!LMAP||!window.L)return;
  Object.values(LMARKERS).forEach(m=>LMAP.removeLayer(m));LMARKERS={};
  SPOTS.forEach(s=>{
    if(mapFilter && s.cat!==mapFilter)return;
    const ic=L.divIcon({className:"",html:markerHTML(s,mapSel===s.id),iconSize:[32,32],iconAnchor:[16,16]});
    const m=L.marker([s.lat,s.lon],{icon:ic}).addTo(LMAP);
    m.on("click",()=>{mapSel=s.id;drawMarkers();refreshList();const r=document.querySelector('.spot[data-id="'+s.id+'"]');if(r)r.scrollIntoView({behavior:"smooth",block:"center"});});
    LMARKERS[s.id]=m;
  });
}
/* Centro de Messejana. O valor anterior (37.86875, -8.25120) ficava ~4 km a
   norte da vila: a zoom 16 o mapa abria em campo aberto, sem um único pin no
   ecrã, e só aparecia alguma coisa se o fitBounds mais abaixo tivesse 2+ pontos
   depois do filtro. Coordenadas confirmadas contra os spots e a Wikipédia. */
const MESSEJANA = [37.83278, -8.24278];

/* Camada de tiles com dupla origem: primeiro a cópia local (./tiles/), e só se
   essa faltar é que tenta o OpenStreetMap (o CARTO passou a exigir chave
   de API em Out 2026 e devolvia tiles com marca d'água). Offline e fora da área descarregada, o
   service worker devolve uma tile cinzenta em vez de um quadrado preto.
   As tiles locais geram-se com tools/baixar-tiles.py — ver README. */
const TileComFallback = L.TileLayer.extend({
  createTile: function(coords, done){
    const img = document.createElement('img');
    img.alt = '';
    const local  = './tiles/' + coords.z + '/' + coords.x + '/' + coords.y + '.png';
    const remoto = 'https://tile.openstreetmap.org/' +
                   coords.z + '/' + coords.x + '/' + coords.y + '.png';
    let caiuParaRemoto = false;
    img.onload  = () => done(null, img);
    img.onerror = () => {
      if (!caiuParaRemoto) { caiuParaRemoto = true; img.src = remoto; }
      else done(new Error('tile indisponível'), img);
    };
    img.src = local;
    return img;
  }
});

function initLeaflet(){
  if(!window.L){document.getElementById("leaflet").innerHTML='<div style="padding:20px;color:#5a5a5a;font-size:14px">Mapa indisponível.</div>';return;}
  LMAP=L.map("leaflet",{zoomControl:true,attributionControl:false,scrollWheelZoom:false}).setView(MESSEJANA,16);
  new TileComFallback('', {maxZoom:19, minZoom:13}).addTo(LMAP);
  L.control.attribution({prefix:false}).addAttribution('© OpenStreetMap contributors').addTo(LMAP);
  drawMarkers();
  const pts=SPOTS.filter(s=>(!mapFilter||s.cat===mapFilter)&&(mapFilter||!s.far)).map(s=>[s.lat,s.lon]);
  const ajusta=()=>{if(!LMAP)return;LMAP.invalidateSize();if(pts.length>1){try{LMAP.fitBounds(pts,{padding:[30,30],maxZoom:16});}catch(e){}}};
  ajusta();setTimeout(ajusta,200);
}
let USERMARK=null, USERRING=null;
function locateMe(btn){
  if(!LMAP||!navigator.geolocation){return;}
  const lbl=btn.textContent;
  btn.textContent=(LANG()==="pt"?"📍 A localizar…":"📍 Locating…");btn.disabled=true;
  navigator.geolocation.getCurrentPosition(pos=>{
    const ll=[pos.coords.latitude,pos.coords.longitude];
    const arrow='<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="15" fill="#ffffff" stroke="#2364ff" stroke-width="3"/><path d="M20 8 Q21.1 8 21.7 9.9 L26.5 24.8 Q27 26.7 25.1 26.1 L20.8 22.9 Q20 22.5 19.2 22.9 L14.9 26.1 Q13 26.7 13.5 24.8 L18.3 9.9 Q18.9 8 20 8 Z" fill="#2364ff" stroke="#2364ff" stroke-width="1.3" stroke-linejoin="round"/></svg>';
    const ic=L.divIcon({className:"",html:arrow,iconSize:[40,40],iconAnchor:[20,20]});
    if(USERMARK)LMAP.removeLayer(USERMARK);
    if(USERRING)LMAP.removeLayer(USERRING);
    USERRING=L.circle(ll,{radius:Math.max(pos.coords.accuracy||30,25),color:"#2364ff",weight:1,fillColor:"#2364ff",fillOpacity:0.10}).addTo(LMAP);
    USERMARK=L.marker(ll,{icon:ic,zIndexOffset:1000}).addTo(LMAP);
    LMAP.setView(ll,17);
    btn.textContent=lbl;btn.disabled=false;
  },err=>{
    btn.textContent=lbl;btn.disabled=false;
    alert(LANG()==="pt"?"Não consegui obter a tua localização. Verifica se deste permissão ao browser.":"Couldn't get your location. Check that you allowed the browser to use it.");
  },{enableHighAccuracy:true,timeout:10000,maximumAge:30000});
}

function openMap(id){mapSel=id||null;mapFilter=null;go("map");}

/* ================= botão Equipa → n8n → Telegram (Buinho Staff) + Sheet RESIDENCIES «PEDIDOS AIR» =================
   Sem emails. Envia como text/plain (sem preflight CORS). Se o n8n não responder (fluxo ainda não importado/activo,
   ou sem rede), abre o WhatsApp da equipa com a mensagem já escrita — nada se perde. */
const EQUIPA_WEBHOOK="https://buinho.app.n8n.cloud/webhook/welcome-air";
const EQUIPA_WHATSAPP="351939760933";   /* Produção / admin (residências) */
const CASAS=[{en:"Casa São João",pt:"Casa São João"},{en:"Casa da Avó",pt:"Casa da Avó"},{en:"Casa Buinho",pt:"Casa Buinho"},
  {en:"Casa da Padaria",pt:"Casa da Padaria"},{en:"Other / not staying",pt:"Outra / não estou alojado"}];
/* Feedback: 7 dimensões curtas (1–5) + recomendação + 2 perguntas abertas. Chaves = colunas f_* na PEDIDOS AIR. */
const FB_DIMS=[["antes",{en:"Info & contact before arriving",pt:"Informação e contacto antes de chegar"}],
  ["chegada",{en:"Arrival & welcome",pt:"Chegada e acolhimento"}],
  ["casa",{en:"The house (comfort, cleanliness)",pt:"A casa (conforto, limpeza)"}],
  ["fablab",{en:"FabLab & equipment",pt:"FabLab e equipamento"}],
  ["equipa",{en:"Support from the team",pt:"Apoio da equipa"}],
  ["aldeia",{en:"Village & community",pt:"Aldeia e comunidade"}],
  ["valor",{en:"Value for money",pt:"Relação qualidade/preço"}]];
const QUEM_KEY="buinho-quem-v1";
function quemSou(){try{return JSON.parse(localStorage.getItem(QUEM_KEY)||"{}");}catch(e){return {};}}
function guardarQuemSou(nome,casa){try{localStorage.setItem(QUEM_KEY,JSON.stringify({nome,casa}));}catch(e){}}
const TIPO_TXT={arrived:"Cheguei",problem:"Problema na casa",question:"Dúvida",feedback:"Feedback",booking:"Reserva FabLab"};
function enviarEquipa(d,done,fim){
  const pt=LANG()==="pt";const corpo=Object.assign({},d,{lang:LANG(),enviado:new Date().toISOString()});
  const ok=()=>{done.classList.add("show");done.textContent=pt?"✓ Enviado. A equipa já recebeu.":"✓ Sent. The team has it.";fim&&fim();};
  const plano=()=>{const txt=`[Welcome Buinho] ${TIPO_TXT[d.tipo]||d.tipo} — ${d.nome} (${d.casa})${d.nota?" · média "+d.nota+"/5":""}${d.mensagem?"\n"+d.mensagem:""}`;
    done.classList.add("show");done.innerHTML=esc(pt?"Não consegui enviar daqui. Toca para mandar pelo WhatsApp:":"Couldn't send from here. Tap to send it on WhatsApp:")+
      ` <a class="btn ghost" style="margin-top:8px" target="_blank" rel="noopener" href="https://wa.me/${EQUIPA_WHATSAPP}?text=${encodeURIComponent(txt)}">WhatsApp →</a>`;fim&&fim();};
  fetch(EQUIPA_WEBHOOK,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify(corpo)})
    .then(r=>r.ok?ok():plano()).catch(plano);
}

/* ================= agenda (Google Sheet «AGENDA AIR — Welcome Buinho») =================
   A equipa escreve no Sheet (uma linha por actividade; mostrar = «não» esconde sem apagar).
   A app lê-o pelo endpoint gviz em JSON (datas como Date(...), sem depender do locale do Sheet).
   Requisito: o Sheet partilhado como «qualquer pessoa com o link pode ver».
   Offline: guarda a última cópia boa em localStorage; sem nenhuma, mostra o ritmo típico do content.js. */
/* Fonte definitiva: aba AGENDA AIR do RESIDENCIES CONTROL MAP, publicada na web em CSV (só essa aba; o ficheiro fica privado).
   Cola aqui o link «Publicar na Web → CSV». Enquanto estiver vazio, a app lê o Sheet provisório (gviz). */
const AGENDA_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vTuIC8nLTMgraHygpgZV8oLuoYvKs6jV3BTbzNHqKBzrM1k0KBXl0AF8824DlfkGIMV1cRxDjuGCecX/pub?gid=1366786598&single=true&output=csv";
const AGENDA_URL="https://docs.google.com/spreadsheets/d/1svol-yvGRVloQFeEGtUDbHupX_fan8OkiJh_AQAUKRc/gviz/tq?tqx=out:json&headers=1";
const AGENDA_KEY="buinho-agenda-v1";
let AGENDA=null;
try{AGENDA=JSON.parse(localStorage.getItem(AGENDA_KEY)||"null");}catch(e){AGENDA=null;}
const p2=n=>String(n).padStart(2,"0");
function agCel(c){
  if(!c||c.v==null)return "";
  const v=c.v;
  if(Array.isArray(v))return p2(v[0])+":"+p2(v[1]);                       /* hora (timeofday) */
  if(typeof v==="string"){const m=v.match(/^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+))?/);  /* mês 0-based */
    if(m&&m[1]==="1899"&&m[4]!=null)return p2(m[4])+":"+p2(m[5]);          /* hora: o Sheets manda Date(1899,11,30,h,m,s) */
    if(m)return m[1]+"-"+p2(+m[2]+1)+"-"+p2(m[3]);
    return v.trim();}
  return c.f!=null?String(c.f):String(v);
}
function agLer(json){
  const tb=json.table, cols=tb.cols.map(c=>(c.label||"").trim().toLowerCase());
  const ix=k=>cols.indexOf(k);
  return tb.rows.map(r=>{const g=k=>ix(k)<0?"":agCel(r.c[ix(k)]);
    return {data:g("data"),ini:g("hora_inicio"),fim:g("hora_fim"),tpt:g("titulo_pt"),ten:g("titulo_en"),
            local:g("local"),npt:g("notas_pt"),nen:g("notas_en"),mostrar:g("mostrar")};
  }).filter(a=>/^\d{4}-\d{2}-\d{2}$/.test(a.data)&&(a.tpt||a.ten));
}
function agendaProxima(){
  if(!AGENDA||!AGENDA.rows)return [];
  const h=new Date(),hoje=h.getFullYear()+"-"+p2(h.getMonth()+1)+"-"+p2(h.getDate());
  return AGENDA.rows.filter(a=>!/^(n[ãa]o|no|n)$/i.test(a.mostrar)&&a.data>=hoje)
    .sort((a,b)=>(a.data+a.ini).localeCompare(b.data+b.ini));
}
/* CSV simples com aspas (o formato do «Publicar na Web»). */
function csvLinhas(txt){const out=[];let row=[],f="",q=false;
  for(let i=0;i<txt.length;i++){const c=txt[i];
    if(q){if(c==='"'){if(txt[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}
    else if(c==='"')q=true;else if(c===","){row.push(f);f="";}
    else if(c==="\n"||c==="\r"){if(c==="\r"&&txt[i+1]==="\n")i++;row.push(f);out.push(row);row=[];f="";}
    else f+=c;}
  if(f!==""||row.length){row.push(f);out.push(row);}return out;}
function agNormData(s){s=(s||"").trim();let m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(m)return m[1]+"-"+p2(m[2])+"-"+p2(m[3]);
  m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(m)return m[3]+"-"+p2(m[2])+"-"+p2(m[1]);return s;}   /* dd/mm/aaaa (locale PT) */
const agNormHora=s=>{const m=(s||"").match(/(\d{1,2}):(\d{2})/);return m?p2(m[1])+":"+m[2]:(s||"").trim();};
function agLerCSV(txt){const L=csvLinhas(txt).filter(r=>r.some(x=>x.trim()));if(!L.length)return [];
  const cols=L[0].map(c=>c.trim().toLowerCase()),ix=k=>cols.indexOf(k);
  return L.slice(1).map(r=>{const g=k=>ix(k)<0?"":(r[ix(k)]||"").trim();
    return {data:agNormData(g("data")),ini:agNormHora(g("hora_inicio")),fim:agNormHora(g("hora_fim")),tpt:g("titulo_pt"),ten:g("titulo_en"),
            local:g("local"),npt:g("notas_pt"),nen:g("notas_en"),mostrar:g("mostrar")};
  }).filter(a=>/^\d{4}-\d{2}-\d{2}$/.test(a.data)&&(a.tpt||a.ten));}
function actualizarAgenda(){
  const csv=!!AGENDA_CSV_URL;
  return fetch(csv?AGENDA_CSV_URL:AGENDA_URL,{cache:"no-store"}).then(r=>r.text()).then(txt=>{
    let rows;
    if(csv){rows=agLerCSV(txt);}
    else{const json=JSON.parse(txt.slice(txt.indexOf("(")+1,txt.lastIndexOf(")")));if(json.status!=="ok")return;rows=agLer(json);}
    AGENDA={rows,at:new Date().toISOString()};
    try{localStorage.setItem(AGENDA_KEY,JSON.stringify(AGENDA));}catch(e){}
    if((location.hash||"").slice(1)==="schedule")route();
  }).catch(()=>{});
}

/* ================= GUIA AIR (aba do RESIDENCIES CONTROL MAP, publicada em CSV) + assistente ================= */
const GUIA_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vTuIC8nLTMgraHygpgZV8oLuoYvKs6jV3BTbzNHqKBzrM1k0KBXl0AF8824DlfkGIMV1cRxDjuGCecX/pub?gid=1761809381&single=true&output=csv";
const GUIA_ASK_URL="https://buinho.app.n8n.cloud/webhook/welcome-air-ask";
const GUIA_KEY="buinho-guia-v1";
const SEC_NOME={Chegada:{en:"Arriving",pt:"Chegada"},Casa:{en:"The house",pt:"A casa"},Buinho:{en:"Buinho & FabLab",pt:"Buinho e FabLab"},
  Messejana:{en:"Messejana & around",pt:"Messejana e arredores"},Ajuda:{en:"Help",pt:"Ajuda"},"Saída":{en:"Leaving",pt:"Saída"}};
/* perguntas em EN (a coluna do Sheet tem só a pergunta em PT) */
const PERG_EN={"Que carrinhas passam na vila (pão, fruta, peixe)?":"Which vans come through the village (bread, fruit, fish)?","Onde é o ponto de chegada?":"Where do I arrive?","Como chego desde Lisboa?":"How do I get here from Lisbon?",
  "Como chego desde o aeroporto de Faro?":"How do I get here from Faro airport?","E se chegar fora de horas?":"What if I arrive late?",
  "Qual é o Wi-Fi?":"What's the Wi-Fi?","Regras da casa":"House rules","Há roupa de cama e toalhas?":"Are bed linen and towels provided?",
  "Onde lavo e seco a roupa?":"Where can I do laundry?","Como funciona a água quente?":"How does the hot water work?",
  "Como funciona o aquecimento / ar condicionado?":"How do heating / air conditioning work?","As chaves e a fechadura têm alguma particularidade?":"Anything special about keys and locks?",
  "Lixo: onde está o contentor e quando passa o camião?":"Rubbish: where is the bin and when is collection?","O que faço se faltar a luz ou a água?":"What if the power or water goes off?",
  "O que é o Buinho?":"What is Buinho?","Qual é o horário do FabLab?":"What are the FabLab hours?","Como reservo uma máquina?":"How do I book a machine?",
  "Os materiais estão incluídos?":"Are materials included?","Há apresentação final / dia aberto?":"Is there a final presentation / open studio?",
  "Onde compro comida?":"Where can I buy food?","Onde posso comer fora?":"Where can I eat out?","Há multibanco? Aceitam cartão?":"Is there an ATM? Do places take cards?",
  "Como me desloco (autocarros, táxi)?":"How do I get around (buses, taxi)?","Onde é a piscina?":"Where is the swimming pool?",
  "O que vale a pena ver por perto?":"What's worth seeing nearby?","Emergência":"Emergency","Tenho um problema na casa ou uma dúvida":"I have a problem in the house or a question",
  "O que faço antes de sair?":"What do I do before leaving?"};
let GUIA=null;
try{GUIA=JSON.parse(localStorage.getItem(GUIA_KEY)||"null");}catch(e){GUIA=null;}
function guiaVisivel(){return (GUIA&&GUIA.rows||[]).filter(g=>!/^(n[ãa]o|no|n)$/i.test(g.mostrar||"")&&(g.pt||g.en));}
function actualizarGuia(){
  return fetch(GUIA_CSV_URL,{cache:"no-store"}).then(r=>r.text()).then(txt=>{
    const L=csvLinhas(txt).filter(r=>r.some(x=>x.trim()));if(L.length<2)return;
    const cols=L[0].map(c=>c.trim().toLowerCase()),ix=k=>cols.indexOf(k);
    const rows=L.slice(1).map(r=>{const g=k=>ix(k)<0?"":(r[ix(k)]||"").trim();const p=g("pergunta");
      return {secao:g("secao"),casa:g("casa"),pergunta:p,pergunta_en:g("pergunta_en")||PERG_EN[p]||"",pt:g("resposta_pt"),en:g("resposta_en"),mostrar:g("mostrar")};}).filter(g=>g.pergunta);
    GUIA={rows,at:new Date().toISOString()};
    try{localStorage.setItem(GUIA_KEY,JSON.stringify(GUIA));}catch(e){}
    if((location.hash||"").slice(1)==="house")route();
  }).catch(()=>{});
}
function idDispositivo(){try{let d=localStorage.getItem("buinho-dev");if(!d){d=(crypto.randomUUID?crypto.randomUUID():String(Math.random()).slice(2));localStorage.setItem("buinho-dev",d);}return d;}catch(e){return "anon";}}
function perguntarGuia(q){const pt=LANG()==="pt";
  const falha=pt?"Não consegui responder agora. Vai a «Falar com a equipa» e a equipa responde-te.":"I couldn't answer right now. Go to «Talk to the team» and the team will reply.";
  return fetch(GUIA_ASK_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=UTF-8"},body:JSON.stringify({q,dev:idDispositivo(),lang:LANG()})})
    .then(r=>r.ok?r.json():null).then(j=>{
      if(j&&j.answer)return j.answer;
      if(j&&(j.motivo==="limite_dev"||j.motivo==="limite_dia"))return pt?"Por hoje o guia já respondeu a muitas perguntas. Vai a «Falar com a equipa».":"The guide has answered a lot of questions today. Go to «Talk to the team».";
      return falha;}).catch(()=>falha);
}

/* ================= MAPA: lido da aba MAPA AIR (Sheet das residências); spots.js é a reserva offline ================= */
const MAPA_CSV_URL="https://docs.google.com/spreadsheets/d/e/2PACX-1vTuIC8nLTMgraHygpgZV8oLuoYvKs6jV3BTbzNHqKBzrM1k0KBXl0AF8824DlfkGIMV1cRxDjuGCecX/pub?gid=1008745359&single=true&output=csv";
const MAPA_KEY="buinho-mapa-v1";
const CAT_PT={"buinho":"buinho","lojas":"shop","loja":"shop","comer e café":"food","comer":"food","café":"food","saúde":"health","saude":"health","serviços":"money","servicos":"money","património":"culture","patrimonio":"culture","cultura":"culture","ar livre":"nature","desporto":"nature"};
const slug=x=>String(x).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function aplicarMapa(rows){if(!rows||rows.length<3)return false;
  SPOTS.length=0;rows.forEach(r=>SPOTS.push(r));return true;}
function mapaLerCSV(txt){const L=csvLinhas(txt).filter(r=>r.some(x=>x.trim()));if(L.length<2)return [];
  const cols=L[0].map(c=>c.trim().toLowerCase()),ix=k=>cols.indexOf(k);const ids={};
  return L.slice(1).map(r=>{const g=k=>ix(k)<0?"":(r[ix(k)]||"").trim();
    if(/^(n[ãa]o|no|n)$/i.test(g("mostrar")))return null;
    const cat=CAT_PT[g("categoria").toLowerCase()];const lat=parseFloat(g("lat").replace(",",".")),lon=parseFloat(g("lon").replace(",","."));
    if(!cat||!isFinite(lat)||!isFinite(lon))return null;
    let id=slug(g("nome_en")||g("nome_pt"))||"p";while(ids[id])id+="-2";ids[id]=1;
    if(cat==="buinho"&&/sede|hq/i.test(g("nome_pt")+g("nome_en")))id="hq";
    const far=Math.hypot((lat-37.8335)*111,(lon+8.244)*88)>0.7;
    return {id,cat,lat,lon,far,addr:g("morada")||undefined,
      name:{pt:g("nome_pt")||g("nome_en"),en:g("nome_en")||g("nome_pt")},
      hours:{pt:g("horario_pt")||g("horario_en"),en:g("horario_en")||g("horario_pt")},
      note:{pt:g("nota_pt")||g("nota_en"),en:g("nota_en")||g("nota_pt")}};}).filter(Boolean);}
try{const c=JSON.parse(localStorage.getItem(MAPA_KEY)||"null");if(c&&c.rows)aplicarMapa(c.rows);}catch(e){}
function actualizarMapa(){
  return fetch(MAPA_CSV_URL,{cache:"no-store"}).then(r=>r.ok?r.text():"").then(txt=>{
    const rows=mapaLerCSV(txt);if(!aplicarMapa(rows))return;
    try{localStorage.setItem(MAPA_KEY,JSON.stringify({rows,at:new Date().toISOString()}));}catch(e){}
    const h=(location.hash||"").slice(1);if(h==="map"||h==="house")route();
  }).catch(()=>{});
}

/* ================= router ================= */
function go(id){location.hash=id?("#"+id):"#home";}
function route(){
  let id=(location.hash||"#home").slice(1);if(id==="reserve")id="fablab";if(id==="local")id="house";
  const home=document.getElementById("v-home"),det=document.getElementById("v-detail"),map=document.getElementById("v-map"),back=document.getElementById("backbtn");
  [home,det,map].forEach(x=>x.classList.remove("active"));
  const brand=document.getElementById("brand");
  const inner=(id!=="home"&&id&&(id==="map"||DETAIL[id]));
  back.style.display=inner?"inline-block":"none";
  brand.style.display=inner?"none":"flex";
  if(id==="home"||!id){home.classList.add("active");}
  else if(id==="map"){renderMap();map.classList.add("active");}
  else if(DETAIL[id]){det.innerHTML="";det.appendChild(DETAIL[id]());det.classList.add("active");}
  else{home.classList.add("active");brand.style.display="flex";back.style.display="none";}
  window.scrollTo(0,0);
  document.querySelectorAll(".bottombar button").forEach(b=>b.classList.toggle("on",b.dataset.go===id||(id==="home"&&b.dataset.go==="home")));
}
function setLang(l){M.lang=l;document.querySelectorAll(".lang button").forEach(b=>b.classList.toggle("on",b.dataset.l===l));document.getElementById("brandname").textContent=t(C.appName);renderHome();route();}

document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll(".lang button").forEach(b=>b.onclick=()=>setLang(b.dataset.l));
  document.getElementById("backbtn").onclick=()=>go("home");
  document.querySelectorAll(".bottombar button").forEach(b=>b.onclick=()=>go(b.dataset.go));
  renderHome();route();window.addEventListener("hashchange",route);
  actualizarAgenda();
  actualizarGuia();
  actualizarMapa();
});

/* ================= PWA: registar o service worker (offline + instalável) ================= */
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  });
}
