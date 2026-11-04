/* =========================================================
   UTCT 100 · CREW HQ — shared behaviour
   nav · smooth scroll · loader · page transitions · topo · reveals
========================================================= */
(function () {
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const page = document.body.dataset.page || 'home';
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- nav ---------------- */
  const LINKS = [
    ['index.html', 'Home', 'home'],
    ['crew.html', 'The Crew', 'crew'],
    ['schedule.html', 'Timing & Schedule', 'schedule'],
    ['aid-stations.html', 'Aid Stations<span class="tag">IMPORTANT</span>', 'aid'],
    ['fuel.html', 'Fuelling', 'fuel']
  ];
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `
    <a class="nav__logo" href="index.html" aria-label="Crew HQ home">
      <span class="nav__barney"><img src="assets/barney.webp" alt="Barney, sitting down, which he won't be doing on race day"></span>
      <span>Barney’s UTCT 100<small>Crew HQ · 21.11.2026</small></span>
    </a>
    <nav class="nav__links">${LINKS.map(([h, l, k]) => `<a href="${h}" class="${k === page ? 'is-active' : ''}">${l}</a>`).join('')}</nav>
    <a class="nav__cta" href="schedule.html"><span>Gun goes in</span><b data-countdown>—</b></a>
    <button class="nav__burger" aria-label="Menu"><span></span><span></span></button>`;
  document.body.prepend(nav);
  nav.querySelector('.nav__burger').addEventListener('click', () => nav.classList.toggle('open'));

  function tickCountdown() {
    const ms = window.RACE ? RACE.date - new Date() : 0;
    const el = nav.querySelector('[data-countdown]');
    if (ms <= 0) { el.textContent = 'He’s out there'; return; }
    const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    el.textContent = `${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m`;
  }
  tickCountdown(); setInterval(tickCountdown, 30000);

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (!RM && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  window.SITE = { lenis, RM };

  /* ---------------- topo builder ---------------- */
  // opts: {crop:[x,y,w,h], step:20, idx:100, route:true, coast:true, draw:false}
  function buildTopo(svg, opts = {}) {
    const T = window.TERRAIN;
    const crop = opts.crop || [0, 0, T.w, T.h];
    svg.setAttribute('viewBox', crop.join(' '));
    svg.setAttribute('preserveAspectRatio', opts.par || 'xMidYMid slice');
    const step = opts.step || 20, idx = opts.idx || 100;
    const g = document.createElementNS(NS, 'g');
    const paths = [];
    T.levels.forEach(l => {
      if (l.e % step || !l.d) return;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', l.d);
      if (l.e % idx === 0) p.setAttribute('class', 'idx');
      p.setAttribute('pathLength', '1');
      g.appendChild(p); paths.push(p);
    });
    if (opts.coast !== false) {
      const c = document.createElementNS(NS, 'path');
      c.setAttribute('d', T.coast); c.setAttribute('class', 'coast'); c.setAttribute('pathLength', '1');
      g.appendChild(c); paths.push(c);
    }
    let route = null;
    if (opts.route) {
      route = document.createElementNS(NS, 'path');
      route.setAttribute('d', T.route); route.setAttribute('class', 'route');
      g.appendChild(route);
    }
    svg.appendChild(g);
    return { paths, route, g };
  }
  // draw-on helper (pathLength = 1)
  function prepDraw(paths) { paths.forEach(p => { p.style.strokeDasharray = '1 1'; p.style.strokeDashoffset = '1'; }); }
  window.SITE.buildTopo = buildTopo;
  window.SITE.prepDraw = prepDraw;

  // route dash "drawing": we animate a mask-like dashoffset on a clone
  // solid orange line revealed by dashoffset, with a paper-coloured dashed
  // overlay on top so it still reads as a dashed route line.
  function routeDraw(route, bg) {
    route.setAttribute('pathLength', '1000');
    route.style.strokeDasharray = '1000 1000';
    route.style.strokeDashoffset = '1000';
    const gaps = route.cloneNode();
    gaps.removeAttribute('class');
    gaps.removeAttribute('style');
    gaps.setAttribute('fill', 'none');
    gaps.setAttribute('stroke', bg || '#F4F4EF');
    gaps.setAttribute('stroke-width', '5');
    gaps.setAttribute('stroke-dasharray', '1.6 2.2');
    gaps.setAttribute('pathLength', '600');
    gaps.style.vectorEffect = 'non-scaling-stroke';
    route.after(gaps);
    return { set: p => { route.style.strokeDashoffset = 1000 * (1 - p); }, gaps };
  }
  window.SITE.routeDraw = routeDraw;

  /* ---------------- page transitions ---------------- */
  const pt = document.createElement('div');
  pt.className = 'pt';
  pt.innerHTML = `<div class="pt__panel"><svg></svg><div class="pt__label"></div></div>`;
  document.body.appendChild(pt);
  const ptPanel = pt.querySelector('.pt__panel');
  const ptSvg = pt.querySelector('svg');
  gsap.set(ptPanel, { yPercent: 100 });
  if (window.TERRAIN) {
    const t = buildTopo(ptSvg, { crop: [380, 300, 420, 420], step: 40, idx: 200, coast: false });
    t.paths.forEach(p => p.removeAttribute('class'));
  }
  const fromTransition = sessionStorage.getItem('utct-pt');
  if (fromTransition && !RM) {
    pt.style.visibility = 'visible';
    pt.querySelector('.pt__label').textContent = fromTransition;
    gsap.set(ptPanel, { yPercent: 0 });
    gsap.to(ptPanel, { yPercent: -100, duration: 0.9, ease: 'power3.inOut', delay: 0.15, onComplete: () => { pt.style.visibility = 'hidden'; } });
  }
  sessionStorage.removeItem('utct-pt');
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || RM) return;
    const href = a.getAttribute('href');
    if (!href.endsWith('.html') || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const label = (a.textContent || '').replace('IMPORTANT', '').trim();
    sessionStorage.setItem('utct-pt', label.length > 30 ? 'Next' : label);
    pt.style.visibility = 'visible';
    pt.querySelector('.pt__label').textContent = label.length > 30 ? 'Next' : label;
    gsap.fromTo(ptPanel, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'power3.inOut', onComplete: () => { location.href = href; } });
  });
  window.addEventListener('pageshow', e => { if (e.persisted) { gsap.set(ptPanel, { yPercent: 100 }); pt.style.visibility = 'hidden'; } });

  /* ---------------- reveals ---------------- */
  function reveals() {
    gsap.utils.toArray('[data-reveal]').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: +(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray('[data-lines]').forEach(el => {
      gsap.from(el.querySelectorAll('.line-mask>span'), { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray('[data-parallax]').forEach(el => {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.utils.toArray('[data-draw]').forEach(svg => {
      const ps = svg.querySelectorAll('path:not(.route)');
      prepDraw(ps);
      gsap.to(ps, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.out', stagger: { each: 0.012, from: 'random' },
        scrollTrigger: { trigger: svg, start: 'top 85%', once: true } });
    });
  }
  if (RM) document.querySelectorAll('[data-reveal]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });

  /* ---------------- loader (home, once per session) ---------------- */
  function runLoader(done) {
    const force = /[?&]loader/.test(location.search);
    if (page !== 'home' || RM || (sessionStorage.getItem('utct-loaded') && !force) || fromTransition) { done(); return; }
    sessionStorage.setItem('utct-loaded', '1');
    const navImg = nav.querySelector('.nav__barney img');
    navImg.style.opacity = 0;
    const L = document.createElement('div');
    L.className = 'loader';
    L.innerHTML = `<svg class="loader__topo"></svg>
      <div class="loader__stage"><img class="loader__barney" src="assets/barney.webp" alt=""></div>
      <div class="loader__count"><span>0</span><small>/ 100 km</small></div>
      <div class="loader__msg">Locating Josh</div><div class="loader__bar"></div>`;
    document.body.appendChild(L);
    if (lenis) lenis.stop();
    const topo = buildTopo(L.querySelector('svg'), { crop: [300, 150, 560, 640], step: 40, idx: 200, route: true });
    prepDraw(topo.paths);
    const rd = routeDraw(topo.route);
    const msgs = ['Locating Josh', 'Lubing the chafe zones', 'Asking Mikey P which Mikey', 'Calibrating vibes ×2', 'Hiding the ankle from Saxon', 'Matty is breathing for him', 'Davey is clearing his throat', 'Charging headlamp (Josh?)'];
    const barney = L.querySelector('.loader__barney');
    const count = L.querySelector('.loader__count span');
    const msg = L.querySelector('.loader__msg');
    const c = { v: 0 };
    const tl = gsap.timeline();
    tl.to(topo.paths, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.out', stagger: { each: 0.01, from: 'random' } }, 0)
      .fromTo(barney, { y: 60, opacity: 0, scale: 0.9, rotate: -4 }, { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1, ease: 'back.out(1.6)' }, 0.35)
      .to(c, { v: 100, duration: 2.8, ease: 'power2.inOut', onUpdate: () => {
          count.textContent = Math.round(c.v);
          rd.set(c.v / 100);
          L.querySelector('.loader__bar').style.width = c.v + '%';
          msg.textContent = msgs[Math.min(msgs.length - 1, Math.floor(c.v / (100 / msgs.length)))];
        } }, 0.2)
      .to(barney, { rotate: -3, y: -6, duration: 0.25, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1.6)
      .add(() => {
        // fly Barney into the logo slot
        const a = barney.getBoundingClientRect();
        const b = navImg.getBoundingClientRect();
        const f = document.createElement('img');
        f.src = 'assets/barney.webp'; f.className = 'flyer';
        Object.assign(f.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
        document.body.appendChild(f);
        barney.style.opacity = 0;
        gsap.to(f, { left: b.left, top: b.top, width: b.width, height: b.height, duration: 1.05, ease: 'power3.inOut',
          onComplete: () => { navImg.style.opacity = 1; f.remove(); } });
        gsap.to(f, { rotate: 360, duration: 1.05, ease: 'power2.inOut' });
        gsap.to(L, { yPercent: -100, duration: 1, ease: 'power3.inOut', delay: 0.3, onComplete: () => { L.remove(); if (lenis) lenis.start(); } });
        gsap.delayedCall(0.55, done);
      }, 3.15);
  }

  window.addEventListener('DOMContentLoaded', () => {
    runLoader(() => {
      document.dispatchEvent(new CustomEvent('site:ready'));
      reveals();
      ScrollTrigger.refresh();
    });
  });
})();
