/* WELCOME · BUINHO AIR — app logic (vanilla JS, no build step)
   Bilingual EN/PT, hash router, interactive layers with localStorage.
   Backend hook for v1.1 is marked: search "BACKEND HOOK". */

const STORE = {
  get lang(){ return localStorage.getItem('buinho_lang') || 'en'; },
  set lang(v){ localStorage.setItem('buinho_lang', v); },
  getJSON(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; } },
  setJSON(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
};
const L = () => STORE.lang;
const t = (o) => (o && typeof o === 'object') ? (o[L()] ?? o.en) : o;
const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const esc = (s) => String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- shell render ---------- */
function renderShell(){
  document.getElementById('brand-name').textContent = t(CONTENT.appName);
  document.querySelectorAll('.lang button').forEach(b=>{
    b.classList.toggle('on', b.dataset.l===L());
  });
}

/* ---------- HOME ---------- */
function renderHome(){
  const v = document.getElementById('view-home');
  v.innerHTML='';
  const hero = el('div','hero');
  hero.appendChild(el('h1', null, `${esc(t(CONTENT.appName))} <span class="accent">·</span>`));
  hero.appendChild(el('p', null, esc(t(CONTENT.tagline))));
  v.appendChild(hero);

  const grid = el('div','grid');
  CONTENT.sections.forEach(s=>{
    const wide = (s.id==='checkin');
    const c = el('div','card'+(wide?' wide accent':''));
    c.innerHTML = `<div class="ic">${s.icon}</div><div class="t">${esc(t(s.title))}</div>`;
    c.onclick = ()=> go(s.id);
    grid.appendChild(c);
  });
  v.appendChild(grid);
  v.appendChild(el('div','foot','Buinho FabLab · Messejana, Alentejo · CC-BY-SA 4.0'));
}

/* ---------- generic detail header ---------- */
function viewHead(title, lead){
  const wrap = el('div');
  wrap.appendChild(el('h2', null, esc(t(title))));
  if(lead) wrap.appendChild(el('p','lead', esc(t(lead))));
  return wrap;
}
function block(title, bodyHTML){
  const b = el('div','block');
  if(title) b.appendChild(el('h3', null, esc(t(title))));
  if(bodyHTML) b.insertAdjacentHTML('beforeend', bodyHTML);
  return b;
}

/* ---------- ARRIVAL ---------- */
function viewArrival(){
  const d = CONTENT.arrival, v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='arrival').title, d.intro));
  d.blocks.forEach(bk=> v.appendChild(block(bk.title, `<p>${esc(t(bk.body))}</p>`)));
  const a = el('a','btn'); a.href=d.mapUrl; a.target='_blank'; a.rel='noopener';
  a.textContent = '📍 '+t(d.mapLabel); v.appendChild(a);
  return v;
}

/* ---------- MAP & SERVICES (Leaflet + OpenStreetMap, no API key) ---------- */
let _map = null;            // Leaflet map instance (rebuilt each time the view opens)
let _markers = {};         // cat -> [marker,...]  for filtering
const CATCOLOR = {
  buinho:'#2364ff', grocery:'#17a06b', bakery:'#d98a15', pharmacy:'#ff5050',
  food:'#8b5cf6', health:'#e11d48', money:'#0ea5e9', transport:'#6366f1', nature:'#0ea371'
};
function dirUrl(p){ return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`; }
function catMeta(cat){ return (CONTENT.map.categories[cat]) || { en:cat, pt:cat, icon:'📍' }; }

function viewMap(){
  const d = CONTENT.map, v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='map').title, d.intro));

  // If Leaflet failed to load (e.g. offline first run), degrade gracefully.
  if(typeof window.L === 'undefined'){
    v.appendChild(block(null,
      `<p>${L()==='pt'
        ? 'O mapa precisa de internet na primeira abertura. Sem ligação agora — mas tens a lista de sítios abaixo.'
        : 'The map needs internet on first open. You seem offline — the list of places is below.'}</p>`));
  }

  // ----- category filter chips -----
  const cats = Object.keys(d.categories);
  const active = new Set(cats);              // all on by default
  const chips = el('div','mapchips');
  cats.forEach(cat=>{
    const m = catMeta(cat);
    const chip = el('button','chip on');
    chip.style.setProperty('--pc', CATCOLOR[cat]||'#2364ff');
    chip.innerHTML = `<span class="cd"></span>${m.icon} ${esc(t(m))}`;
    chip.onclick = ()=>{
      const on = chip.classList.toggle('on');
      if(on) active.add(cat); else active.delete(cat);
      applyFilter();
    };
    chips.appendChild(chip);
  });
  v.appendChild(chips);

  // ----- map container -----
  const mapBox = el('div'); mapBox.id = 'map';
  v.appendChild(mapBox);

  // ----- synced list of places -----
  const list = el('div','placelist');
  d.places.forEach((p, i)=>{
    const m = catMeta(p.cat);
    const card = el('div','placecard');
    card.dataset.cat = p.cat;
    card.style.setProperty('--pc', CATCOLOR[p.cat]||'#2364ff');
    card.innerHTML =
      `<div class="pc-ic">${m.icon}</div>
       <div class="pc-body">
         <div class="pc-name">${esc(t(p.name))}</div>
         <div class="pc-note">${esc(t(p.note))}</div>
         <div class="pc-meta">🕐 ${esc(t(p.hours))}${p.address?` · ${esc(p.address)}`:''}</div>
         <a class="pc-dir" href="${dirUrl(p)}" target="_blank" rel="noopener">🧭 ${L()==='pt'?'Como ir':'Directions'}</a>
       </div>`;
    card.querySelector('.pc-dir').onclick = (e)=> e.stopPropagation();
    card.onclick = ()=>{ if(_map){ _map.setView([p.lat,p.lng], 17); const mk=(_markers[p.cat]||[])[0]; }
      openMarker(i); window.scrollTo({top:0,behavior:'smooth'}); };
    card.dataset.idx = i;
    list.appendChild(card);
  });
  v.appendChild(list);

  // keep a reference so openMarker/applyFilter can reach the DOM cards
  v._list = list;

  // ----- build the Leaflet map AFTER the view is in the DOM -----
  const flatMarkers = [];
  function buildMap(){
    if(typeof window.L === 'undefined') return;      // no Leaflet, list-only mode
    if(_map){ try{ _map.remove(); }catch{} _map=null; }
    _markers = {};
    _map = L.map('map', { scrollWheelZoom:false }).setView([d.center.lat, d.center.lng], d.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(_map);

    d.places.forEach((p, i)=>{
      const color = CATCOLOR[p.cat]||'#2364ff';
      const m = catMeta(p.cat);
      const icon = L.divIcon({
        className:'', iconSize:[34,34], iconAnchor:[17,34], popupAnchor:[0,-30],
        html:`<div class="pin" style="--pc:${color}">${m.icon}</div>`
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(_map);
      marker.bindPopup(
        `<div class="pop">
           <div class="pop-t">${esc(t(p.name))}</div>
           <div class="pop-c" style="color:${color}">${m.icon} ${esc(t(m))}</div>
           <div class="pop-h">🕐 ${esc(t(p.hours))}</div>
           ${p.address?`<div class="pop-a">📍 ${esc(p.address)}</div>`:''}
           <a class="pop-d" href="${dirUrl(p)}" target="_blank" rel="noopener">🧭 ${L()==='pt'?'Como ir':'Directions'}</a>
         </div>`);
      (_markers[p.cat] = _markers[p.cat]||[]).push(marker);
      flatMarkers[i] = marker;
      marker.on('click', ()=> {
        const c = list.querySelector(`.placecard[data-idx="${i}"]`);
        if(c){ c.classList.add('flash'); setTimeout(()=>c.classList.remove('flash'),1200); }
      });
    });
    // Leaflet needs a size recalculation when its container was just inserted.
    setTimeout(()=>{ try{ _map.invalidateSize(); }catch{} }, 120);
  }
  window._openMarkerImpl = (i)=>{ if(flatMarkers[i]) flatMarkers[i].openPopup(); };

  function applyFilter(){
    // markers
    Object.keys(_markers).forEach(cat=>{
      _markers[cat].forEach(mk=>{
        if(active.has(cat)){ if(!_map.hasLayer(mk)) mk.addTo(_map); }
        else { if(_map.hasLayer(mk)) _map.removeLayer(mk); }
      });
    });
    // list cards
    list.querySelectorAll('.placecard').forEach(c=>{
      c.style.display = active.has(c.dataset.cat) ? '' : 'none';
    });
  }
  v._buildMap = buildMap;
  v._applyFilter = applyFilter;
  return v;
}
function openMarker(i){ if(window._openMarkerImpl) window._openMarkerImpl(i); }

/* ---------- HOUSE ---------- */
function viewHouse(){
  const d = CONTENT.house, v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='house').title, d.intro));
  v.appendChild(block(d.wifi.label,
    `<div class="kv"><span class="k">SSID</span><span class="v">${esc(d.wifi.network)}</span></div>
     <div class="kv"><span class="k">Password</span><span class="v">${esc(d.wifi.password)}</span></div>`));
  const rules = el('div','block');
  rules.appendChild(el('h3', null, L()==='pt'?'Regras da casa':'House rules'));
  const ul = el('ul','rules');
  t(d.rules).forEach(r=> ul.appendChild(el('li', null, esc(r))));
  rules.appendChild(ul); v.appendChild(rules);
  return v;
}

/* ---------- FABLAB ---------- */
function viewFablab(){
  const d = CONTENT.fablab, v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='fablab').title, d.intro));
  d.machines.forEach(m=>{
    const pill = m.needsBooking
      ? `<span class="pill book">${L()==='pt'?'precisa reserva':'booking needed'}</span>` : '';
    const b = block(null, `<h3 style="margin-bottom:4px">${esc(t(m.name))}${pill}</h3>
      <p>${esc(t(m.notes))}</p>`);
    if(m.needsBooking){
      const rb = el('button','btn ghost', (L()==='pt'?'Reservar este':'Reserve this')+' →');
      rb.style.marginTop='10px';
      rb.onclick = ()=>{ go('reserve'); setTimeout(()=>{ const sel=document.getElementById('res-machine'); if(sel) sel.value=m.id; },60); };
      b.appendChild(rb);
    }
    v.appendChild(b);
  });
  return v;
}

/* ---------- SCHEDULE ---------- */
function viewSchedule(){
  const d = CONTENT.schedule, v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='schedule').title, d.intro));
  d.items.forEach(it=> v.appendChild(block(it.when, `<p>${esc(t(it.what))}</p>`)));
  return v;
}

/* ---------- CONTACTS ---------- */
function viewContacts(){
  const d = CONTENT.contacts, v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='contacts').title));
  const sos = el('div','sos');
  sos.innerHTML = `<div class="n">${esc(d.emergency.number)}</div>
    <div><strong>${esc(t(d.emergency.label))}</strong></div>`;
  const call = el('a','btn red'); call.href='tel:'+d.emergency.number; call.textContent='📞 '+d.emergency.number;
  v.appendChild(sos); v.appendChild(call);
  const ppl = el('div','block'); ppl.style.marginTop='12px';
  ppl.appendChild(el('h3', null, L()==='pt'?'Equipa':'Team'));
  d.people.forEach(p=>{
    const row = el('div','kv');
    row.innerHTML = `<span class="k">${esc(t(p.role))} · ${esc(p.name)}</span>
      <a class="v" href="tel:${esc(p.phone)}">${esc(p.phone)}</a>`;
    ppl.appendChild(row);
  });
  v.appendChild(ppl);
  const pr = el('div','block');
  pr.appendChild(el('h3', null, L()==='pt'?'Prático':'Practical'));
  d.practical.forEach(x=>{
    const row = el('div','kv');
    row.innerHTML = `<span class="k">${esc(t(x.label))}</span><span class="v">${esc(t(x.value))}</span>`;
    pr.appendChild(row);
  });
  v.appendChild(pr);
  return v;
}

/* ---------- LOCAL ---------- */
function viewLocal(){
  const d = CONTENT.local, v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='local').title, d.intro));
  d.items.forEach(it=> v.appendChild(block(it.title, `<p>${esc(t(it.body))}</p>`)));
  return v;
}

/* ---------- CHECK-IN (interactive) ---------- */
function viewCheckin(){
  const v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='checkin').title,
    {en:"Let us know you've arrived safely.", pt:"Avisa-nos que chegaste em segurança."}));
  const saved = STORE.getJSON('buinho_checkin', {});
  const f = el('div','block');
  f.innerHTML = `
    <label class="f">${L()==='pt'?'Nome':'Name'}</label><input id="ci-name" value="${esc(saved.name||'')}">
    <label class="f">${L()==='pt'?'Quarto / casa':'Room / house'}</label><input id="ci-room" value="${esc(saved.room||'')}">
    <label class="f">${L()==='pt'?'Chegada (data)':'Arrival (date)'}</label><input id="ci-date" type="date" value="${esc(saved.date||'')}">
    <label class="f">${L()==='pt'?'Contacto (telefone)':'Contact (phone)'}</label><input id="ci-phone" value="${esc(saved.phone||'')}">
    <label class="f">${L()==='pt'?'Contacto de emergência':'Emergency contact'}</label><input id="ci-emg" value="${esc(saved.emg||'')}">
    <label class="f">${L()==='pt'?'Alergias / notas de saúde':'Allergies / health notes'}</label><textarea id="ci-notes" rows="2">${esc(saved.notes||'')}</textarea>`;
  v.appendChild(f);
  const btn = el('button','btn','✅ '+(L()==='pt'?'Confirmar chegada':'Confirm arrival'));
  const stamp = el('div','done-stamp');
  btn.onclick = ()=>{
    const data = {
      name:val('ci-name'), room:val('ci-room'), date:val('ci-date'),
      phone:val('ci-phone'), emg:val('ci-emg'), notes:val('ci-notes'), at:new Date().toISOString()
    };
    STORE.setJSON('buinho_checkin', data);
    // BACKEND HOOK (v1.1): POST `data` to /api/checkin so staff get it live.
    // For v1 we hand the resident a ready message to send.
    stamp.classList.add('show');
    stamp.textContent = L()==='pt'
      ? '✓ Guardado. Toca abaixo para avisar a equipa.'
      : '✓ Saved. Tap below to notify the team.';
    const body = encodeURIComponent(
      `Buinho check-in:\nName: ${data.name}\nRoom: ${data.room}\nArrival: ${data.date}\nPhone: ${data.phone}\nEmergency: ${data.emg}\nNotes: ${data.notes}`);
    notify.href = `mailto:info.alcobia@gmail.com?subject=${encodeURIComponent('AIR check-in — '+data.name)}&body=${body}`;
    notify.style.display='inline-flex';
  };
  const notify = el('a','btn ghost', '📨 '+(L()==='pt'?'Enviar à equipa':'Send to team'));
  notify.style.display='none';
  v.appendChild(btn); v.appendChild(stamp); v.appendChild(notify);
  return v;
}

/* ---------- RESERVE (interactive) ---------- */
function viewReserve(){
  const v = el('div');
  v.appendChild(viewHead(CONTENT.sections.find(s=>s.id==='reserve').title,
    {en:"Pick a machine and a slot. The team confirms.", pt:"Escolhe máquina e horário. A equipa confirma."}));
  const machines = CONTENT.fablab.machines.filter(m=>m.needsBooking);
  const opts = machines.map(m=>`<option value="${m.id}">${esc(t(m.name))}</option>`).join('');
  const f = el('div','block');
  f.innerHTML = `
    <label class="f">${L()==='pt'?'Máquina':'Machine'}</label>
    <select id="res-machine">${opts}</select>
    <label class="f">${L()==='pt'?'Nome':'Name'}</label><input id="res-name">
    <label class="f">${L()==='pt'?'Dia':'Day'}</label><input id="res-date" type="date">
    <label class="f">${L()==='pt'?'Hora':'Time'}</label><input id="res-time" type="time">
    <label class="f">${L()==='pt'?'Notas (opcional)':'Notes (optional)'}</label><textarea id="res-notes" rows="2"></textarea>`;
  v.appendChild(f);
  const btn = el('button','btn','📌 '+(L()==='pt'?'Pedir reserva':'Request booking'));
  const stamp = el('div','done-stamp');
  const send = el('a','btn ghost', '📨 '+(L()==='pt'?'Enviar pedido':'Send request'));
  send.style.display='none';
  btn.onclick = ()=>{
    const mName = document.querySelector('#res-machine option:checked').textContent;
    const data = { machine:mName, name:val('res-name'), date:val('res-date'), time:val('res-time'), notes:val('res-notes') };
    // BACKEND HOOK (v1.1): POST to /api/reserve -> write to shared calendar / DB.
    stamp.classList.add('show');
    stamp.textContent = L()==='pt' ? '✓ Pedido pronto. Toca em enviar.' : '✓ Request ready. Tap send.';
    const body = encodeURIComponent(
      `Machine booking request:\nMachine: ${data.machine}\nName: ${data.name}\nDay: ${data.date}\nTime: ${data.time}\nNotes: ${data.notes}`);
    send.href = `mailto:info.alcobia@gmail.com?subject=${encodeURIComponent('FabLab booking — '+data.machine)}&body=${body}`;
    send.style.display='inline-flex';
  };
  v.appendChild(btn); v.appendChild(stamp); v.appendChild(send);
  return v;
}

const val = (id)=> (document.getElementById(id)?.value || '').trim();

/* ---------- router ---------- */
const VIEWS = {
  arrival:viewArrival, map:viewMap, house:viewHouse, fablab:viewFablab, schedule:viewSchedule,
  contacts:viewContacts, local:viewLocal, checkin:viewCheckin, reserve:viewReserve
};
function go(id){ location.hash = id ? '#'+id : '#home'; }
function route(){
  const id = (location.hash||'#home').slice(1);
  const home = document.getElementById('view-home');
  const detail = document.getElementById('view-detail');
  const back = document.getElementById('backbtn');
  if(id==='home' || !VIEWS[id]){
    home.classList.add('active'); detail.classList.remove('active');
    back.style.visibility='hidden';
    window.scrollTo(0,0);
  } else {
    const node = VIEWS[id]();
    detail.innerHTML=''; detail.appendChild(node);
    detail.classList.add('active'); home.classList.remove('active');
    back.style.visibility='visible';
    window.scrollTo(0,0);
    if(typeof node._buildMap === 'function'){ node._buildMap(); }   // init Leaflet once in DOM
  }
  document.querySelectorAll('.bottombar button').forEach(b=>{
    b.classList.toggle('on', b.dataset.go===id || (id==='home'&&b.dataset.go==='home'));
  });
}

/* ---------- init ---------- */
function setLang(l){ STORE.lang=l; renderShell(); renderHome(); route(); }
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.lang button').forEach(b=> b.onclick=()=>setLang(b.dataset.l));
  document.getElementById('backbtn').onclick = ()=> go('home');
  document.querySelectorAll('.bottombar button').forEach(b=> b.onclick=()=> go(b.dataset.go));
  renderShell(); renderHome(); route();
  window.addEventListener('hashchange', route);
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js').catch(()=>{}); }
});
