/* ------------------------------------------------------------------
   UTCT 100 · race model
   Station km / climbing come from the official 2026 GPX (V6, 24 Aug),
   matched to the official aid-station map. Cut-offs: 2025/26 timing schedule.
------------------------------------------------------------------- */
(function () {
  const T = window.TERRAIN;

  // crew: true = crew allowed. stop = planned minutes in the station.
  const META = {
    'Start':                  { label: 'Start · Gardens Rugby Club', crew: true,  stop: 0,  cutoff: null,          kind: 'start' },
    'Signal Hill':            { label: 'Signal Hill',               crew: true,  stop: 2,  cutoff: null },
    'Kloof Nek':              { label: 'Kloof Nek',                 crew: true,  stop: 4,  cutoff: 'Sat 08:00' },
    'Platteklip (timing)':    { label: 'Platteklip Gorge (timing)', crew: false, stop: 0,  cutoff: null,          kind: 'timing' },
    'Table Mountain':         { label: 'Table Mountain',            crew: false, stop: 4,  cutoff: null },
    'Llandudno':              { label: 'Llandudno',                 crew: true,  stop: 6,  cutoff: null },
    'Rocket Road':            { label: 'Rocket Road',               crew: false, stop: 2,  cutoff: null },
    'Hout Bay':               { label: 'Hout Bay',                  crew: true,  stop: 15, cutoff: 'Sat 18:30',   kind: 'change' },
    'Constantia Glen':        { label: 'Constantia Glen',           crew: false, stop: 3,  cutoff: null },
    'Alphen Trail':           { label: 'Alphen Trail',              crew: true,  stop: 7,  cutoff: 'Sat 23:00' },
    'Nursery Ravine (timing)':{ label: 'Nursery Ravine (timing)',   crew: false, stop: 0,  cutoff: null,          kind: 'timing' },
    'Newlands Picnic':        { label: 'Newlands Picnic Site',      crew: true,  stop: 6,  cutoff: 'Sun 03:00' },
    'Finish':                 { label: 'Finish · Gardens Rugby Club', crew: true, stop: 0, cutoff: 'Sun 06:00',   kind: 'finish' }
  };

  // Map hover blurbs, one per leg (leg ends at station[i]).
  const LEGS = [
    null,
    { title: 'The Polite Bit', where: 'Gardens → Lion’s Head → Signal Hill',
      blurb: 'Starts at 4am in the dark with 600 people who all think they’re pacing it sensibly. They are not. Barney is not. Headlamps, city lights, false confidence.' },
    { title: 'Sunrise, Briefly', where: 'Signal Hill → Kloof Nek',
      blurb: 'The sun comes up over the city. He will look great. This is the best he’ll look all day and frankly the best he’s looked all year. Take a photo.' },
    { title: 'Platteklip', where: 'Kloof Nek → top of Table Mountain',
      blurb: 'Roughly 950 m straight up in 5 km. Stone stairs built by someone with a grudge against knees, specifically his left one. Tourists in Crocs will pass him. Let them.' },
    { title: 'The Top', where: 'Across the summit plateau',
      blurb: 'Rocks, wind and a cloud that may or may not let him see anything. No crew allowed. Just Barney alone with his thoughts, which historically is how the injuries happen.' },
    { title: 'The Quad Shredder', where: 'Table Mountain → Llandudno',
      blurb: 'Over a kilometre of descent down to the beach at Llandudno. This is where quads go to die and the ankle from March files a formal complaint.' },
    { title: 'Karbonkelberg, Part 1', where: 'Llandudno → Rocket Road',
      blurb: 'Coastline and the climb toward Karbonkelberg. Beautiful. Remote. He won’t notice either, he’ll be looking at his feet.' },
    { title: 'The Remote Bit', where: 'Suther Peak → Hout Bay',
      blurb: 'The Karbonkelberg traverse. No signal, no crew, no witnesses. Then the long drop into Hout Bay, where he gets to change his clothes like a man starting a second, worse life.' },
    { title: 'The Long One', where: 'Hout Bay → Constantia Glen',
      blurb: '14 km and over 900 m of climbing straight after the halfway party. Beach, East Fort, the old manganese mine, over the mountain. People say this is where the race starts. Those people are not running it.' },
    { title: 'Wine Country', where: 'Constantia Glen → Alphen',
      blurb: 'Vineyards and very expensive houses. Nobody will offer him wine. Someone will be drinking wine. He will see it.' },
    { title: 'Greenbelts', where: 'Alphen → Nursery Ravine',
      blurb: 'Suburban greenbelts. Dog walkers will stare. It is probably getting dark. He is probably talking to himself.' },
    { title: 'Forest at Night', where: 'Nursery Ravine → Newlands',
      blurb: 'Newlands Forest in the dark. Roots, rocks, and a headlamp that better be fully charged, Josh.' },
    { title: 'The Last 11', where: 'Newlands → Contour Path → Dead Man’s Tree → Gardens',
      blurb: 'Eleven kilometres that will take about as long as a normal person’s whole Sunday. Dead Man’s Tree is a real landmark and not a prediction. Then downhill to the finish and a lie-down on the grass.' }
  ];

  const stations = T.stations.map((s, i) => Object.assign({}, s, META[s.name], { idx: i, leg: LEGS[i] }));

  // Effort model: flat km + climbing + technical descent, with fatigue + night slow-down.
  const START_MIN = 4 * 60;          // 04:00
  const SUNSET = 19 * 60 + 46;       // 21 Nov, Cape Town
  const SUNRISE = 5 * 60 + 32;
  function legEffort(s, prev) {
    const km = s.segkm, up = s.up, down = s.down;
    const mid = (s.km + prev.km) / 2;
    const fatigue = 1 + 0.0075 * mid;
    return (km + up / 100 + down / 250) * fatigue;
  }
  function schedule(targetHours) {
    const stops = stations.reduce((a, s) => a + s.stop, 0);
    const efforts = stations.map((s, i) => (i ? legEffort(s, stations[i - 1]) : 0));
    // iterate to account for night slow-down (12% after sunset)
    let k = (targetHours * 60 - stops) / efforts.reduce((a, b) => a + b, 0);
    for (let it = 0; it < 30; it++) {
      let t = START_MIN, total = 0;
      stations.forEach((s, i) => {
        if (!i) return;
        const night = t > SUNSET || t < SUNRISE ? 1.12 : 1;
        const m = efforts[i] * k * night;
        t += m + s.stop; total += m;
      });
      const err = (targetHours * 60) - (t - START_MIN);
      k *= 1 + err / (targetHours * 60);
    }
    let t = START_MIN;
    return stations.map((s, i) => {
      if (i) {
        const night = t > SUNSET || t < SUNRISE ? 1.12 : 1;
        const legMin = efforts[i] * k * night;
        t += legMin;
        const arrive = t; t += s.stop;
        return { s, legMin, arrive, depart: t };
      }
      return { s, legMin: 0, arrive: t, depart: t };
    });
  }
  function clock(min) {
    const d = Math.floor(min / 1440);
    const m = ((Math.round(min) % 1440) + 1440) % 1440;
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    return (d ? 'Sun ' : 'Sat ') + hh + ':' + mm;
  }
  function dur(min) {
    const h = Math.floor(min / 60), m = Math.round(min % 60);
    return h ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`;
  }
  function cutoffMin(c) {
    if (!c) return null;
    const [day, hm] = c.split(' ');
    const [h, m] = hm.split(':').map(Number);
    return (day === 'Sun' ? 1440 : 0) + h * 60 + m;
  }

  window.RACE = { stations, schedule, clock, dur, cutoffMin, SUNSET, SUNRISE, START_MIN,
    date: new Date('2026-11-21T04:00:00+02:00') };
  /* ---------------- fuel model ----------------
     73 kg, heavy sweater. Per hour: carbs 75 g, fluid 750 ml, sodium ~900 mg.
     Structure: 1 flask mix/h (~45 g) + 1 gel-or-solid/h (~25 g) + salt. */
  const FUEL = {
    weight: 73,
    carbsPerHour: 75, fluidPerHour: 750, sodiumPerHour: 900,
    caffeineMax: [220, 290],  // 3–4 mg/kg
    products: {
      gelCaf:  { name: 'Näak chocolate-coffee gel', carbs: 27, caffeine: 35, verified: true },
      gel:     { name: 'Non-caffeine gel (e.g. Näak maple)', carbs: 27, caffeine: 0 },
      waffle:  { name: 'Näak stroopwafel', carbs: 19, caffeine: 0, verify: true },
      bar:     { name: 'Näak peanut butter & choc bar', carbs: 25, caffeine: 0, verify: true },
      mix:     { name: 'Drink-mix sachet (500 ml flask)', carbs: 45 },
      salt:    { name: 'Salt capsule', sodium: 215 }
    }
  };
  // crew-to-crew stretches: what to hand him at each crew station
  function fuelPlan(sched) {
    const crewIdx = sched.map((r, i) => (r.s.crew ? i : -1)).filter(i => i >= 0);
    const out = [];
    for (let k = 0; k < crewIdx.length - 1; k++) {
      const a = sched[crewIdx[k]], b = sched[crewIdx[k + 1]];
      const h = (b.arrive - a.depart) / 60;
      const lateRace = a.s.km >= 57;               // caffeine from Hout Bay on
      const mix = Math.max(1, Math.round(h));
      const solids = Math.max(1, Math.round(h * 0.45));
      const gels = Math.max(1, Math.round(h * 0.6));
      const salt = Math.ceil(h * 1.5);
      const carbs = Math.round(mix * 45 + gels * 27 + Math.ceil(solids / 2) * 19 + Math.floor(solids / 2) * 25);
      out.push({ from: a, to: b, hours: h, mix, gels, gelType: lateRace ? 'gelCaf' : 'gel',
        waffles: Math.ceil(solids / 2), bars: Math.floor(solids / 2), salt,
        fluid: Math.round(h * FUEL.fluidPerHour / 50) * 50, carbs, carbsPerHour: Math.round(carbs / h),
        caffeine: lateRace ? gels * 35 : 0 });
    }
    return out;
  }
  window.RACE.FUEL = FUEL;
  window.RACE.fuelPlan = fuelPlan;
})();
