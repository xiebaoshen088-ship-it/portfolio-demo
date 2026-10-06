import { useEffect } from 'react';
import { GLASS } from './glassConfig.js';

export default function useGlass() {
  useEffect(() => {
    if (!/Chrome|Chromium|Edg\//.test(navigator.userAgent) || !window.ResizeObserver || !CSS.supports('backdrop-filter', 'url("#glass-test")')) return;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
    svg.style.cssText = 'position:absolute;pointer-events:none;overflow:hidden';
    const defs = document.createElementNS(ns, 'defs'); svg.append(defs); document.body.append(svg);
    const nodes = new WeakMap(); let serial = 0;
    const make = (tag, attrs) => { const el = document.createElementNS(ns, tag); Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value))); return el; };
    function update(el) {
      if (el.matches('.glass-control')) { el.style.removeProperty('--glass-optics'); return; }
      const dockLens=el.matches('.dock-lens-material');
      if((el.closest('.site-header,.hero')&&!dockLens)||el.matches('.segment-indicator,.scene-lens')){el.style.removeProperty('--glass-optics');return;}
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (w < 2 || h < 2 || w * h > GLASS.optics.maxArea) { el.style.removeProperty('--glass-optics'); return; }
      const radius = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      let node = nodes.get(el);
      if (node?.w === w && node?.h === h && node?.radius === radius) return;
      if (!node) {
        const id = `react-glass-${serial++}`;
        const filter = make('filter', { id, x: 0, y: 0, width: '100%', height: '100%', filterUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' });
        const map = make('feImage', { x: 0, y: 0, preserveAspectRatio: 'none', result: 'rim' });
        filter.append(map, make('feDisplacementMap', { in: 'SourceGraphic', in2: 'rim', scale: GLASS.optics.displacement, xChannelSelector: 'R', yChannelSelector: 'G' }));
        defs.append(filter); node = { id, filter, map }; nodes.set(el, node);
      }
      Object.assign(node, { w, h, radius });
      node.filter.setAttribute('width', w); node.filter.setAttribute('height', h);
      node.map.setAttribute('width', w); node.map.setAttribute('height', h);
      const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      const pixels = ctx.createImageData(w, h), cx = w / 2, cy = h / 2, rim = Math.min(GLASS.optics.rim, h * .24);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const dx = x + .5 - cx, dy = y + .5 - cy;
        const qx = Math.max(Math.abs(dx) - (cx - radius), 0), qy = Math.max(Math.abs(dy) - (cy - radius), 0);
        const distance = Math.hypot(qx, qy), depth = radius - distance;
        const strength = distance > 0 && depth > 0 && depth < rim ? Math.sin(Math.PI * depth / rim) : 0;
        const nx = distance ? qx / distance * Math.sign(dx) : 0, ny = distance ? qy / distance * Math.sign(dy) : 0;
        // Keep the center stable; only a narrow rim displaces the actual backdrop.
        const ox = nx * strength * GLASS.optics.edgeOffset;
        const oy = ny * strength * GLASS.optics.edgeOffset;
        const i = (y * w + x) * 4;
        pixels.data[i] = 128 + ox / GLASS.optics.displacement * 255; pixels.data[i + 1] = 128 + oy / GLASS.optics.displacement * 255; pixels.data[i + 2] = 128; pixels.data[i + 3] = 255;
      }
      ctx.putImageData(pixels, 0, 0); node.map.setAttribute('href', canvas.toDataURL());
      el.style.setProperty('--glass-optics', `url("#${node.id}") blur(var(--glass-blur)) saturate(var(--glass-saturation))`);
    }
    const observer = new ResizeObserver(entries => entries.forEach(({ target }) => update(target)));
    const observe = node => { if (node.nodeType !== 1) return; if (node.matches('.glass')) observer.observe(node); node.querySelectorAll('.glass').forEach(el => observer.observe(el)); };
    const unobserve = node => { if (node.nodeType !== 1) return; [node, ...node.querySelectorAll('.glass')].forEach(el => { const optical = nodes.get(el); if (optical) { observer.unobserve(el); optical.filter.remove(); nodes.delete(el); } }); };
    document.querySelectorAll('.glass').forEach(el => observer.observe(el));
    const mutations = new MutationObserver(records => records.forEach(record => { record.addedNodes.forEach(observe); record.removedNodes.forEach(unobserve); }));
    mutations.observe(document.body, { childList: true, subtree: true });
    let frame=null, pending=null,lastLight=0;
    function pointer(e) {
      const el=e.target.closest?.('.glass');
      if(!el||el.classList.contains('segment-indicator')||el.matches('.site-header,.dock-control,.dock-lens-material'))return;
      pending={el,clientX:e.clientX,clientY:e.clientY};
      if(!frame)frame=requestAnimationFrame(time=>{
        frame=null;if(!pending||time-lastLight<25)return;lastLight=time;
        const {el,clientX,clientY}=pending,r=el.getBoundingClientRect();
        el.style.setProperty('--light-x',`${Math.max(0,Math.min(100,(clientX-r.left)/r.width*100))}%`);
        el.style.setProperty('--light-y',`${Math.max(0,Math.min(100,(clientY-r.top)/r.height*100))}%`);
      });
    }
    const pressed=new Set();
    function press(e){if(e.type==='keydown'&&!['Enter',' '].includes(e.key))return;const el=e.target.closest?.('button.glass,a.glass,.segmented');if(el){el.classList.add('is-pressed');pressed.add(el);}}
    function release(){pressed.forEach(el=>el.classList.remove('is-pressed'));pressed.clear();}
    document.addEventListener('pointermove',pointer,{passive:true});document.addEventListener('pointerdown',press);document.addEventListener('pointerup',release);document.addEventListener('pointercancel',release);document.addEventListener('keydown',press);document.addEventListener('keyup',release);window.addEventListener('blur',release);
    return () => { observer.disconnect(); mutations.disconnect(); if(frame)cancelAnimationFrame(frame);release();document.removeEventListener('pointermove',pointer);document.removeEventListener('pointerdown',press);document.removeEventListener('pointerup',release);document.removeEventListener('pointercancel',release);document.removeEventListener('keydown',press);document.removeEventListener('keyup',release);window.removeEventListener('blur',release);document.querySelectorAll('.glass').forEach(el => el.style.removeProperty('--glass-optics')); svg.remove(); };
  }, []);
}
