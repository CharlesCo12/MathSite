/* CV page: builds the sticky section bar from the "##" headings and highlights
   the section you are reading. Without JavaScript the CV is still a normal page. */
(function () {
  var body = document.querySelector('.cv-body');
  if (!body) return;
  var heads = Array.prototype.slice.call(body.querySelectorAll('h2'));
  if (heads.length < 2) return;
 
  // 1. Build the bar (one button per section)
  var used = {};
  function makeId(text) {
    var base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    var id = base, n = 2;
    while (used[id] || document.getElementById(id)) { id = base + '-' + n++; }
    return id;
  }
  var nav = document.createElement('nav');
  nav.className = 'cv-chips';
  nav.setAttribute('aria-label', 'CV sections');
  var links = heads.map(function (h) {
    if (!h.id) h.id = makeId(h.textContent);
    used[h.id] = true;
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.getAttribute('data-short') || h.textContent;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      h.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) history.replaceState(null, '', '#' + h.id);
    });
    nav.appendChild(a);
    return a;
  });
  body.insertBefore(nav, body.firstChild);
 
  // 2. Work out how much room the sticky menu above us takes (it wraps on narrow
  //    screens and is not sticky on phones), so nothing hides underneath it.
  var root = document.documentElement;
  var header = document.querySelector('header');
  var barH = 0;
  function measure() {
    var top = (header && getComputedStyle(header).position === 'sticky') ? header.offsetHeight : 0;
    barH = top + nav.offsetHeight;
    root.style.setProperty('--cv-top', top + 'px');
    root.style.setProperty('--cv-offset', (barH + 16) + 'px');
    root.style.scrollPaddingTop = '0px';   // this page sets its own offset (scroll-margin on the headings)
  }
 
  // 3. Highlight the section being read
  var active = -2;
  function spy() {
    var i = -1;
    for (var k = 0; k < heads.length; k++) {
      if (heads[k].getBoundingClientRect().top <= barH + 40) i = k;
    }
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) i = heads.length - 1;
    if (i === active) return;
    active = i;
    links.forEach(function (a, k) {
      a.classList.toggle('on', k === i);
      if (k === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    if (i >= 0 && nav.scrollWidth > nav.clientWidth + 2) {
      nav.scrollLeft = links[i].offsetLeft - nav.clientWidth / 2 + links[i].offsetWidth / 2;
    }
  }
 
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; spy(); });
  }, { passive: true });
  function refresh() { measure(); active = -2; spy(); }
  window.addEventListener('resize', refresh);
  window.addEventListener('load', refresh);
  refresh();
})();