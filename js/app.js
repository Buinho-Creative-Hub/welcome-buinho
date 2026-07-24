/* ============================================================================
   app.js — welcome-buinho (lógica: i18n, frieze de azulejo, vistas, mapa, router)
   ----------------------------------------------------------------------------
   Depende de: content.js (objecto C) e spots.js (CATS + SPOTS), carregados antes.
   Mapa: Leaflet + tiles CARTO Positron (carregados do CDN no index.html).

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
    <div class="row"><span class="k">${LANG()==="pt"?"Morada":"Address"}</span><span class="v"><a href="#" data-map="fablab">Rua [•••], Messejana</a></span></div>
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
  v.appendChild(ul);
  v.appendChild(el("div","foot","Buinho FabLab · Messejana, Alentejo · CC-BY-SA 4.0"));
}

/* ================= DETAIL ================= */
function head(title,lead){const w=el("div");w.appendChild(el("h2","h2",esc(t(title))));if(lead)w.appendChild(el("p","lead",esc(t(lead))));return w;}
function secTitle(id){return C.sections.find(s=>s.id===id).title;}
function block(title,html){const b=el("div","block");if(title)b.appendChild(el("h3",null,esc(t(title))));if(html)b.insertAdjacentHTML("beforeend",html);return b;}

const DETAIL={
  arrival(){const d=C.arrival,v=el("div");v.appendChild(head(secTitle("arrival"),d.intro));
    d.blocks.forEach(bk=>v.appendChild(block(bk.t,`<p>${esc(t(bk.b))}</p>`)));
    const a=el("button","btn ghost",t(d.mapLabel)+" →");a.onclick=()=>openMap("fablab");v.appendChild(a);return v;},
  house(){const d=C.house,v=el("div");v.appendChild(head(secTitle("house"),d.intro));
    v.appendChild(block({en:"Wi-Fi",pt:"Wi-Fi"},`<div class="kv"><span class="k">SSID</span><span class="v">${esc(d.wifi.net)}</span></div><div class="kv"><span class="k">Password</span><span class="v">${esc(d.wifi.pass)}</span></div>`));
    const r=el("div","block");r.appendChild(el("h3",null,LANG()==="pt"?"Regras da casa":"House rules"));
    const ul=el("ul","rules");t(d.rules).forEach(x=>ul.appendChild(el("li",null,esc(x))));r.appendChild(ul);v.appendChild(r);return v;},
  fablab(){const d=C.fablab,v=el("div");v.appendChild(head(secTitle("fablab"),d.intro));
    d.machines.forEach(m=>{const tag=m.book?`<span class="mtag">${LANG()==="pt"?"reserva":"booking"}</span>`:"";
      const b=block(null,`<h3>${esc(t(m.name))}${tag}</h3><p>${esc(t(m.notes))}</p>`);
      if(m.book){const rb=el("button","btn ghost",(LANG()==="pt"?"Reservar":"Reserve")+" →");rb.onclick=()=>{go("reserve");setTimeout(()=>{const s=document.getElementById("res-m");if(s)s.value=m.id;},50);};b.appendChild(rb);}
      v.appendChild(b);});return v;},
  schedule(){const d=C.schedule,v=el("div");v.appendChild(head(secTitle("schedule"),d.intro));
    d.items.forEach(it=>v.appendChild(block(it.w,`<p>${esc(t(it.x))}</p>`)));return v;},
  contacts(){const d=C.contacts,v=el("div");v.appendChild(head(secTitle("contacts")));
    const sos=el("div","sos");sos.innerHTML=`<div class="n">112</div><div><strong>${esc(t(d.emgLabel))}</strong></div>`;v.appendChild(sos);
    const call=el("a","btn red","📞 112");call.href="tel:112";v.appendChild(call);
    const ppl=el("div","block");ppl.style.marginTop="16px";ppl.appendChild(el("h3",null,LANG()==="pt"?"Equipa":"Team"));
    d.people.forEach(p=>{const row=el("div","kv");row.innerHTML=`<span class="k">${esc(t(p.r))} · ${esc(p.nm)}</span><a class="v" href="tel:${esc(p.ph)}">${esc(p.ph)}</a>`;ppl.appendChild(row);});v.appendChild(ppl);
    const pr=el("div","block");pr.appendChild(el("h3",null,LANG()==="pt"?"Prático":"Practical"));
    d.practical.forEach(x=>{const row=el("div","kv");row.innerHTML=`<span class="k">${esc(t(x.l))}</span><span class="v">${esc(t(x.v))}</span>`;pr.appendChild(row);});v.appendChild(pr);return v;},
  local(){const v=el("div");v.appendChild(head(secTitle("local"),C.local.intro));
    v.insertAdjacentHTML("beforeend",frieze("#159a6b"));
    const openBtn=el("button","btn","🗺 "+(LANG()==="pt"?"Abrir o mapa de Messejana":"Open the Messejana map"));openBtn.onclick=()=>go("map");v.appendChild(openBtn);
    const ul=el("div");ul.style.marginTop="8px";
    SPOTS.filter(s=>s.id!=="fablab").forEach(s=>ul.appendChild(spotRow(s)));v.appendChild(ul);return v;},
  checkin(){const v=el("div");v.appendChild(head(secTitle("checkin"),{en:"Let us know you've arrived safely.",pt:"Avisa-nos que chegaste em segurança."}));
    const f=el("div");f.innerHTML=`
      <label class="f">${LANG()==="pt"?"Nome":"Name"}</label><input id="ci-name">
      <label class="f">${LANG()==="pt"?"Quarto / casa":"Room / house"}</label><input id="ci-room">
      <div class="two"><div><label class="f">${LANG()==="pt"?"Chegada":"Arrival"}</label><input id="ci-date" type="date"></div>
      <div><label class="f">${LANG()==="pt"?"Telefone":"Phone"}</label><input id="ci-phone"></div></div>
      <label class="f">${LANG()==="pt"?"Contacto de emergência":"Emergency contact"}</label><input id="ci-emg">
      <label class="f">${LANG()==="pt"?"Alergias / notas de saúde":"Allergies / health notes"}</label><textarea id="ci-notes" rows="2"></textarea>`;v.appendChild(f);
    const btn=el("button","btn","✓ "+(LANG()==="pt"?"Confirmar chegada":"Confirm arrival"));
    const done=el("div","done");const send=el("a","btn ghost","📨 "+(LANG()==="pt"?"Enviar à equipa":"Send to team"));send.style.display="none";
    btn.onclick=()=>{done.classList.add("show");done.textContent=LANG()==="pt"?"✓ Guardado. Toca abaixo para avisar a equipa.":"✓ Saved. Tap below to notify the team.";
      const body=encodeURIComponent(`Buinho check-in:\nName: ${val('ci-name')}\nRoom: ${val('ci-room')}\nArrival: ${val('ci-date')}\nPhone: ${val('ci-phone')}\nEmergency: ${val('ci-emg')}\nNotes: ${val('ci-notes')}`);
      send.href=`mailto:info.alcobia@gmail.com?subject=${encodeURIComponent('AIR check-in — '+val('ci-name'))}&body=${body}`;send.style.display="inline-flex";};
    v.appendChild(btn);v.appendChild(done);v.appendChild(send);return v;},
  reserve(){const v=el("div");v.appendChild(head(secTitle("reserve"),{en:"Pick a machine and a slot. The team confirms.",pt:"Escolhe máquina e horário. A equipa confirma."}));
    const opts=C.fablab.machines.filter(m=>m.book).map(m=>`<option value="${m.id}">${esc(t(m.name))}</option>`).join("");
    const f=el("div");f.innerHTML=`<label class="f">${LANG()==="pt"?"Máquina":"Machine"}</label><select id="res-m">${opts}</select>
      <label class="f">${LANG()==="pt"?"Nome":"Name"}</label><input id="res-name">
      <div class="two"><div><label class="f">${LANG()==="pt"?"Dia":"Day"}</label><input id="res-date" type="date"></div>
      <div><label class="f">${LANG()==="pt"?"Hora":"Time"}</label><input id="res-time" type="time"></div></div>
      <label class="f">${LANG()==="pt"?"Notas (opcional)":"Notes (optional)"}</label><textarea id="res-notes" rows="2"></textarea>`;v.appendChild(f);
    const btn=el("button","btn","📌 "+(LANG()==="pt"?"Pedir reserva":"Request booking"));const done=el("div","done");const send=el("a","btn ghost","📨 "+(LANG()==="pt"?"Enviar pedido":"Send request"));send.style.display="none";
    btn.onclick=()=>{const mN=document.querySelector('#res-m option:checked').textContent;done.classList.add("show");done.textContent=LANG()==="pt"?"✓ Pedido pronto. Toca em enviar.":"✓ Request ready. Tap send.";
      const body=encodeURIComponent(`Booking:\nMachine: ${mN}\nName: ${val('res-name')}\nDay: ${val('res-date')}\nTime: ${val('res-time')}\nNotes: ${val('res-notes')}`);
      send.href=`mailto:info.alcobia@gmail.com?subject=${encodeURIComponent('FabLab booking — '+mN)}&body=${body}`;send.style.display="inline-flex";};
    v.appendChild(btn);v.appendChild(done);v.appendChild(send);return v;}
};

/* ================= MAP ================= */
let mapFilter=null, mapSel=null;
function spotRow(s){
  const c=CATS[s.cat];
  const row=el("div","spot");row.dataset.id=s.id;
  row.innerHTML=`<span class="sq" style="background:${c.color}">${catGlyph(s.cat)}</span>
    <div><div class="nm">${esc(t(s.name))}</div><div class="meta">${esc(t(c.label))} · ${esc(t(s.hours))} — ${esc(t(s.note))}</div></div>
    <a class="go" href="https://maps.google.com/?q=Messejana,Aljustrel" target="_blank" rel="noopener">${LANG()==="pt"?"Ir":"Go"} →</a>`;
  row.onclick=e=>{if(e.target.closest('.go'))return;openMap(s.id);};
  return row;
}
let LMAP=null, LMARKERS={};
function renderMap(){
  const v=document.getElementById("v-map");v.innerHTML="";LMAP=null;LMARKERS={};
  v.appendChild(head({en:"Messejana map",pt:"Mapa de Messejana"},{en:"The village, from your door. Tap a pin or a place.",pt:"A aldeia, a partir da tua porta. Toca num pino ou num sítio."}));
  const wrap=el("div","mapwrap");wrap.innerHTML='<div id="leaflet"></div>';v.appendChild(wrap);
  // category filters
  const cats=el("div","cats");
  const all=el("span","cat"+(mapFilter===null?" on":""),(LANG()==="pt"?"Todos":"All"));all.onclick=()=>{mapFilter=null;drawMarkers();refreshList();cats.querySelectorAll('.cat').forEach(x=>x.classList.remove('on'));all.classList.add('on');};cats.appendChild(all);
  Object.entries(CATS).forEach(([k,c])=>{const b=el("span","cat"+(mapFilter===k?" on":""));
    b.innerHTML=`<span class="sw" style="background:${c.color}"></span>${esc(t(c.label))}`;
    b.onclick=()=>{mapFilter=(mapFilter===k?null:k);renderMap();};cats.appendChild(b);});
  v.appendChild(cats);
  const listWrap=el("div");listWrap.id="spotlist";v.appendChild(listWrap);
  refreshList();
  v.appendChild(el("div","editnote",(LANG()==="pt"
    ?"<b>Editável:</b> a equipa muda estes pontos (nome, categoria, horário, coordenadas) num só sítio — o ficheiro <b>spots</b>, importado do Google My Maps do Buinho — sem programar. Editor visual dentro da app fica para a fase com backend."
    :"<b>Editable:</b> the team edits these points (name, category, hours, coordinates) in one place — the <b>spots</b> file, imported from Buinho's Google My Maps — no coding. In-app visual editor comes with the backend phase.")));
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
   essa faltar é que tenta o CARTO. Offline e fora da área descarregada, o
   service worker devolve uma tile cinzenta em vez de um quadrado preto.
   As tiles locais geram-se com tools/baixar-tiles.py — ver README. */
const TileComFallback = L.TileLayer.extend({
  createTile: function(coords, done){
    const img = document.createElement('img');
    img.alt = '';
    const local  = './tiles/' + coords.z + '/' + coords.x + '/' + coords.y + '.png';
    const remoto = 'https://a.basemaps.cartocdn.com/light_all/' +
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
  L.control.attribution({prefix:false}).addAttribution('© OpenStreetMap · © CARTO').addTo(LMAP);
  drawMarkers();
  const pts=SPOTS.filter(s=>!mapFilter||s.cat===mapFilter).map(s=>[s.lat,s.lon]);
  if(pts.length>1){try{LMAP.fitBounds(pts,{padding:[38,38],maxZoom:16});}catch(e){}}
  setTimeout(()=>LMAP&&LMAP.invalidateSize(),200);
}
function openMap(id){mapSel=id||null;mapFilter=null;go("map");}

/* ================= router ================= */
function go(id){location.hash=id?("#"+id):"#home";}
function route(){
  const id=(location.hash||"#home").slice(1);
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
});

/* ================= PWA: registar o service worker (offline + instalável) ================= */
if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  });
}
