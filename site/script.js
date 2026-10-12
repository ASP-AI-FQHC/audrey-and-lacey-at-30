// Lacey and Audrey's own photos, added through Pages CMS into data/their-photos.json.
// The publish build makes a thumbnail for each in photos/theirs/s/.
function loadTheirPhotos() {
  var section = document.getElementById('theirs');
  if (!section || !window.fetch) return Promise.resolve();
  return fetch('data/their-photos.json', { cache: 'no-cache' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (photos) {
      var grid = section.querySelector('.shots');
      photos.forEach(function (p) {
        if (!p || !p.image) return;
        var full = String(p.image).replace(/^\//, '');
        var thumb = full.replace(/([^\/]+)$/, 's/$1');
        var words = (p.caption || '').trim();
        var alt = words || 'A photo shared by Lacey and Audrey';

        var fig = document.createElement('figure');
        fig.className = 'shot';
        var btn = document.createElement('button');
        btn.className = 'tile-shot';
        btn.type = 'button';
        btn.setAttribute('data-full', full);
        btn.setAttribute('data-alt', alt);
        var img = document.createElement('img');
        img.loading = 'lazy';
        img.alt = alt;
        img.onerror = function () { img.onerror = null; img.src = full; };
        img.src = thumb;
        btn.appendChild(img);
        fig.appendChild(btn);
        if (words) {
          var cap = document.createElement('figcaption');
          cap.textContent = words;
          fig.appendChild(cap);
        }
        grid.appendChild(fig);
      });
      if (grid.children.length) section.hidden = false;
    })
    .catch(function () {});
}

// Lightbox for the gallery. Native <dialog>, keyboard arrows, swipe on touch.
loadTheirPhotos().then(function () {
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile, .tile-shot'));
  var box = document.getElementById('lightbox');
  if (!box || !tiles.length || typeof box.showModal !== 'function') return;

  var img = box.querySelector('.lb-img');
  var count = box.querySelector('.lb-count');
  var current = 0;

  function show(i) {
    current = (i + tiles.length) % tiles.length;
    var t = tiles[current];
    img.src = t.getAttribute('data-full');
    img.alt = t.getAttribute('data-alt') || '';
    count.textContent = (current + 1) + ' of ' + tiles.length;
    // warm the neighbours so arrows feel instant
    [current + 1, current - 1].forEach(function (n) {
      var pre = new Image();
      pre.src = tiles[(n + tiles.length) % tiles.length].getAttribute('data-full');
    });
  }

  function open(i) {
    show(i);
    box.showModal();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.close();
  }

  box.addEventListener('close', function () {
    document.body.style.overflow = '';
    tiles[current].focus();
  });

  tiles.forEach(function (t, i) {
    t.addEventListener('click', function () { open(i); });
  });

  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });

  box.addEventListener('click', function (e) {
    if (e.target === box) close();
  });

  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
  });

  var startX = null;
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (dx < -40) show(current + 1);
    if (dx > 40) show(current - 1);
    startX = null;
  }, { passive: true });
});
