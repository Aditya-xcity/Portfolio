(() => {
  const route = document.querySelector('#developer-journey .journey-route');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (!route) return;

  const world = route.querySelector('.journey-world');
  const stops = [...route.querySelectorAll('li')];
  const colors = ['#ffba64','#ff8b50','#40d9ff','#a0aad1','#ffd18b'];
  const landmarks = ['GOTHAM UNIVERSITY','NFC CHECKPOINT','NEO GOTHAM AI','ROAD CLOSED','HORIZON PASS'];
  const shapes = [
    '<path d="M10 21 73 2l68 19v73H10z" fill="#503037" stroke="#ba7666" stroke-width="2"/><path d="M10 32h131M10 88h131" stroke="#d0886c"/><path d="M21 39h106" stroke="#21191d" stroke-width="5" stroke-dasharray="8 4"/><path d="M23 50h18v24H23zm32 0h18v24H55zm32 0h18v24H87zm29 0h13v24h-13z" fill="#ecba6e"/><path d="M67 94V77h21v17" fill="#261b1f"/><path d="M20 82h110" stroke="#8d5952" stroke-dasharray="5 3"/>',
    '<path d="M6 35 31 12v22l25-22v22l25-22v22h59v62H6z" fill="#584047" stroke="#af775d" stroke-width="2"/><path d="M13 48h120M13 54h120M13 60h120" stroke="#8c6459"/><path d="M19 73h34v23H19zm70 0h37v23H89z" fill="#281f24"/><path d="M15 72h117" stroke="#ff9b5d" stroke-width="4" stroke-dasharray="7 4"/><path d="M115 36V4h13v32" fill="#654c51"/><circle cx="71" cy="77" r="8" fill="#f5824c"/><path d="M68 76q3-5 6 0m-5 2q2-2 4 0" fill="none" stroke="#271a19"/>',
    '<path d="M5 72 23 44h22V27l20-21h36v29h17l25 28v33H5z" fill="#103247" stroke="#45d7ff" stroke-width="2"/><path d="M16 77h114M26 55h24m61 0h14M57 30h32m-32 7h32m-32 7h32" stroke="#65e5fa" stroke-dasharray="6 4"/><circle cx="78" cy="66" r="19" fill="#091c2c" stroke="#55d9ef"/><circle cx="78" cy="66" r="11" fill="none" stroke="#55d9ef" opacity=".5"/><g class="journey-radar"><circle cx="78" cy="66" r="18" fill="none"/><path d="M78 66V48a18 18 0 0 1 15 8Z" fill="#55eaff" opacity=".55"/></g><path d="M29 66v7h8m62 0h8v-7" fill="none" stroke="#5eeeff"/>',
    '<path d="m23 96 4-76 8 28L48 21l-8 38 5 37m47 0 4-66 9 21 14-28-8 38 7 35" fill="#121829" stroke="#242940" stroke-width="3"/><path d="m6 91 34-11 24 8 34-12 44 10" fill="none" stroke="#59607a" opacity=".5"/><path d="M53 90V60h32v30" fill="#303346"/><path d="m55 64 27 17m-27-7 26 16" stroke="#927979" stroke-width="3"/>',
    '<path d="M2 96 42 43l22 27L102 21l48 75Z" fill="#56636c"/><path d="m80 50 22-29 20 30-19-8-9 9-6-6m-60 15 14-18 13 16-12-3-6 6" fill="#f4d6ac"/><path d="m4 100 10-29 10 29m10 0 11-28 11 28m58 0 11-29 11 29m-37 0 9-20 9 20" fill="#1f4243"/>'
  ];

  const road = ['M400 0'];
  stops.forEach((_, i) => {
    const y = i * 600;
    const bend = i % 2 === 0 ? 505 : 295;
    road.push(`C400 ${y+115} ${bend} ${y+125} ${bend} ${y+300} S400 ${y+485} 400 ${y+600}`);
  });

  const districts = stops.map((stop, i) => {
    const y = i * 600;
    const accent = colors[i];
    const year = stop.querySelector('time').textContent;
    const scenery = [0,1,2,3,4,5,6,7].map(j => {
      const x = j % 2 ? 553 + (j * 29 % 80) : 22 + (j * 37 % 93);
      const size = .7 + (j * 13 % 6) / 10;
      return `<g transform="translate(${x} ${48+j*64}) scale(${size})"><ellipse cx="76" cy="92" rx="76" ry="17" fill="#000" opacity=".22"/>${shapes[i]}</g>`;
    }).join('');
    const signX = i % 2 ? 462 : 145;
    return `<g transform="translate(0 ${y})">
      <ellipse cx="${i % 2 ? 620 : 155}" cy="300" rx="370" ry="300" fill="url(#journey-light-${i})"/>
      ${i === 4 ? '<circle cx="663" cy="172" r="47" fill="#ffd897" opacity=".66"/>' : ''}
      ${scenery}
      ${i === 3 ? '<path d="M0 185Q260 130 800 220M0 360Q420 294 800 394M0 474Q386 405 800 472" stroke="#cbd1eb" stroke-width="58" opacity=".09" fill="none"/>' : ''}
      <g transform="translate(${signX} 240)"><path d="M10 38v22m160-22v22" stroke="${accent}" opacity=".6"/><rect width="180" height="38" rx="5" fill="#10131d" stroke="${accent}" stroke-opacity=".65"/><text x="90" y="15" fill="${accent}" text-anchor="middle" font-size="10" font-family="system-ui" letter-spacing="2">${year}</text><text x="90" y="29" fill="#f5f7ff" text-anchor="middle" font-size="9" font-family="system-ui" letter-spacing="1">${landmarks[i]}</text></g>
    </g>`;
  }).join('');

  world.innerHTML = `<svg class="journey-map" viewBox="0 0 800 3000" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>${colors.map((color,i) => `<radialGradient id="journey-light-${i}"><stop stop-color="${color}" stop-opacity=".32"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`).join('')}
    <radialGradient id="journey-lamp"><stop stop-color="#ffdc9d" stop-opacity=".66"/><stop offset="1" stop-color="#ffdc9d" stop-opacity="0"/></radialGradient>
    <path id="journey-road" d="${road.join(' ')}"/></defs>
    ${districts}
    <g fill="none"><use href="#journey-road" stroke="#090c13" stroke-width="127"/><use href="#journey-road" stroke="#67717d" stroke-width="114"/><use href="#journey-road" stroke="#252b35" stroke-width="104"/><use href="#journey-road" stroke="#cfba92" stroke-opacity=".7" stroke-width="3" stroke-dasharray="15 19"/></g>
    <g class="journey-lamps"></g></svg>
    <svg class="journey-car" viewBox="-40 -50 80 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="journey-armor" x2="75%" y2="100%"><stop stop-color="#616b7a"/><stop offset=".35" stop-color="#181d27"/><stop offset=".72" stop-color="#05070b"/><stop offset="1" stop-color="#303844"/></linearGradient>
        <linearGradient id="journey-beam" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#d6f0ff" stop-opacity=".57"/><stop offset="1" stop-color="#d6f0ff" stop-opacity="0"/></linearGradient>
      </defs>
      <path d="M-23 35 -49 111 -4 111 -11 35M23 35 49 111 4 111 11 35" fill="url(#journey-beam)"/>
      <path d="M-35-28h15v31h-15zm55 0h15v31H20ZM-31 17h13v25h-13zm49 0h13v25H18Z" fill="#05060a" stroke="#4c5261" stroke-width="2"/>
      <path d="M-33-20h10m-10 5h10m46-5h10m-10 5h10m-51 44h-10m46 0h10" stroke="#303642" stroke-width="2"/>
      <path d="M-33-8 -31-47 -17-34 -9-29H9l8-5 14-13 2 39-9 18 2 22-12 15h-28l-12-15 2-22Z" fill="url(#journey-armor)" stroke="#798393" stroke-width="1.3"/>
      <path d="m-20-25 8 12-7 24-5-6zm40 0-8 12 7 24 5-6zM-16 28l6-10h20l6 10-4 12h-24z" fill="#252d3a" stroke="#414b5a"/>
      <path d="M-10-8 0-13 10-8 13 12 8 19H-8l-5-7Z" fill="#0b1825" stroke="#6b899f" stroke-width="1.3"/>
      <path d="m-9 9 9 5 9-5m-5-31h-8m-10 58h28" fill="none" stroke="#8496ab" opacity=".65"/>
      <path d="m-22 33 8 6m36-6-8 6" stroke="#def5ff" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M-27-29h8m38 0h8" stroke="#ff4357" stroke-width="4" stroke-linecap="round" style="filter:drop-shadow(0 0 3px #ff4357)"/>
    </svg>`;

  const path = world.querySelector('#journey-road');
  const car = world.querySelector('.journey-car');
  const lamps = world.querySelector('.journey-lamps');
  const length = path.getTotalLength();
  lamps.innerHTML = Array.from({ length: 35 }, (_, i) => {
    const point = path.getPointAtLength((i+.5) * length / 35);
    const x = point.x + (i % 2 ? -72 : 72);
    return `<ellipse cx="${x}" cy="${point.y}" rx="50" ry="42" fill="url(#journey-lamp)"/><circle cx="${x}" cy="${point.y}" r="3.5" fill="#fff0cf"/>`;
  }).join('');

  // Sample the path once and advance it by world Y, keeping chapters in sync
  // with the page even where the road bends.
  const samples = Array.from({ length: 1001 }, (_, i) =>
    path.getPointAtLength(i * length / 1000));
  let frame = 0;
  let active = -1;
  let onScreen = true;

  function render() {
    frame = 0;
    if (!onScreen || motion.matches) return;
    const { top, height } = route.getBoundingClientRect();
    const camera = window.innerHeight * .47;
    const y = Math.max(35, Math.min(2965, (camera - top) / height * 3000));
    let low = 0;
    let high = samples.length - 1;
    while (high - low > 1) {
      const mid = (low + high) >> 1;
      if (samples[mid].y < y) low = mid;
      else high = mid;
    }
    const before = samples[low];
    const after = samples[high];
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const x = before.x + dx * (y - before.y) / dy;
    const angle = Math.atan2(-dx * world.clientWidth / 800, dy * height / 3000);
    car.style.left = `${x / 8}%`;
    car.style.top = `${y / 30}%`;
    car.style.rotate = `${angle}rad`;

    const next = Math.min(stops.length - 1, Math.floor(y / 600));
    if (next !== active) {
      stops[active]?.classList.remove('journey-active');
      stops[next].classList.add('journey-active');
      active = next;
    }
  }

  function schedule() {
    if (!frame && onScreen && !motion.matches) frame = requestAnimationFrame(render);
  }

  function applyMotionSetting() {
    route.classList.toggle('journey-ready', !motion.matches);
    schedule();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  motion.addEventListener('change', applyMotionSetting);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    });
    observer.observe(route);
  }
  applyMotionSetting();
})();
