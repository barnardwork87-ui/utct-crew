(function () {
  const f = document.getElementById('foot');
  if (!f) return;
  f.innerHTML = `
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <h5>Crew HQ</h5>
        <p style="font-size:14px;opacity:.75;max-width:34ch">The crew briefing for Barney’s RMB UTCT 100. Built so nobody has to ask him anything after 2pm on Saturday.</p>
      </div>
      <div><h5>The plan</h5><a href="index.html">Home</a><a href="crew.html">The Crew</a><a href="schedule.html">Timing & Schedule</a></div>
      <div><h5>On the day</h5><a href="aid-stations.html">Aid Stations</a><a href="fuel.html">Fuelling</a></div>
      <div><h5>Official</h5>
        <a href="https://www.ultratrailcapetown.com/ut100" target="_blank" rel="noopener">UT100 race page ↗</a>
        <a href="https://www.ultratrailcapetown.com/aid-station-locations" target="_blank" rel="noopener">Aid station map ↗</a>
        <a href="https://www.ultratrailcapetown.com/race-info" target="_blank" rel="noopener">Race info & live tracking ↗</a>
      </div>
    </div>
    <div class="foot__big">See you at Hout Bay.</div>
    <div class="foot__legal">
      <span>Not affiliated with RMB UTCT. Race photos © Ultra-Trail Cape Town and its photographers. Route: official UT100 2026 GPX (V6). Contours: AWS Terrain Tiles.</span>
      <span>Times are estimates. Cut-offs are not.</span>
    </div>
  </div>`;
})();
