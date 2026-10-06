import { useEffect, useRef } from 'react';

// Two decoded video layers conceal the loop boundary; a visible layer is never reset.
export default function HeroVideo() {
  const artRef = useRef(null);
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const art = artRef.current;
    const videos = [firstRef.current, secondRef.current];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 760px)').matches || navigator.connection?.saveData;
    const source = `/assets/hero-flow-loop${compact ? '-mobile' : ''}-60fps.mp4`;
    let active = 0, visible = true, switching = false, generation = 0, disposed = false;
    let frame = null, animations = [];
    const eligible = () => !disposed && !reduced.matches && visible && !document.hidden;
    const cancelFrame = () => {
      if (frame && videos[active].cancelVideoFrameCallback) videos[active].cancelVideoFrameCallback(frame);
      frame = null;
    };
    function settle() {
      generation++;
      switching = false;
      animations.forEach(a => a.cancel());
      animations = [];
      videos.forEach((v, i) => {
        v.classList.toggle('is-active', i === active);
        if (i !== active) { v.pause(); if (v.readyState >= 1) v.currentTime = 0; }
      });
    }
    function watch() {
      cancelFrame();
      if (!eligible()) return;
      const v = videos[active];
      if (v.requestVideoFrameCallback) frame = v.requestVideoFrameCallback(() => {
        frame = null;
        if (!switching && v.duration > 4 && v.duration - v.currentTime <= 2) handoff();
        if (eligible() && v === videos[active]) watch();
      });
    }
    async function firstFrame(v) {
      if (!v.requestVideoFrameCallback) return;
      await new Promise(resolve => {
        let done = false;
        const timer = setTimeout(() => { if (!done) { done = true; resolve(); } }, 700);
        v.requestVideoFrameCallback(() => { if (!done) { done = true; clearTimeout(timer); resolve(); } });
      });
    }
    async function handoff() {
      if (switching || !eligible()) return;
      const next = 1 - active, from = videos[active], to = videos[next];
      if (to.error || to.readyState < 2) return;
      switching = true;
      const token = ++generation;
      to.currentTime = 0;
      try { await to.play(); await firstFrame(to); } catch { switching = false; return; }
      if (token !== generation || !eligible()) return;
      animations = [
        from.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1100, easing: 'ease-in-out', fill: 'both' }),
        to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1100, easing: 'ease-in-out', fill: 'both' }),
      ];
      try { await Promise.all(animations.map(a => a.finished)); } catch { return; }
      if (token !== generation || disposed) return;
      cancelFrame();
      active = next;
      from.pause();
      from.currentTime = 0;
      videos.forEach((v, i) => v.classList.toggle('is-active', i === active));
      animations.forEach(a => a.cancel());
      animations = [];
      switching = false;
      watch();
    }
    function reconcile() {
      art.classList.toggle('is-reduced', reduced.matches);
      if (!eligible()) { cancelFrame(); settle(); videos.forEach(v => v.pause()); }
      else videos[active].play().then(watch).catch(() => {});
    }
    const handlers = videos.map((v, i) => {
      const loaded = () => { art.classList.add('is-ready'); if (i === active) reconcile(); };
      const fallback = () => { if (!v.requestVideoFrameCallback && i === active && !switching && v.duration > 4 && v.duration - v.currentTime <= 2) handoff(); };
      v.addEventListener('loadeddata', loaded);
      v.addEventListener('timeupdate', fallback);
      v.muted = true; v.loop = true; v.src = source;
      return { loaded, fallback };
    });
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; reconcile(); }, { threshold: .04 });
    observer.observe(art.closest('section'));
    reduced.addEventListener('change', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    reconcile();
    return () => {
      disposed = true;
      generation++;
      cancelFrame();
      observer.disconnect();
      animations.forEach(a => a.cancel());
      reduced.removeEventListener('change', reconcile);
      document.removeEventListener('visibilitychange', reconcile);
      videos.forEach((v, i) => {
        v.pause(); v.removeEventListener('loadeddata', handlers[i].loaded); v.removeEventListener('timeupdate', handlers[i].fallback);
      });
    };
  }, []);

  return <div className="hero-art" ref={artRef} aria-hidden="true">
    <img className="hero-poster" src="/assets/hero-flow-loop-poster.jpg" alt="" />
    <video className="hero-video is-active" ref={firstRef} muted loop playsInline preload="auto" poster="/assets/hero-flow-loop-poster.jpg" disablePictureInPicture />
    <video className="hero-video" ref={secondRef} muted loop playsInline preload="auto" disablePictureInPicture />
    <div className="video-edges" />
  </div>;
}
