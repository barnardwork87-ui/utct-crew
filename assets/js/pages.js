/* Sub-pages: crew · schedule · aid stations · fuel */
(function () {
  const R = window.RACE, { buildTopo, RM } = window.SITE;
  const page = document.body.dataset.page;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // hero contour crops
  $$('svg[data-topo]').forEach(svg => buildTopo(svg, { crop: svg.dataset.topo.split(',').map(Number), step: 20, idx: 100, route: true }));
  $$('.phero svg.topo').forEach(s => s.classList.add('faint'));

  /* shared station copy ------------------------------------------------- */
  const PHOTO = { 'Start': 'p081', 'Signal Hill': 'p012', 'Kloof Nek': 'p057', 'Platteklip (timing)': 'p036', 'Table Mountain': 'p037',
    'Llandudno': 'p053', 'Rocket Road': 'p089', 'Hout Bay': 'p074', 'Constantia Glen': 'p071', 'Alphen Trail': 'p047',
    'Nursery Ravine (timing)': 'p038', 'Newlands Picnic': 'p084', 'Finish': 'p006' };
  const WHERE = {
    'Start': 'Gardens Rugby Club race village. Be there by 03:15. Yes, a.m.',
    'Signal Hill': 'Top of Signal Hill Road. Dark, windy, parking is tight.',
    'Kloof Nek': 'Kloof Nek roundabout, at the bottom of Tafelberg Road. Tourist parking chaos starts at about 7.',
    'Llandudno': 'Llandudno beach. Parking is a nightmare on a Saturday, so go early or park up the hill and walk down.',
    'Hout Bay': 'Hout Bay beach. Main base: chair, gazebo, cooler box, the full costume change.',
    'Alphen Trail': 'Alphen Trail, Constantia. Greenbelt parking is easy, which makes it the one stop that will be.',
    'Newlands Picnic': 'Newlands Forest picnic site, off the M3. It will be dark. Bring a torch for yourselves.',
    'Finish': 'Gardens Rugby Club. Where it started. He’ll mention this.'
  };
  const SUB = {
    'Start': 'Gun goes. Barney goes too fast.',
    'Signal Hill': 'Sunrise is close. He’s feeling great, which is the problem.',
    'Kloof Nek': 'Last crew stop before the mountain. Load him up.',
    'Platteklip (timing)': 'Top of the gorge. Nobody can help him here.',
    'Table Mountain': 'Volunteers only. He’s on his own.',
    'Llandudno': 'Down the ravine to the beach. Quads gone.',
    'Rocket Road': 'Water only. Karbonkelberg next.',
    'Hout Bay': 'Costume change. 15 minutes. Josh holds the stopwatch.',
    'Constantia Glen': 'Drinks only. He just climbed 900 m.',
    'Alphen Trail': 'Vineyards are done. Headlamp check.',
    'Nursery Ravine (timing)': 'Timing point in the forest.',
    'Newlands Picnic': 'Last crew stop. Matty’s big moment.',
    'Finish': 'Lie him down on the grass. Gently.'
  };
  const DRIVE = { 'Signal Hill': 12, 'Kloof Nek': 12, 'Llandudno': 20, 'Hout Bay': 12, 'Alphen Trail': 22, 'Newlands Picnic': 15, 'Finish': 15 };
  const mapLink = s => { const T = window.TERRAIN; const p = T.stations[s.idx]; return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.label.replace(/ ·.*/, '') + ' UTCT aid station Cape Town')}`; };

  /* =====================================================================
     CREW
  ===================================================================== */
  if (page === 'crew') {
    const CREW = [
      { slug: 'josh', name: 'Josh', role: 'Head of Logistics & Operations', bg: '#BFD9F5', auth: 92,
        bio: 'Holds the car keys, the spreadsheet, and the right to say “we’re leaving”. If the crew is in the wrong car park, that’s Josh. If Barney’s in the wrong car park, that is also somehow Josh.',
        jobs: ['Runs the stopwatch at every station', 'Drives, parks, and decides when you leave', 'Responsible for the headlamp being charged. Specifically him.'] },
      { slug: 'davey', name: 'Davey', role: 'Operations & telling Barney to man the fuck up', bg: '#F0612E', fg: '#fff', auth: 88,
        bio: 'The whole job description is in the title, and he’s very good at it. Shows up when Barney sits down, says something brief and Old Testament, and Barney stands up.',
        jobs: ['Ends every sitting-down situation', 'Second in command on logistics with Josh', 'Delivers the line. You know the one.'] },
      { slug: 'mikey-l', name: 'Mikey L', role: 'Head of Nutrition', bg: '#D7F26B', auth: 85,
        bio: 'The only person allowed to touch the food. Counts carbs the way a casino counts chips. If Barney says he’s not hungry, Mikey L hears “please hand me a gel”.',
        jobs: ['Packs the fuel bag for every leg', 'Mixes the flasks and hands over salt', 'Owns the shopping list on the Fuelling page'] },
      { slug: 'mikey-p', name: 'Mikey P', role: 'Head of the Mikeys', bg: '#10213A', fg: '#F2F3EE', auth: 61,
        bio: 'Manages Mikey L and Mikey H. Has no other responsibilities and takes this one extremely seriously. When someone yells “Mikey!”, Mikey P decides which Mikey responds.',
        jobs: ['Assigns Mikeys to tasks', 'Settles any Mikey-related disputes', 'Backup bottle refiller (Mikey-adjacent)'] },
      { slug: 'mikey-h', name: 'Mikey H', role: 'Head of Vibes', bg: '#ECEBE4', auth: 40,
        bio: 'Yes, there are two Heads of Vibes. No, it hasn’t been resolved. Mikey H handles the noise as Barney comes in: the shouting, the clapping, the stuff that makes strangers look over.',
        jobs: ['Loud arrival energy at every station', 'Plays the playlist, chooses the playlist, defends the playlist', 'Not allowed near the food after the stroopwafel incident'] },
      { slug: 'cass', name: 'Cass', role: 'Head of Vibes & Stevie Leader', bg: '#4C5034', fg: '#F2F3EE', auth: 74,
        bio: 'The other Head of Vibes, and the only one with a second title, which comes up a lot. Also leads Stevie. We were told not to ask about Stevie, so we didn’t.',
        jobs: ['Sign-making and photo duty', 'Leads Stevie (classified)', 'Will win the vibes dispute with Mikey H'] },
      { slug: 'matty', name: 'Matty Meerberg', role: 'Mental Coach', bg: '#3E6BF0', fg: '#fff', auth: 70,
        bio: 'Looks after what’s going on in Barney’s head from km 60, which is mostly nothing and then suddenly a lot. Speaks calmly. Does not say “you’re nearly there” until he actually is.',
        jobs: ['Gets the one-on-one at Hout Bay and Newlands', 'Gives him one small goal per leg, never the full distance', 'Spots the bonk before Barney does'] },
      { slug: 'saxon', name: 'Saxon', role: 'UTCT 55k podium · He talks, we listen', bg: '#FFFFFF', auth: 100,
        bio: 'Podium at the 55k. Humbled Barney on a 25 km run in Newlands in August (it’s on Strava). When Saxon speaks, the crew goes quiet, including the Heads of Vibes.',
        jobs: ['Final word on any race-craft call', 'Tells him what the next section is actually like', 'Allowed to say “walk this”. Nobody else is.'] },
      { slug: 'ally', name: 'Ally', role: 'Head of Beers (post-finish only)', bg: '#E9B44C', auth: 55,
        bio: 'An actual brewer, so the only crew member with a professional qualification relevant to this event. His department opens at the finish line and not one metre earlier, no matter how nicely Barney asks at Newlands.',
        jobs: ['Brings the beer. Brewed it, probably.', 'Keeps it cold for anywhere between 19 and 26 hours', 'Hands Barney the first one at the finish, and not before'] }
    ];
    $('#crewGrid').innerHTML = CREW.map((c, i) => `
      <article class="crewcard" data-reveal data-delay="${(i % 4) * 0.08}">
        <div class="crewcard__art" style="background:${c.bg};color:${c.fg || 'var(--ink)'}">
          <span class="crewcard__no">${String(i + 1).padStart(2, '0')}</span>
          <svg class="topo ${c.fg ? 'on-dark' : ''}" data-crop="${300 + i * 40},${300 + (i % 3) * 120},200,250"></svg>
          <div class="ph"><span class="ini">${c.name.split(' ').map(w => w[0]).join('').replace('MM', 'MM')}</span><span class="note">Illustration incoming</span></div>
          <img class="illo" src="assets/crew/${c.slug}.png" alt="${c.name}" onerror="this.remove()" onload="this.previousElementSibling.style.display='none'">
        </div>
        <div><h3>${c.name}</h3><span class="role">${c.role}</span></div>
        <p>${c.bio}</p>
        <div class="meter" style="--w:${c.auth}%">Authority<span><i></i></span>${c.auth}</div>
        <ul>${c.jobs.map(j => `<li>${j}</li>`).join('')}</ul>
      </article>`).join('');
    $$('.crewcard__art svg').forEach(s => buildTopo(s, { crop: s.dataset.crop.split(',').map(Number), step: 20, idx: 100, coast: true }));
    $$('.meter').forEach(m => ScrollTrigger.create({ trigger: m, start: 'top 90%', once: true, onEnter: () => m.classList.add('go') }));
    // tilt
    $$('.crewcard').forEach(card => {
      const art = $('.crewcard__art', card);
      card.addEventListener('pointermove', e => {
        const b = art.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        art.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
      });
      card.addEventListener('pointerleave', () => { art.style.transform = ''; });
    });
    // org chart (removed from page; kept guarded)
    if ($('#org')) {
    const N = [
      ['saxon', 320, 30, 'Saxon', 'Advisory board · unquestioned', true],
      ['josh', 160, 120, 'Josh', 'Logistics & ops'], ['davey', 480, 120, 'Davey', 'Ops · man-up dept.'],
      ['mikeyp', 110, 220, 'Mikey P', 'Head of the Mikeys'], ['matty', 320, 220, 'Matty', 'Mental coach'], ['cass', 530, 220, 'Cass', 'Vibes · Stevie leader'],
      ['mikeyl', 50, 320, 'Mikey L', 'Nutrition'], ['mikeyh', 200, 320, 'Mikey H', 'Vibes'], ['stevie', 560, 320, 'Stevie', 'Do not ask'],
      ['barney', 320, 395, 'Barney', 'The asset · do not consult', true]
    ];
    const pos = Object.fromEntries(N.map(n => [n[0], n]));
    const W = [['saxon', 'josh'], ['saxon', 'davey'], ['josh', 'mikeyp'], ['josh', 'matty'], ['davey', 'matty'], ['davey', 'cass'], ['mikeyp', 'mikeyl'], ['mikeyp', 'mikeyh'], ['cass', 'stevie'], ['matty', 'barney']];
    let o = '';
    W.forEach(([a, b]) => { const A = pos[a], B = pos[b]; const my = (A[2] + B[2]) / 2 + 10; o += `<path class="wire" d="M${A[1]},${A[2] + 18} V${my} H${B[1]} V${B[2] - 18}"/>`; });
    // vibes dispute
    o += `<path class="wire dash" d="M${pos.mikeyh[1] + 56},${pos.mikeyh[2]} C 360 300, 420 260, ${pos.cass[1] - 64},${pos.cass[2] + 6}"/><text x="352" y="290" font-family="Geist Mono" font-size="9" fill="#F0612E">VIBES DISPUTE (ONGOING)</text>`;
    N.forEach(n => {
      const w = Math.max(104, n[3].length * 9 + 40, n[4].length * 5.6 + 22);
      o += `<g class="node ${n[5] ? 'boss' : ''}"><rect x="${n[1] - w / 2}" y="${n[2] - 18}" width="${w}" height="38" rx="3"/><text x="${n[1]}" y="${n[2] - 2}" text-anchor="middle">${n[3]}</text><text class="r" x="${n[1]}" y="${n[2] + 12}" text-anchor="middle">${n[4]}</text></g>`;
    });
    $('#org').innerHTML = o;
    if (!RM) {
      const wires = $$('#org .wire');
      wires.forEach(w => { const l = w.getTotalLength(); w.style.strokeDasharray = w.classList.contains('dash') ? '4 4' : l; if (!w.classList.contains('dash')) w.style.strokeDashoffset = l; });
      gsap.from('#org .node', { opacity: 0, y: 10, stagger: 0.06, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '#org', start: 'top 75%', once: true } });
      gsap.to(wires.filter(w => !w.classList.contains('dash')), { strokeDashoffset: 0, duration: 0.8, stagger: 0.05, delay: 0.3, ease: 'power2.inOut', scrollTrigger: { trigger: '#org', start: 'top 75%', once: true } });
    }
    }
  }

  /* =====================================================================
     SCHEDULE
  ===================================================================== */
  if (page === 'schedule') {
    let H = 19;
    const day0 = R.START_MIN, dayEnd = 30 * 60; // 04:00 Sat → 06:00 Sun
    const pct = m => ((m - day0) / (dayEnd - day0)) * 100;
    // photos
    $('#stepPhotos').innerHTML = R.stations.map((s, i) => `<img src="assets/img/${PHOTO[s.name]}.jpg" data-i="${i}" alt="" class="${i ? '' : 'on'}">`).join('');
    // hours axis
    $('#dayhours').innerHTML = ['04:00', '08:00', '12:00', '16:00', '20:00', '00:00', '04:00', '06:00'].map(t => `<span>${t}</span>`).join('');
    function render() {
      const sc = R.schedule(H);
      // day bar
      let d = `<div class="daybar__night" style="left:0;width:${pct(R.SUNRISE)}%"></div>`;
      d += `<div class="daybar__night twi" style="left:${pct(R.SUNRISE)}%;width:3%"></div>`;
      d += `<div class="daybar__night twi2" style="left:${pct(R.SUNSET) - 3}%;width:3%"></div>`;
      d += `<div class="daybar__night" style="left:${pct(R.SUNSET)}%;right:0"></div>`;
      sc.forEach(r => {
        const s = r.s; const cls = s.kind === 'timing' ? 'no' : s.crew ? 'crew' : 'no';
        d += `<div class="daybar__tick ${cls}" style="left:${pct(r.arrive)}%"><span>${s.label.replace(/ ·.*/, '').replace(' (timing)', '')} ${R.clock(r.arrive).slice(4)}</span></div>`;
        const c = R.cutoffMin(s.cutoff); if (c) d += `<div class="daybar__cut" style="left:${pct(c)}%" title="Cut-off ${s.cutoff}"></div>`;
      });
      $('#daybar').innerHTML = d;
      // stagger crew labels vertically to avoid overlaps
      $$('#daybar .daybar__tick.crew span').forEach((sp, i) => { sp.style.top = (8 + (i % 3) * 22) + 'px'; });
      // steps
      $('#steps').innerHTML = sc.map((r, i) => {
        const s = r.s, c = R.cutoffMin(s.cutoff);
        const buf = c ? c - r.arrive : null;
        const badges = [];
        if (s.kind === 'timing') badges.push('<span class="badge">Timing point</span>');
        else if (s.crew) badges.push('<span class="badge o">Crew allowed</span>');
        else badges.push('<span class="badge r">No crew · 30 min penalty</span>');
        if (s.kind === 'change') badges.push('<span class="badge k">Costume change · 15 min</span>');
        if (c) badges.push(`<span class="badge ${buf < 45 ? 'r' : 'l'}">Cut-off ${s.cutoff.slice(4)} · ${buf >= 0 ? R.dur(buf) + ' buffer' : 'MISSED'}</span>`);
        if (r.arrive > R.SUNSET || r.arrive < R.SUNRISE) badges.push('<span class="badge k">Dark</span>');
        const leg = i ? `${s.segkm.toFixed(1)} km · +${s.up} m · ${R.dur(r.legMin)} from last` : 'The start';
        return `<li class="step ${s.crew || s.kind === 'start' || s.kind === 'finish' ? 'crew' : 'nocrew'}" data-i="${i}">
          <div class="step__km">KM ${s.km.toFixed(1)}</div>
          <div><h3>${s.label}</h3><p>${WHERE[s.name] || SUB[s.name]}</p><div class="step__badges">${badges.join('')}</div><p class="small mt-s">${leg}</p></div>
          <div class="step__eta"><b>${R.clock(r.arrive).slice(4)}</b><span>${R.clock(r.arrive).slice(0, 3)}${s.stop ? ' · ' + s.stop + ' min stop' : ''}</span></div>
        </li>`;
      }).join('');
      $$('.step').forEach(st => ScrollTrigger.create({ trigger: st, start: 'top 55%', end: 'bottom 55%', onToggle: self => { if (self.isActive) activate(+st.dataset.i, sc); } }));
      activate(0, sc);
      // drive table
      const crew = sc.filter(r => r.s.crew);
      let t = `<thead><tr><th>Station</th><th>He arrives</th><th>Drive from previous</th><th>Leave previous by</th><th>Get there by</th></tr></thead><tbody>`;
      crew.forEach((r, k) => {
        const dr = DRIVE[r.s.name];
        const target = r.arrive - 30;
        const leave = dr ? target - dr - 10 : null;
        const prevDepart = k ? crew[k - 1].depart : null;
        const tight = leave !== null && prevDepart !== null && leave < prevDepart;
        t += `<tr><td><b>${r.s.label.replace(/ ·.*/, '')}</b></td><td>${R.clock(r.arrive)}</td><td>${dr ? dr + ' min' : '—'}</td><td>${leave ? R.clock(leave).slice(4) + (tight ? ' <span class="badge r">tight, leave as he leaves</span>' : '') : '—'}</td><td>${R.clock(r.s.kind === 'start' ? 195 : target).slice(4)}</td></tr>`;
      });
      $('#driveTable').innerHTML = t + '</tbody>';
      ScrollTrigger.refresh();
    }
    function activate(i, sc) {
      $$('.step').forEach(s => s.classList.toggle('on', +s.dataset.i === i));
      $$('#stepPhotos img').forEach(im => im.classList.toggle('on', +im.dataset.i === i));
      const r = sc[i];
      $('#clockLbl').textContent = `KM ${r.s.km.toFixed(1)} · ${r.s.label}`;
      $('#clockVal').textContent = R.clock(r.arrive);
      $('#clockSub').textContent = SUB[r.s.name] || '';
    }
    function setH(h) {
      H = +h;
      $('#planVal').textContent = H + 'h'; $('#planSlider').value = H;
      $$('#planToggle button').forEach(b => b.classList.toggle('on', +b.dataset.h === H));
      ScrollTrigger.getAll().forEach(st => { if (st.trigger && st.trigger.classList && st.trigger.classList.contains('step')) st.kill(); });
      render();
    }
    $$('#planToggle button').forEach(b => b.addEventListener('click', () => setH(b.dataset.h)));
    $('#planSlider').addEventListener('input', e => setH(e.target.value));
    render();
  }

  /* =====================================================================
     AID STATIONS
  ===================================================================== */
  if (page === 'aid') {
    const sc = R.schedule(19), sc24 = R.schedule(24);
    const fp = R.fuelPlan(sc);
    const P = R.FUEL.products;
    const AID = {
      'Start': { mood: 'Nervous. Will pretend he isn’t. Will go to the toilet four times.',
        hand: ['Race bib pinned on and visible', 'Headlamp on his head plus a spare battery in the pack', 'Full mandatory kit, checked against the race list (Josh reads it out)', 'Two flasks of mix, fuel for the first leg', 'Lube everywhere he says. Don’t make eye contact.'],
        take: ['His car keys, phone charger, the hoodie he’ll try to run in'],
        say: ['Start slow. Slower than that.', 'See you at Signal Hill.'],
        dont: ['“Go get ’em!” (he will, at 10k pace)', 'Anything about the knee'] },
      'Signal Hill': { mood: 'Thrilled. Too thrilled. Has probably run the first 12 km at a pace he can’t hold for 99.',
        hand: ['Swap in a full flask of mix', 'Gels for the next leg', 'Salt caps'],
        take: ['Empty flasks and wrappers'],
        say: ['You’re ahead of the plan. That’s bad, not good. Slow down.', 'Eat something now.'],
        dont: ['“You’re flying!”', '“How are you feeling?” (he’ll say “amazing”, which is how this goes wrong)'] },
      'Kloof Nek': { mood: 'Still happy. About to find out about Platteklip.', big: false,
        hand: ['Load him up for nearly 4 hours: no crew until Llandudno', 'Both flasks full, plus the bladder if he’s carrying one', 'Wind jacket within reach, because it can be a different weather system up top', 'Sunscreen on face, neck and ears', 'Cap and sunglasses'],
        take: ['Headlamp off his head (into the pack, not out of it)', 'Anything warm he no longer needs'],
        say: ['Walk every stair on Platteklip. Every single one.', 'Next stop is Llandudno. Eat every 30 minutes until then.'],
        dont: ['“It’s only one big climb.”', '“The view is amazing!” (he won’t be looking up)'] },
      'Llandudno': { mood: 'Quads have left the chat. Will say he’s fine. Will stand like a newborn giraffe.',
        hand: ['Cold drink, ice in the cap if it’s hot', 'Fresh flasks for about 3 hours to Hout Bay', 'Salt caps, two extra if it’s hot', 'Sunscreen top-up', 'Something salty and real: crisps, pretzels'],
        take: ['Jacket if the sun is out', 'Everything empty'],
        say: ['The downhill is over. Walk the first climb out of here.', 'Hout Bay next: clean clothes, a chair, and us.'],
        dont: ['“Nearly halfway!” (he’s at 42 km, which is not halfway)', '“Your legs look fine.”'] },
      'Hout Bay': { big: true, mood: 'Will want to sit for an hour and talk about his feelings. He gets 15 minutes. Josh has the stopwatch and Davey has the speech.',
        hand: ['Chair. He sits for 5 minutes, max.', 'Fresh socks: dry his feet, look for blisters, tape any hotspots', 'Fresh shirt, and fresh shorts if the chafe is bad', 'Lube top-up, re-tape anything that needs it', 'Shoes: swap only if his feet are wet or wrecked (spare pair in the car)', 'Headlamp check: fully charged, plus a spare battery. It gets dark before the end of the next leg, maybe sooner.', 'Warm layer in the pack for the night', 'Real food: salted baby potatoes, a wrap, and a Coke', 'Flasks for nearly 4 hours to Alphen, including the 900 m climb', 'Switch to the caffeinated chocolate-coffee gels from here', 'Sunscreen one last time'],
        take: ['All the morning kit, the sweaty everything, the rubbish', 'His opinion on whether he should keep going (not required)'],
        say: ['You’re doing exactly what the plan said.', 'One thing at a time: get over the mountain to Constantia, that’s it.', 'Davey: you know what to say.'],
        dont: ['“Only 41 km to go!”', '“Do you want to stop?” (never ask this, ever)', 'Any mention of a bed, a couch, or food that isn’t on the plan'] },
      'Alphen Trail': { mood: 'Has just done the biggest climb of the second half. He’s either quiet or swearing. Both are normal.',
        hand: ['Headlamp on his head now if it’s getting dark', 'Coke, broth or anything warm and salty', 'Flasks for about 2–3 hours to Newlands', 'Caffeinated gel, eaten here in front of you', 'Warm layer on if he’s cold'],
        take: ['Sunglasses and cap if it’s dark'],
        say: ['Nursery, the forest, then us again. That’s all that’s left.', 'You’ve already done the hard half.'],
        dont: ['“You look terrible.” (Mikey H, we mean you)', '“Only a marathon to go.”'] },
      'Newlands Picnic': { mood: 'Dark, cold, possibly hallucinating a dog. This is Matty’s moment. Everyone else goes a bit quieter.',
        hand: ['Coke plus a caffeinated gel', 'Fresh headlamp battery, whether he thinks he needs it or not', 'Warm layer on, and the jacket if it’s windy on the contour path', 'Flasks for about 3 hours, just in case', 'Something sweet he actually wants, if you have it'],
        take: ['Nothing he might need. It’s a long 11 km.'],
        say: ['Eleven kilometres. You’ve done this run a hundred times.', 'Dead Man’s Tree is a landmark, not a prediction.', 'We’ll see you at the finish. Go.'],
        dont: ['“Only 11 km!” (it’ll take him 2½ hours)', 'Anything with the word “nearly”'] },
      'Finish': { mood: 'Lying on the grass, saying “never again”. He’ll have signed up again by Tuesday.',
        hand: ['Warm clothes, a beanie and a blanket', 'Recovery shake or chocolate milk', 'Slides for his feet', 'A chair. Finally.', 'A cold beer from Ally, brewed by Ally, if he can hold it'],
        take: ['Everything else. He can’t carry anything.'],
        say: ['You did it.', 'Saxon: say something wise.', 'Ally: “Bar’s open.”'],
        dont: ['“So, what’s next?”', 'Anything about his finish time until he’s eaten'] }
    };
    const order = sc.filter(r => r.s.crew);
    const saved = JSON.parse(localStorage.getItem('utct-ticks') || '{}');
    $('#aidList').innerHTML = order.map((r, k) => {
      const s = r.s, A = AID[s.name]; if (!A) return '';
      const f = fp.find(x => x.from.s.name === s.name);
      const r24 = sc24[r.s.idx];
      const pack = f ? `<div class="box box--wide"><h4><i></i>Fuel bag for the next ${R.dur((f.to.arrive - f.from.depart))} (to ${f.to.s.label.replace(/ ·.*/, '')})</h4>
          <div class="fuelpack">
            <div class="fp"><b>${f.mix}</b><span>flask${f.mix > 1 ? 's' : ''} of drink mix (500 ml)</span></div>
            <div class="fp"><b>${f.gels}</b><span>${f.gelType === 'gelCaf' ? 'chocolate-coffee gels (caffeine)' : 'non-caffeine gels'}</span></div>
            <div class="fp"><b>${f.waffles}</b><span>Näak stroopwafel${f.waffles > 1 ? 's' : ''}</span></div>
            ${f.bars ? `<div class="fp"><b>${f.bars}</b><span>Näak PB & choc bar</span></div>` : ''}
            <div class="fp"><b>${f.salt}</b><span>salt caps</span></div>
            <div class="fp"><b>${(f.fluid / 1000).toFixed(1)}L</b><span>total fluid to get through</span></div>
          </div><p class="small mt-s">≈ ${f.carbsPerHour} g carbs/hour before any real food at the table. Pack one spare gel. Always.</p></div>` : '';
      const li = (arr, key, check) => arr.map((t, j) => {
        const id = `${s.name}-${key}-${j}`;
        return check ? `<li data-id="${id}" class="${saved[id] ? 'done' : ''}"><span class="chk"></span><span>${t}</span></li>` : `<li><span>${t}</span></li>`;
      }).join('');
      return `<section class="wrap"><div class="aid ${A.big ? 'aid--big' : ''}" id="st-${s.idx}">
        <div class="aid__side"><div class="sticky">
          <div class="aid__num">CREW STOP ${String(k + 1).padStart(2, '0')} / ${String(order.length).padStart(2, '0')} · KM ${s.km.toFixed(1)}</div>
          <h2 class="h-l">${s.label.replace(/ ·.*/, '')}${A.big ? ' <span class="sticker sticker--sm" style="background:#fff;color:var(--orange);vertical-align:middle">THE BIG ONE</span>' : ''}</h2>
          <p class="lede" style="font-size:16px">${WHERE[s.name]}</p>
          <div class="aid__eta"><div><span>ETA · 19h</span><b>${R.clock(r.arrive).slice(4)}</b></div><div><span>ETA · 24h</span><b>${R.clock(r24.arrive).slice(4)}</b></div>${s.cutoff ? `<div><span>Cut-off</span><b>${s.cutoff.slice(4)}</b></div>` : ''}</div>
          <div class="mood"><b>Mood forecast</b>${A.mood}</div>
          <div class="aid__photo"><img src="assets/img/${PHOTO[s.name]}.jpg" alt="" loading="lazy"></div>
        </div></div>
        <div class="aid__main">
          <div class="box box--wide"><h4><i></i>Hand him</h4><ul>${li(A.hand, 'hand', true)}</ul></div>
          ${pack}
          <div class="box take"><h4><i></i>Take off him</h4><ul>${li(A.take, 'take', true)}</ul></div>
          <div class="box say"><h4><i></i>Say</h4><ul>${li(A.say, 'say')}</ul></div>
          <div class="box dont box--wide"><h4><i></i>Do not say</h4><ul>${li(A.dont, 'dont')}</ul></div>
        </div>
      </div></section>`;
    }).join('');
    $$('#aidList li[data-id]').forEach(li => li.addEventListener('click', () => {
      li.classList.toggle('done');
      saved[li.dataset.id] = li.classList.contains('done');
      localStorage.setItem('utct-ticks', JSON.stringify(saved));
    }));
    $$('.aid').forEach(a => gsap.from($$('.box', a), { opacity: 0, y: 30, stagger: 0.07, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: a, start: 'top 75%', once: true } }));
    if (!RM) {
      gsap.from('#bigSticker', { scale: 0, rotate: -120, duration: 1, delay: 0.5, ease: 'back.out(1.8)' });
      gsap.to('#bigSticker', { rotate: -8, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.5 });
    }
  }

  /* =====================================================================
     FUEL
  ===================================================================== */
  if (page === 'fuel') {
    const F = R.FUEL;
    // count-ups
    $$('[data-count]').forEach(b => {
      const end = +b.dataset.count, unit = b.querySelector('small').outerHTML, o = { v: 0 };
      ScrollTrigger.create({ trigger: b, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => { b.innerHTML = Math.round(o.v).toLocaleString() + unit; } }) });
    });
    const PROD = [
      { cls: 'card--orange', tag: 'He uses this', name: 'Näak chocolate-coffee gel', copy: 'The main weapon from Hout Bay onwards. Chocolate with a hint of coffee, which by 9pm will taste like a five-star meal.', n: [['27 g', 'carbs'], ['35 mg', 'caffeine']], st: 'From Hout Bay' },
      { cls: 'card--sky', tag: 'He uses this', name: 'Näak stroopwafel', copy: 'Solid food that doesn’t need chewing for a full minute. Good on climbs when he’s walking anyway.', n: [['~19 g', 'carbs'], ['0', 'caffeine']], st: 'Check pack' },
      { cls: 'card--olive', tag: 'He uses this', name: 'Näak PB & choc bar', copy: 'Fat and a bit of protein for the long middle section. Hard to eat late, so front-load them before Alphen.', n: [['~25 g', 'carbs'], ['50 g', 'bar']], st: 'Check pack' },
      { cls: 'card--paper', tag: 'Add this', name: 'Non-caffeine gel', copy: 'Something like Näak maple for the first 57 km, so the caffeine is saved for when he actually needs it.', n: [['~27 g', 'carbs'], ['0', 'caffeine']] },
      { cls: 'card--lime', tag: 'Add this', name: 'Carb drink mix', copy: 'One 500 ml flask an hour with ~40–60 g carbs and electrolytes in it. Easiest carbs he’ll get all day. Use the one he’s trained with.', n: [['~45 g', 'per flask'], ['1', 'per hour']] },
      { cls: 'card--navy', tag: 'Add this', name: 'Salt caps', copy: 'For a heavy sweater these aren’t optional. One every 40 minutes, more if it’s hot or there’s salt crust on his cap.', n: [['~215 mg', 'sodium each'], ['~1.5', 'per hour']] },
      { cls: 'card--paper', tag: 'Real food', name: 'Salted baby potatoes', copy: 'Boiled, salted, in a zip-lock bag at Hout Bay. Carbs and sodium, and the only food that tastes normal at km 58.', n: [['~20 g', 'per handful'], ['Hout Bay', 'station']] },
      { cls: 'card--blue', tag: 'Real food', name: 'Coke (flat-ish)', copy: 'Sugar, caffeine, and the best-tasting thing on Earth at 8pm. From Alphen onwards. Shake it flat in the car.', n: [['27 g', 'per 250 ml'], ['Alphen +', 'stations']] },
      { cls: 'card--olive', tag: 'Real food', name: 'Broth / cup-a-soup', copy: 'Warm, salty, and settles his stomach. A flask of it at Newlands in the dark will feel like a hug.', n: [['~800 mg', 'sodium'], ['Night', 'only']] }
    ];
    $('#products').innerHTML = PROD.map((p, i) => `<div class="prod card ${p.cls}" style="position:relative;inset:auto" data-reveal data-delay="${(i % 3) * 0.08}">
      ${p.st ? `<span class="sticker sticker--sm">${p.st}</span>` : ''}
      <div><span class="prod__tag">${p.tag}</span><h4>${p.name}</h4><p>${p.copy}</p></div>
      <div class="prod__nums">${p.n.map(x => `<div><b>${x[0]}</b>${x[1]}</div>`).join('')}</div></div>`).join('');
    function table(h) {
      const fp = R.fuelPlan(R.schedule(h));
      let t = `<thead><tr><th>From → to</th><th class="num">Time</th><th class="num">Mix flasks</th><th class="num">Gels</th><th class="num">Waffles</th><th class="num">Bars</th><th class="num">Salt caps</th><th class="num">Fluid</th><th class="num">Carbs/h</th><th class="num">Caffeine</th></tr></thead><tbody>`;
      fp.forEach(f => {
        t += `<tr><td><b>${f.from.s.label.replace(/ ·.*/, '')}</b> → ${f.to.s.label.replace(/ ·.*/, '')}<div class="small">Hand over at ${R.clock(f.from.arrive).slice(4)}</div></td>
          <td class="num">${R.dur(f.to.arrive - f.from.depart)}</td><td class="num"><b>${f.mix}</b></td><td class="num"><b>${f.gels}</b>${f.gelType === 'gelCaf' ? '<div class="small">caffeine</div>' : ''}</td>
          <td class="num"><b>${f.waffles}</b></td><td class="num"><b>${f.bars}</b></td><td class="num"><b>${f.salt}</b></td><td class="num">${(f.fluid / 1000).toFixed(1)} L</td><td class="num">${f.carbsPerHour} g</td><td class="num">${f.caffeine ? f.caffeine + ' mg' : '—'}</td></tr>`;
      });
      $('#fuelTable').innerHTML = t + '</tbody>';
    }
    table(19);
    $$('#fuelToggle button').forEach(b => b.addEventListener('click', () => { $$('#fuelToggle button').forEach(x => x.classList.toggle('on', x === b)); table(+b.dataset.h); }));
    // caffeine chart (19h): cumulative mg over the day
    (function () {
      const sc = R.schedule(19), fp = R.fuelPlan(sc);
      const t0 = R.START_MIN, t1 = R.START_MIN + 19 * 60, X = m => ((m - t0) / (t1 - t0)) * 1000;
      let cum = 0; const pts = [[0, 0]];
      fp.forEach(f => {
        const n = f.caffeine / 35; if (!n) return;
        const span = f.to.arrive - f.from.depart;
        if (f.from.s.kind !== 'change') { cum += 15; pts.push([X(f.from.arrive), cum]); } // Coke at Alphen/Newlands
        for (let k = 0; k < n; k++) { cum += 35; pts.push([X(f.from.depart + span * (k + 0.5) / n), cum]); }
      });
      pts.push([1000, cum]);
      const Y = v => 130 - (v / 320) * 120;
      let d = `M0,${Y(0)}`; pts.forEach(p => { d += ` H${p[0].toFixed(1)} V${Y(p[1]).toFixed(1)}`; });
      const hb = sc.find(r => r.s.name === 'Hout Bay');
      $('#caffChart').innerHTML = `<rect x="${X(R.SUNSET)}" y="0" width="${1000 - X(R.SUNSET)}" height="140" fill="#10213A" opacity=".08"/>
        <rect x="0" y="${Y(290)}" width="1000" height="${Y(220) - Y(290)}" fill="#D7F26B" opacity=".5"/>
        <line x1="${X(hb.arrive)}" x2="${X(hb.arrive)}" y1="0" y2="140" stroke="#0E0E0C" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>
        <path d="${d}" fill="none" stroke="#F0612E" stroke-width="2.5" vector-effect="non-scaling-stroke"/>
        <text x="${X(hb.arrive) + 6}" y="16" font-family="Geist Mono" font-size="11" fill="#0E0E0C">HOUT BAY: CAFFEINE STARTS</text>
        <text x="8" y="${Y(290) + 13}" font-family="Geist Mono" font-size="11" fill="#10213A">TARGET 220–290 mg</text>
        <text x="${X(R.SUNSET) + 6}" y="132" font-family="Geist Mono" font-size="11" fill="#10213A">SUNSET 19:46</text>`;
    })();
    // shopping list (24h plan + 30%)
    (function () {
      const fp = R.fuelPlan(R.schedule(24));
      const sum = k => fp.reduce((a, f) => a + f[k], 0);
      const gelsCaf = fp.filter(f => f.gelType === 'gelCaf').reduce((a, f) => a + f.gels, 0);
      const gelsNo = sum('gels') - gelsCaf;
      const up = n => Math.ceil(n * 1.3);
      const items = [[up(gelsCaf), 'Näak chocolate-coffee gels'], [up(gelsNo), 'non-caffeine gels'], [up(sum('waffles')), 'Näak stroopwafels'], [up(sum('bars')), 'Näak PB & choc bars'],
        [up(sum('mix')), 'drink-mix sachets'], [up(sum('salt')), 'salt caps'], ['2 L', 'Coke, de-fizzed'], ['1 kg', 'baby potatoes + salt'], ['2', 'cup-a-soup / broth sachets'], ['1', 'ginger chews, for the stomach']];
      $('#shopping').innerHTML = items.map(i => `<div class="fp" style="background:#fff;padding:18px" data-reveal><b>${i[0]}</b><span>${i[1]}</span></div>`).join('');
    })();
  }

  // late reveals for injected content
  document.addEventListener('site:ready', () => {}, { once: true });
  requestAnimationFrame(() => {
    $$('#crewGrid [data-reveal], #products [data-reveal], #shopping [data-reveal]').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: +(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
    });
  });
})();
