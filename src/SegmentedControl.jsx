import { useLayoutEffect, useRef } from 'react';
import { GLASS } from './glassConfig.js';

export default function SegmentedControl({ options, value, onChange, label, className = '', navigation = false, tabs = false }) {
  const ref = useRef(null);
  const indicator = useRef(null);
  const animation = useRef(null);
  const initialized = useRef(false);
  const lastTarget = useRef('');
  useLayoutEffect(() => {
    function update() {
      const selected = ref.current?.querySelector('[aria-checked="true"], [aria-current="location"], [aria-selected="true"]');
      if (!selected) { indicator.current.style.opacity = '0'; lastTarget.current=''; return; }
      const el = indicator.current;
      const box = selected.getBoundingClientRect(), parent = ref.current.getBoundingClientRect();
      const next = { left: box.left - parent.left, top: box.top - parent.top, width: box.width, height: box.height };
      const signature=JSON.stringify(next);
      if(lastTarget.current===signature)return;
      lastTarget.current=signature;
      const current = getComputedStyle(el);
      const from = { transform: current.transform, width: current.width, height: current.height };
      animation.current?.cancel();
      el.style.opacity = '1';
      el.style.transform = `translate(${next.left}px,${next.top}px)`;
      el.style.width = `${next.width}px`; el.style.height = `${next.height}px`;
      if (initialized.current && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
        animation.current = el.animate([from, { transform: el.style.transform, width: el.style.width, height: el.style.height }], { duration: GLASS.motion.switch, easing: GLASS.motion.easing });
      }
      initialized.current = true;
    }
    const resize = new ResizeObserver(update); resize.observe(ref.current);
    const mutation = new MutationObserver(update); mutation.observe(ref.current, { subtree: true, attributes: true, attributeFilter:['aria-current'] });
    update();
    return () => { resize.disconnect(); mutation.disconnect(); animation.current?.cancel(); };
  }, [value]);

  function keyDown(e, index) {
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % options.length;
    else if (e.key === 'ArrowLeft') next = (index + options.length - 1) % options.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = options.length - 1;
    else return;
    e.preventDefault(); onChange?.(options[next].value);
    ref.current.querySelectorAll('button,a')[next]?.focus();
  }
  return <div className={`segmented glass ${className}`} ref={ref} role={navigation ? undefined : tabs ? 'tablist' : 'radiogroup'} aria-label={label}>
    <span className="segment-indicator glass" ref={indicator} aria-hidden="true" />
    {options.map((option, i) => navigation
      ? <a key={option.value} href={`#${option.value}`} aria-current={value === option.value ? 'location' : undefined} onClick={() => onChange?.(option.value)} onKeyDown={e=>keyDown(e,i)}>{option.label}</a>
      : <button key={option.value} role={tabs ? 'tab' : 'radio'} id={tabs ? `tab-${option.value}` : undefined} aria-controls={tabs ? 'platform-panel' : undefined} aria-selected={tabs ? value === option.value : undefined} aria-checked={tabs ? undefined : value === option.value} tabIndex={value === option.value ? 0 : -1} onClick={() => onChange(option.value)} onKeyDown={e=>keyDown(e,i)}>{option.label}</button>)}
  </div>;
}
