/* Photo gallery viewer (see _includes/gallery.html and _data/gallery.yml).
   Click a tile to open the photo with its title and description.
   Left/right arrows (or the buttons, or a swipe) move between photos; Esc, the x, or a click outside closes it. */
(function () {
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.gallery .tile'));
  if (!tiles.length) return;

  var dlg = document.createElement('dialog');
  if (typeof dlg.showModal !== 'function') return;          // very old browser: the thumbnails just stay as they are

  dlg.className = 'gallery-viewer';
  dlg.setAttribute('aria-label', 'Photo');
  dlg.innerHTML =
    '<button class="gv-btn gv-close" type="button" aria-label="Close">&times;</button>' +
    '<div class="gv-img">' +
      '<button class="gv-btn gv-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
      '<img alt="">' +
      '<button class="gv-btn gv-next" type="button" aria-label="Next photo">&#8250;</button>' +
    '</div>' +
    '<div class="gv-text"><h3></h3><p></p><div class="gv-count"></div></div>';
  document.body.appendChild(dlg);

  var img = dlg.querySelector('.gv-img img');
  var title = dlg.querySelector('h3');
  var desc = dlg.querySelector('.gv-text p');
  var count = dlg.querySelector('.gv-count');
  var idx = 0;

  function show(i) {
    idx = (i + tiles.length) % tiles.length;
    var t = tiles[idx];
    img.src = t.dataset.src;
    img.alt = t.dataset.title || '';
    title.textContent = t.dataset.title || '';
    desc.textContent = t.dataset.desc || '';
    desc.hidden = !t.dataset.desc;
    count.textContent = 'Photo ' + (idx + 1) + ' of ' + tiles.length;
  }

  tiles.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); dlg.showModal(); });
  });

  dlg.querySelector('.gv-close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.gv-prev').addEventListener('click', function () { show(idx - 1); });
  dlg.querySelector('.gv-next').addEventListener('click', function () { show(idx + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });   // click on the dark backdrop
  dlg.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  var x0 = null;                                            // swipe on touch screens
  dlg.addEventListener('touchstart', function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
  dlg.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  }, { passive: true });
})();
