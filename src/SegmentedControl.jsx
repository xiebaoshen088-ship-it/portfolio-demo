import { useLayoutEffect, useRef, useState } from 'react';
import { GLASS } from './glassConfig.js';
import { GlassMaterial } from './GlassButton.jsx';

export default function SegmentedControl({ options, value, onChange, label, className = '', navigation = false, tabs = false }) {
  const ref = useRef(null);
  const indicator = useRef(null);
  const animation = useRef(null);
  const initialized = useRef(false);
  const lastTarget = useRef('');
  const [preview,setPreview] = useState(null);
  const previewRef = useRef(null), moveRef = useRef(null), dragRef = useRef(null), pointerFrame = useRef(null);
  previewRef.current = preview;
  useLayoutEffect(() => {
    function update(resizing = false, pointerX = null) {
      const selected = ref.current?.querySelector('[data-preview="true"]') || ref.current?.querySelector('[aria-checked="true"], [aria-current="location"], [aria-selected="true"]');
      if (!selected) { indicator.current.style.opacity = '0'; lastTarget.current=''; return; }
      const el = indicator.current;
      const next = { left: selected.offsetLeft, top: selected.offsetTop, width: selected.offsetWidth, height: selected.offsetHeight };
      if(pointerX!==null){
        const bounds=ref.current.getBoundingClientRect();
        next.left=Math.max(4,Math.min(bounds.width-next.width-4,pointerX-bounds.left-next.width/2));
      }
      const signature=JSON.stringify(next);
      if(lastTarget.current===signature)return;
      lastTarget.current=signature;
      const current = getComputedStyle(el);
      const from = { transform: current.transform, width: current.width, height: current.height };
      animation.current?.cancel();
      el.style.opacity = '1';
      el.style.transform = `translate(${next.left}px,${next.top}px)`;
      el.style.width = `${next.width}px`; el.style.height = `${next.height}px`;
      if (!resizing && initialized.current && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
        animation.current = el.animate([from, { transform: el.style.transform, width: el.style.width, height: el.style.height }], { duration: GLASS.motion.switch, easing: GLASS.motion.easing });
      }
      initialized.current = true;
    }
    moveRef.current = update;
    const resize = new ResizeObserver(()=>update(true)); resize.observe(ref.current);
    const mutation = new MutationObserver(()=>update()); mutation.observe(ref.current, { subtree: true, attributes: true, attributeFilter:['aria-current','aria-selected','aria-checked'] });
    const keyboard=()=>{if(ref.current)delete ref.current.dataset.pointerFocus;};
    document.addEventListener('keydown',keyboard);
    update();
    return () => { resize.disconnect(); mutation.disconnect(); animation.current?.cancel();cancelAnimationFrame(pointerFrame.current);document.removeEventListener('keydown',keyboard); };
  }, []);
  useLayoutEffect(()=>{const drag=dragRef.current;moveRef.current?.(!!drag?.dragging,drag?.dragging?drag.clientX:null);},[value,preview]);

  function optionAt(x,y){
    const buttons=[...ref.current.querySelectorAll('a,button')];
    const bounds=ref.current.getBoundingClientRect();
    if(y<bounds.top-25||y>bounds.bottom+25)return null;
    return buttons.reduce((nearest,button)=>{
      const r=button.getBoundingClientRect(),distance=Math.abs(x-(r.left+r.width/2));
      return !nearest||distance<nearest.distance?{button,distance}:nearest;
    },null)?.button;
  }
  function pointerMove(e){
    const {clientX,clientY}=e;
    if(dragRef.current){dragRef.current.clientX=clientX;if(Math.abs(clientX-dragRef.current.startX)>5)dragRef.current.dragging=true;}
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current=requestAnimationFrame(()=>{
      const target=optionAt(clientX,clientY);if(!target)return;
      const next=target.dataset.value;previewRef.current=next;setPreview(next);
      if(dragRef.current?.dragging){
        ref.current.dataset.dragging='true';
        moveRef.current?.(true,clientX);
      }
    });
  }
  function pointerDown(e){
    if(e.button!==0||!e.target.closest('a,button'))return;
    e.preventDefault();
    dragRef.current={id:e.pointerId,startX:e.clientX,dragging:false};
    ref.current.setPointerCapture(e.pointerId);ref.current.dataset.lensPressed='true';ref.current.dataset.pointerFocus='true';
    const target=e.target.closest('a,button');target.focus({preventScroll:true});setPreview(target.dataset.value);
  }
  function finishPointer(e,cancelled=false){
    if(!dragRef.current||dragRef.current.id!==e.pointerId)return;
    cancelAnimationFrame(pointerFrame.current);
    const target=cancelled?null:optionAt(e.clientX,e.clientY);
    dragRef.current=null;delete ref.current.dataset.lensPressed;delete ref.current.dataset.dragging;
    if(ref.current.hasPointerCapture(e.pointerId))ref.current.releasePointerCapture(e.pointerId);
    if(target){setPreview(target.dataset.value);target.focus({preventScroll:true});target.click();}
    else setPreview(null);
    moveRef.current?.();
  }

  function keyDown(e, index) {
    setPreview(null);
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % options.length;
    else if (e.key === 'ArrowLeft') next = (index + options.length - 1) % options.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = options.length - 1;
    else return;
    e.preventDefault(); if(navigation)setPreview(options[next].value);else onChange?.(options[next].value);
    ref.current.querySelectorAll('button,a')[next]?.focus();
  }
  return <div className={`segmented glass dock-control ${className}`} ref={ref} role={navigation ? undefined : tabs ? 'tablist' : 'radiogroup'} aria-label={label} onPointerMove={pointerMove} onPointerDown={pointerDown} onPointerUp={e=>finishPointer(e)} onPointerCancel={e=>finishPointer(e,true)} onLostPointerCapture={e=>finishPointer(e,true)} onPointerLeave={()=>{if(!dragRef.current)setPreview(null);}}>
    <span className="segment-indicator" ref={indicator} aria-hidden="true"><GlassMaterial variant="navigation" className="dock-lens-material" /></span>
    {options.map((option, i) => navigation
      ? <a key={option.value} data-value={option.value} data-preview={preview===option.value?'true':undefined} href={`#${option.value}`} aria-current={value === option.value ? 'location' : undefined} onClick={() => onChange?.(option.value)} onKeyDown={e=>keyDown(e,i)}><span className="dock-label">{option.label}</span></a>
      : <button key={option.value} data-value={option.value} data-preview={preview===option.value?'true':undefined} role={tabs ? 'tab' : 'radio'} id={tabs ? `tab-${option.value}` : undefined} aria-controls={tabs ? 'platform-panel' : undefined} aria-selected={tabs ? value === option.value : undefined} aria-checked={tabs ? undefined : value === option.value} tabIndex={value === option.value ? 0 : -1} onClick={() => onChange(option.value)} onKeyDown={e=>keyDown(e,i)}><span className="dock-label">{option.label}</span></button>)}
  </div>;
}
