import { useEffect } from 'react';

// Cache section geometry; scrolling updates only navigation and header state.
export default function SectionNavigation({ onActiveChange }) {
  useEffect(() => {
    const header = document.querySelector('.site-header');
    let frame = null, lastActive = null, lastExpanded = null, geometry = [], disposed = false;
    let height = innerHeight, heroHeight = innerHeight;
    function measure() {
      if (disposed) return;
      document.documentElement.classList.toggle('large-type', parseFloat(getComputedStyle(document.documentElement).fontSize) >= 24);
      height = innerHeight;
      heroHeight = document.querySelector('.hero').offsetHeight;
      geometry = ['about', 'tech', 'douyin'].map(id => ({ id, top: document.getElementById(id).getBoundingClientRect().top + scrollY }));
      schedule();
    }
    function update() {
      frame = null;
      const y = scrollY;
      let active = 'about';
      for (const section of geometry) if (section.top - y < height * .45) active = section.id;
      if (active !== lastActive) { lastActive = active; onActiveChange?.(active); }
      const expanded = lastExpanded === false ? y < heroHeight * .18 : y < heroHeight * .3;
      if (expanded !== lastExpanded) { lastExpanded = expanded; header.dataset.expanded = String(expanded); }
    }
    function schedule() { if (frame === null) frame = requestAnimationFrame(update); }
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', measure);
    document.fonts.ready.then(measure);
    measure();
    return () => { disposed = true; removeEventListener('scroll', schedule); removeEventListener('resize', measure); resize.disconnect(); if (frame !== null) cancelAnimationFrame(frame); };
  }, [onActiveChange]);
  return null;
}
