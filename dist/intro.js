/* Decode the next loop before fading to it; never seek a visible layer. */
(() => {
  const first = document.getElementById('hero-video');
  if (!first) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const art = first.parentElement;
  const compact = matchMedia('(max-width:760px)').matches || navigator.connection?.saveData;
  const source = (compact && first.dataset.srcMobile) || first.dataset.src;
  const second = first.cloneNode(false);
  second.id = 'hero-video-next';
  second.classList.remove('is-active');
  art.insertBefore(second, first.nextSibling);
  const videos = [first, second];
  let active = 0, visible = true, generation = 0, switching = false, transitions = [], frameId = null;
  const eligible = () => !reduced.matches && visible && !document.hidden;
  const cancelWatch = () => {
    if (frameId !== null && videos[active].cancelVideoFrameCallback) videos[active].cancelVideoFrameCallback(frameId);
    frameId = null;
  };
  function settle() {
    generation++;
    switching = false;
    transitions.forEach(a => a.cancel());
    transitions = [];
    videos.forEach((v, i) => {
      v.classList.toggle('is-active', i === active);
      v.style.opacity = '';
      if (i !== active) { v.pause(); if (v.readyState >= 1) v.currentTime = 0; }
    });
  }
  function watch() {
    cancelWatch();
    if (!eligible()) return;
    const v = videos[active];
    if (v.requestVideoFrameCallback) {
      frameId = v.requestVideoFrameCallback(() => {
        frameId = null;
        if (!switching && v.duration > 4 && v.duration - v.currentTime <= 2) handoff();
        if (eligible() && v === videos[active]) watch();
      });
    }
  }
  function firstFrame(v) {
    return new Promise(resolve => {
      if (!v.requestVideoFrameCallback) { resolve(); return; }
      let done = false;
      const timer = setTimeout(() => { if (!done) { done = true; resolve(); } }, 700);
      v.requestVideoFrameCallback(() => { if (!done) { done = true; clearTimeout(timer); resolve(); } });
    });
  }
  async function handoff() {
    if (switching || !eligible()) return;
    const nextIndex = 1 - active, from = videos[active], to = videos[nextIndex];
    if (to.error || to.readyState < 2) return; // Native loop remains the fallback.
    switching = true;
    const token = ++generation;
    to.currentTime = 0;
    try { await to.play(); await firstFrame(to); } catch { switching = false; return; }
    if (token !== generation || !eligible()) return;
    transitions = [
      from.animate([{opacity:1},{opacity:0}], {duration:1100,easing:'ease-in-out',fill:'both'}),
      to.animate([{opacity:0},{opacity:1}], {duration:1100,easing:'ease-in-out',fill:'both'})
    ];
    try { await Promise.all(transitions.map(a => a.finished)); } catch { return; }
    if (token !== generation) return;
    cancelWatch();
    active = nextIndex;
    from.pause();
    from.currentTime = 0;
    videos.forEach((v,i) => v.classList.toggle('is-active', i === active));
    transitions.forEach(a => a.cancel());
    transitions = [];
    switching = false;
    watch();
  }
  function reconcile() {
    if (!eligible()) {
      cancelWatch(); settle(); videos.forEach(v => v.pause());
    } else {
      videos[active].play().then(watch).catch(() => {});
    }
  }
  videos.forEach((v,i) => {
    v.muted = true; v.loop = true; v.autoplay = false; v.src = source;
    v.addEventListener('loadeddata', () => { art.classList.add('is-ready'); if (i === active) reconcile(); });
    v.addEventListener('error', () => { if (i === active) art.classList.add('is-unavailable'); });
    v.addEventListener('timeupdate', () => {
      if (!v.requestVideoFrameCallback && i === active && !switching && v.duration > 4 && v.duration-v.currentTime <= 2) handoff();
    });
  });
  reduced.addEventListener('change', reconcile);
  document.addEventListener('visibilitychange', reconcile);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; reconcile();
  }, {threshold:.04}).observe(document.querySelector('.hero-scene'));
  reconcile();
})();

