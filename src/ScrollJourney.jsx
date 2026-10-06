import { useEffect, useRef } from 'react';

export default function ScrollJourney() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let frame = null;
    function textSize() { document.documentElement.classList.toggle('large-type', parseFloat(getComputedStyle(document.documentElement).fontSize) >= 24); }
    textSize();
    function update() {
      frame = null;
      const max = document.documentElement.scrollHeight - innerHeight;
      const ratio = max > 0 ? Math.max(0, Math.min(1, scrollY / max)) : 0;
      el.style.setProperty('--journey-progress', ratio);
      el.classList.toggle('is-started', scrollY > innerHeight * .35);
      const sections = ['experience', 'projects', 'strengths', 'contact'];
      let active = '';
      for (const id of sections) if (document.getElementById(id).getBoundingClientRect().top < innerHeight * .45) active = id;
      document.querySelectorAll('.nav-glass a').forEach(a => { if (a.getAttribute('href') === `#${active}`) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
    }
    const schedule = () => { textSize(); if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule); resize.observe(document.body);
    addEventListener('scroll', schedule, { passive: true }); addEventListener('resize', schedule);
    update();
    return () => { removeEventListener('scroll', schedule); removeEventListener('resize', schedule); resize.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <div className="scroll-journey" aria-hidden="true" ref={ref}><span className="journey-track" /><span className="journey-ink" /><span className="journey-lens glass" /></div>;
}
