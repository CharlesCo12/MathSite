/* Click any image inside <main> to see it larger. Click again, or press Esc, to close. */
(function () {
  var dialog = document.createElement('dialog');
  if (typeof dialog.showModal !== 'function') return;     // very old browser: images just don't zoom

  dialog.className = 'lightbox';
  dialog.innerHTML = '<img alt=""><p class="lightbox-caption"></p>';
  document.body.appendChild(dialog);
  var big = dialog.querySelector('img');
  var caption = dialog.querySelector('.lightbox-caption');

  function zoomable(img) {
    return img && !img.closest('a') && !img.classList.contains('no-zoom');
  }

  function open(img) {
    var fig = img.closest('figure');
    var fc = fig && fig.querySelector('figcaption');
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    caption.textContent = fc ? fc.innerText.trim().replace(/\s*\n+\s*/g, ' \u00b7 ') : img.alt;   // lines joined with " · "
    dialog.showModal();
  }

  var images = document.querySelectorAll('main img');
  images.forEach(function (img) {
    if (!zoomable(img)) return;
    img.classList.add('zoomable');
    img.tabIndex = 0;                                      // reachable with the keyboard
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { open(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); }
    });
  });

  dialog.addEventListener('click', function () { dialog.close(); });   // click anywhere to close
})();