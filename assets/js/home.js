/* Home page: hero flyover, statement, stats loop, chart, report deck, interactive route */
(function () {
  const T = window.TERRAIN, S = window.STATS, R = window.RACE;
  const { buildTopo, prepDraw, routeDraw, RM } = window.SITE;
  const NS = 'http://www.w3.org/2000/svg';
  const sched19 = R.schedule(19);

  /* ---------------- HERO ---------------- */
  const heroSvg = document.getElementById('heroTopo');
  const hero = buildTopo(heroSvg, { crop: [120, 170, 800, 640], step: 20, idx: 100, route: true });
  prepDraw(hero.paths);
  const hr = routeDraw(hero.route);
  // runner dot
  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('r', '5'); dot.setAttribute('fill', '#0E0E0C'); dot.setAttribute('stroke', '#F0612E'); dot.setAttribute('stroke-width', '3');
  dot.style.vectorEffect = 'non-scaling-stroke';
  hero.g.appendChild(dot);
  const kmTag = document.getElementById('heroKm');
  const routeLen = hero.route.getTotalLength();
  function placeRunner(p) {
    const pt = hero.route.getPointAtLength(routeLen * p);
    dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
    const m = dot.getScreenCTM();
    if (m) {
      const sp = heroSvg.createSVGPoint(); sp.x = pt.x; sp.y = pt.y;
      const s = sp.matrixTransform(m);
      const box = heroSvg.getBoundingClientRect();
      kmTag.style.left = (s.x - box.left) + 'px'; kmTag.style.top = (s.y - box.top) + 'px';
    }
    // nearest km via routeKm index
    const idx = Math.min(T.routeKm.length - 1, Math.round(p * (T.routeKm.length - 1)));
    const km = T.routeKm[idx];
    const st = R.stations.filter(s => s.km <= km + 0.2).pop();
    kmTag.style.opacity = p < 0.004 ? 0 : 1;
    kmTag.textContent = p < 0.01 ? 'km 0 · 04:00' : p > 0.995 ? 'FINISH · lie down' : `km ${km.toFixed(1)} · past ${st.label.replace(' (timing)', '').replace(/ ·.*/, '')}`;
  }
  placeRunner(0);

  document.addEventListener('site:ready', () => {
    // intro
    const tl = gsap.timeline();
    tl.from('[data-hero-title] .line-mask>span', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.09 })
      .from('[data-hero-side], [data-hero-meta], .hero__scroll', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', stagger: 0.1 }, 0.3)
      .to(hero.paths, { strokeDashoffset: 0.55, duration: 2.2, ease: 'power2.out', stagger: { each: 0.008, from: 'random' } }, 0);

    if (RM) { hero.paths.forEach(p => p.style.strokeDashoffset = 0); hr.set(1); return; }
    // scroll: finish drawing contours, draw route, run the dot, push camera in
    const prog = { p: 0 };
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
      .to(hero.paths, { strokeDashoffset: 0, ease: 'none', duration: 0.35, stagger: { each: 0.0006, from: 'random' } }, 0)
      .to(prog, { p: 1, ease: 'none', duration: 1, onUpdate: () => { hr.set(prog.p); placeRunner(prog.p); } }, 0)
      .to(heroSvg, { scale: 1.18, transformOrigin: '55% 45%', ease: 'none', duration: 1 }, 0)
      .to('[data-hero-title]', { yPercent: -18, opacity: 0.0, ease: 'power1.in', duration: 0.35 }, 0.65)
      .to('[data-hero-side], [data-hero-meta]', { opacity: 0, ease: 'none', duration: 0.2 }, 0.7);
  });

  /* ---------------- STATEMENT: word-by-word ---------------- */
  const st = document.getElementById('statement');
  st.innerHTML = st.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
  gsap.to(st.querySelectorAll('.w'), { opacity: 1, stagger: 0.05, ease: 'none',
    scrollTrigger: { trigger: st, start: 'top 80%', end: 'bottom 45%', scrub: true } });

  /* ---------------- STATS ---------------- */
  const longest = S.weeks.reduce((a, w) => (w.km > a.km ? w : a), S.weeks[0]);
  const rows = [
    [S.km.toLocaleString(), 'km', 'Run since 2 June', 'Roughly Cape Town to Beaufort West. Slowly. Mostly uphill.'],
    [S.vert.toLocaleString(), 'm', 'Climbed', `${S.everests} Everests, or Table Mountain ${Math.round(S.tableMountains)} times. He wants you to lead with the Everest one.`],
    [S.hours, 'hrs', 'Spent running', `Plus ${S.climbs} rock-climbing sessions, which counts as cross-training if you’re generous.`],
    ['60', 'km', 'Longest run · Karoo Crawl, 22 Aug', 'Flat, in the Karoo. The UTCT 100 is neither of those things.'],
    [Math.round(longest.km), 'km', 'Biggest week · 19–25 Oct', 'Includes a 41 km, 2,069 m Saturday that he will bring up unprompted.'],
    ['3', '', 'Injuries since June ’25', 'Knee, ankle, and a doctor who said “rest”. He heard “taper”.'],
    ['1', '', 'Week in September with zero runs', 'No explanation has been given and no one has asked.'],
    [S.swims, '', 'Swims', 'For a running race. Nobody knows why.']
  ];
  const list = document.getElementById('statsList');
  list.innerHTML = rows.map(r => `<li class="stats__row"><div class="stats__num">${r[0]}<sup>${r[1]}</sup></div><div class="stats__lbl">${r[2]}<em>${r[3]}</em></div></li>`).join('');
  document.getElementById('snap').textContent = '4 Nov 2026';
  list.querySelectorAll('.stats__row').forEach(row => {
    ScrollTrigger.create({ trigger: row, start: 'top 62%', end: 'bottom 38%', toggleClass: 'is-on' });
  });

  // weekly chart
  (function chart() {
    const svg = document.getElementById('weekChart');
    const W = 1000, H = 300, pad = 30, n = S.weeks.length, bw = (W - pad) / n;
    const maxKm = 80, maxV = 3600;
    let h = '';
    [20, 40, 60, 80].forEach(v => { const y = H - pad - (v / maxKm) * (H - pad - 10); h += `<line class="gl" x1="${pad}" x2="${W}" y1="${y}" y2="${y}"/><text class="axis" x="0" y="${y + 3}">${v}</text>`; });
    S.weeks.forEach((w, i) => {
      const x = pad + i * bw + 4, bh = (w.km / maxKm) * (H - pad - 10);
      h += `<rect class="bar${w.km === longest.km ? ' peak' : ''}" x="${x}" width="${bw - 8}" y="${H - pad - bh}" height="${bh}" data-h="${bh}"/>`;
      if (i % 2 === 0) { const d = new Date(w.wk); h += `<text class="axis" x="${x}" y="${H - 10}">${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}</text>`; }
    });
    const pts = S.weeks.map((w, i) => `${pad + i * bw + bw / 2},${H - pad - (w.vert / maxV) * (H - pad - 10)}`).join(' ');
    h += `<polyline class="vert" points="${pts}" pathLength="1"/>`;
    const sep = S.weeks.findIndex(w => w.km === 0);
    if (sep > -1) h += `<text class="axis" x="${pad + sep * bw - 6}" y="${H - pad - 8}" style="fill:#F0612E">?</text>`;
    svg.innerHTML = h;
    const bars = svg.querySelectorAll('.bar');
    bars.forEach(b => { b.dataset.y = b.getAttribute('y'); b.setAttribute('height', 0); b.setAttribute('y', H - pad); });
    const vl = svg.querySelector('.vert'); vl.style.strokeDasharray = '1 1'; vl.style.strokeDashoffset = 1;
    ScrollTrigger.create({ trigger: svg, start: 'top 80%', once: true, onEnter: () => {
      bars.forEach((b, i) => gsap.to(b, { attr: { height: b.dataset.h, y: b.dataset.y }, duration: 0.9, delay: i * 0.035, ease: 'power3.out' }));
      gsap.to(vl, { strokeDashoffset: 0, duration: 2, delay: 0.4, ease: 'power2.inOut' });
    } });
  })();

  /* ---------------- REPORT DECK ---------------- */
  buildTopo(document.getElementById('reportTopo'), { crop: [380, 520, 420, 360], step: 20, idx: 100 });
  const cards = gsap.utils.toArray('#deck .card');
  const rot = [-9, 6, -4, 8, -6, 3], dx = [-40, 36, -18, 44, -30, 10];
  gsap.set(cards, { yPercent: 160, rotate: i => rot[i] * 2, opacity: 0 });
  const rtl = gsap.timeline({ scrollTrigger: { trigger: '#report', start: 'top top', end: 'bottom bottom', scrub: 0.7 } });
  cards.forEach((c, i) => {
    rtl.to(c, { yPercent: 0, x: dx[i], rotate: rot[i], opacity: 1, duration: 1, ease: 'power2.out' }, i * 0.9);
  });
  rtl.to('#stamp', { opacity: 1, duration: 0.4 }, cards.length * 0.9 + 0.2)
     .from('#stamp .stamp', { scale: 2.4, rotate: -30, duration: 0.5, ease: 'back.out(2)' }, '<')
     .to({}, { duration: 0.6 });

  /* ---------------- ROUTE MAP ---------------- */
  const map = document.getElementById('routeMap');
  const crop = [215, 115, 600, 735];
  map.setAttribute('viewBox', crop.join(' '));
  map.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  let mh = '';
  T.levels.forEach(l => { if (l.d) mh += `<path class="c${l.e % 100 === 0 ? ' idx' : ''}" d="${l.d}"/>`; });
  mh += `<path class="coast" d="${T.coast}"/>`;
  // legs
  const ST = R.stations;
  const ri = s => Math.min(T.routeXY.length - 1, Math.round(s.i / 2));
  const legPts = [];
  for (let i = 1; i < ST.length; i++) {
    const seg = T.routeXY.slice(ri(ST[i - 1]), ri(ST[i]) + 1);
    legPts[i] = seg;
    const d = 'M' + seg.map(p => p.join(',')).join('L');
    mh += `<path class="leg" data-leg="${i}" d="${d}"/>`;
  }
  for (let i = 1; i < ST.length; i++) mh += `<path class="leg-hit" data-leg="${i}" d="M${legPts[i].map(p => p.join(',')).join('L')}"/>`;
  // stations
  const lab = { 'Start': [12, 18, 'Start / Finish'], 'Signal Hill': [12, -6], 'Kloof Nek': [-12, 4, null, 'end'], 'Platteklip (timing)': [10, -6, 'Platteklip'],
    'Table Mountain': [12, 4], 'Llandudno': [-12, 4, null, 'end'], 'Rocket Road': [12, 4], 'Hout Bay': [0, 24, null, 'middle'],
    'Constantia Glen': [12, 12], 'Alphen Trail': [12, 4], 'Nursery Ravine (timing)': [-12, -4, 'Nursery Ravine', 'end'], 'Newlands Picnic': [12, 4, 'Newlands'], 'Finish': null };
  ST.forEach(s => {
    if (s.name === 'Finish') return;
    const L = lab[s.name] || [10, 4];
    const cls = s.kind === 'timing' ? 'nocrew timing' : s.crew ? 'crew' : 'nocrew';
    const r = s.kind === 'timing' ? 4 : 7;
    mh += `<g class="st ${cls}" data-st="${s.idx}" transform="translate(${s.x},${s.y})"><circle class="ring" r="${r}"/>` +
      `<text x="${L[0]}" y="${L[1]}" text-anchor="${L[3] || 'start'}">${(L[2] || s.label).toUpperCase()}</text></g>`;
  });
  mh += `<circle class="runner" id="mapRunner" r="6" style="display:none" stroke="#F0612E" stroke-width="3"/>`;
  map.innerHTML = mh;

  // profile
  const prof = document.getElementById('profile');
  const P = T.profile, PW = 1000, PH = 150, maxE = 1100;
  const px = km => (km / 99.2) * PW;
  const py = e => PH - (e / maxE) * (PH - 8);
  let ph = '';
  for (let i = 1; i < ST.length; i++) ph += `<rect class="band" data-leg="${i}" x="${px(ST[i - 1].km)}" width="${px(ST[i].km) - px(ST[i - 1].km)}" y="0" height="${PH}"/>`;
  const step = 99.2 / (P.length - 1);
  const line = P.map((e, i) => `${(px(i * step)).toFixed(1)},${py(e).toFixed(1)}`).join(' ');
  ph += `<polygon class="area" points="0,${PH} ${line} ${PW},${PH}"/><polyline class="ln" points="${line}"/>`;
  ST.forEach(s => { if (s.kind !== 'timing') ph += `<line class="tick" x1="${px(s.km)}" x2="${px(s.km)}" y1="0" y2="${PH}"/>`; });
  ph += `<line class="cur" id="profCur" x1="-10" x2="-10" y1="0" y2="${PH}"/>`;
  prof.innerHTML = ph;

  const info = document.getElementById('legInfo');
  const tip = document.createElement('div'); tip.className = 'tip'; document.body.appendChild(tip);
  function overview() {
    info.innerHTML = `<div class="leginfo__kicker"><span class="eyebrow">Full course</span><span class="leginfo__crew yes">6 crew stops + start/finish</span></div>
      <h3 class="h-l">${matchMedia('(hover: none)').matches ? 'Tap' : 'Hover'} a section</h3><div class="leginfo__where">Official UT100 2026 route · Gardens → Signal Hill → Table Mountain → Llandudno → Karbonkelberg → Hout Bay → Constantia → Newlands → Gardens</div>
      <p class="leginfo__blurb">Most of the climbing comes in the first half, so it’s the second half where things fall apart. The mountain bits are where you can’t reach him. Everything orange is where you can.</p>
      <div class="leginfo__stats"><div><span class="eyebrow">Dist</span><b>99.2 km</b></div><div><span class="eyebrow">Up</span><b>4,972 m</b></div><div><span class="eyebrow">Goal</span><b>19h</b></div><div><span class="eyebrow">Cut-off</span><b>26h</b></div></div>`;
  }
  function showLeg(i) {
    const s = ST[i], a = ST[i - 1], L = s.leg, sc = sched19[i];
    map.classList.add('has-hover');
    map.querySelectorAll('.leg').forEach(p => p.classList.toggle('on', +p.dataset.leg === i));
    prof.querySelectorAll('.band').forEach(b => b.classList.toggle('on', +b.dataset.leg === i));
    const crewTxt = s.crew ? `Crew at ${s.label.replace(/ ·.*/, '')}` : s.kind === 'timing' ? 'Timing point · no crew' : 'No crew · 30 min penalty';
    info.innerHTML = `<div class="leginfo__kicker"><span class="eyebrow">Leg ${String(i).padStart(2, '0')} · km ${a.km.toFixed(1)} → ${s.km.toFixed(1)}</span><span class="leginfo__crew ${s.crew ? 'yes' : ''}">${crewTxt}</span></div>
      <h3 class="h-l">${L.title}</h3><div class="leginfo__where">${L.where}</div>
      <p class="leginfo__blurb">${L.blurb}</p>
      <div class="leginfo__stats"><div><span class="eyebrow">Dist</span><b>${s.segkm.toFixed(1)} km</b></div><div><span class="eyebrow">Up</span><b>+${s.up} m</b></div><div><span class="eyebrow">Down</span><b>−${s.down} m</b></div><div><span class="eyebrow">ETA @19h</span><b>${R.clock(sc.arrive).slice(4)}</b></div></div>`;
    return s;
  }
  function clearLeg() {
    map.classList.remove('has-hover');
    map.querySelectorAll('.leg').forEach(p => p.classList.remove('on'));
    prof.querySelectorAll('.band').forEach(b => b.classList.remove('on'));
    tip.classList.remove('on');
    document.getElementById('mapRunner').style.display = 'none';
    document.getElementById('profCur').setAttribute('x1', -10); document.getElementById('profCur').setAttribute('x2', -10);
    overview();
  }
  overview();
  let cur = 0;
  map.addEventListener('pointermove', e => {
    const hit = e.target.closest('.leg-hit');
    if (!hit) { if (cur) { cur = 0; clearLeg(); } return; }
    const i = +hit.dataset.leg;
    if (i !== cur) { cur = i; showLeg(i); }
    const s = ST[i];
    tip.innerHTML = `<span class="mono">km ${ST[i - 1].km.toFixed(1)}–${s.km.toFixed(1)} · +${s.up} m</span><b>${s.leg.title}</b>${s.leg.where}`;
    tip.style.left = Math.min(innerWidth - 300, e.clientX + 16) + 'px'; tip.style.top = (e.clientY + 18) + 'px';
    tip.classList.add('on');
  });
  map.addEventListener('pointerleave', e => { if (e.pointerType === 'touch') return; cur = 0; clearLeg(); });
  map.addEventListener('click', e => {
    const hit = e.target.closest('.leg-hit');
    if (!hit) { cur = 0; clearLeg(); return; }
    cur = +hit.dataset.leg; showLeg(cur);
    if (matchMedia('(hover: none)').matches) info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  // profile scrub → runner on map
  const runner = document.getElementById('mapRunner');
  prof.addEventListener('pointermove', e => {
    const b = prof.getBoundingClientRect();
    const km = Math.max(0, Math.min(99.2, ((e.clientX - b.left) / b.width) * 99.2));
    let k = T.routeKm.findIndex(v => v >= km); if (k < 0) k = T.routeKm.length - 1;
    const p = T.routeXY[k];
    runner.style.display = ''; runner.setAttribute('cx', p[0]); runner.setAttribute('cy', p[1]);
    const cx = px(km); const c = document.getElementById('profCur'); c.setAttribute('x1', cx); c.setAttribute('x2', cx);
    let i = ST.findIndex(s => s.km >= km); if (i < 1) i = 1;
    if (i !== cur) { cur = i; showLeg(i); }
  });
  prof.addEventListener('pointerleave', e => { if (e.pointerType === 'touch') return; cur = 0; clearLeg(); });

  // draw the map in when it scrolls into view
  if (!RM) {
    const cs = map.querySelectorAll('.c, .coast');
    cs.forEach(p => p.setAttribute('pathLength', 1));
    prepDraw(cs);
    const legs = map.querySelectorAll('.leg');
    legs.forEach(p => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; p.dataset.l = l; });
    gsap.set(map.querySelectorAll('.st'), { opacity: 0, scale: 0, transformOrigin: 'center', transformBox: 'fill-box' });
    ScrollTrigger.create({ trigger: map, start: 'top 75%', once: true, onEnter: () => {
      gsap.to(cs, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.out', stagger: { each: 0.015, from: 'random' } });
      const tl = gsap.timeline({ delay: 0.6 });
      legs.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, duration: 0.28, ease: 'none', onComplete: () => { p.style.strokeDasharray = ''; } }));
      tl.to(map.querySelectorAll('.st'), { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.05 }, 0.3);
    } });
  }
})();
