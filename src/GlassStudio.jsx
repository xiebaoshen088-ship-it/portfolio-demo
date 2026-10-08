import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SegmentedControl from './SegmentedControl.jsx';
import OpticalScene from './OpticalScene.jsx';
import { GLASS } from './glassConfig.js';
import Icon from './Icon.jsx';

export default function GlassStudio({ open, onClose, triggerRef, settings, onSettings }) {
  const ref=useRef(null), animation=useRef(null), generation=useRef(0), initialized=useRef(false);
  const [background,setBackground]=useState('image');
  const [visible,setVisible]=useState(false);
  useLayoutEffect(()=>{
    if(open)setVisible(true);
  },[open]);
  useLayoutEffect(()=>{
    if(!visible)return;
    const panel=ref.current, trigger=triggerRef.current;
    const token=++generation.current;
    const current=getComputedStyle(panel), from={transform:current.transform,opacity:current.opacity,borderRadius:current.borderRadius,backgroundColor:current.backgroundColor,boxShadow:current.boxShadow};
    animation.current?.cancel();
    panel.style.transform='none';
    const rect=panel.getBoundingClientRect(), source=trigger.getBoundingClientRect();
    const targetStyle=getComputedStyle(panel), sourceStyle=getComputedStyle(trigger);
    // Keep reading blur constant: interpolating a large blur rasterizes every frame.
    const sourceMaterial={backgroundColor:sourceStyle.backgroundColor,boxShadow:sourceStyle.boxShadow};
    const targetMaterial={backgroundColor:targetStyle.backgroundColor,boxShadow:targetStyle.boxShadow};
    const folded=`translate(${source.left-rect.left}px,${source.top-rect.top}px) scale(${source.width/rect.width},${source.height/rect.height})`;
    const start=initialized.current?from:{transform:folded,opacity:0,borderRadius:'30px',...sourceMaterial};
    const end=open?{transform:'translate(0,0) scale(1,1)',opacity:1,borderRadius:'28px',...targetMaterial}:{transform:folded,opacity:0,borderRadius:'30px',...sourceMaterial};
    initialized.current=true;
    if(matchMedia('(prefers-reduced-motion:reduce)').matches){
      if(!open){setVisible(false);initialized.current=false;trigger.focus({preventScroll:true});}
      else if(document.activeElement===trigger)panel.querySelector('[role="radio"][aria-checked="true"]')?.focus({preventScroll:true});
      return;
    }
    const a=panel.animate([start,end],{duration:open?GLASS.motion.open:GLASS.motion.close,easing:GLASS.motion.easing,fill:'both'});animation.current=a;
    a.finished.then(()=>{
      if(token!==generation.current)return;
      if(!open){setVisible(false);initialized.current=false;trigger.focus({preventScroll:true});}
      else {a.cancel();animation.current=null;if(document.activeElement===trigger)panel.querySelector('[role="radio"][aria-checked="true"]')?.focus({preventScroll:true});}
    }).catch(()=>{});
  },[open,visible,triggerRef]);
  useEffect(()=>{
    if(!open)return;
    const key=e=>{if(e.key==='Escape'){e.preventDefault();onClose();}};
    const outside=e=>{if(!ref.current?.contains(e.target)&&!triggerRef.current?.contains(e.target))onClose();};
    document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside);};
  },[open,onClose,triggerRef]);
  useEffect(()=>()=>{generation.current++;animation.current?.cancel();},[]);
  if(!visible)return null;
  const change=(key,value)=>onSettings(previous=>({...previous,[key]:value}));
  return <aside className="studio-panel glass" ref={ref} role="dialog" aria-modal="false" aria-labelledby="studio-title">
    <div className="studio-header"><h2 id="studio-title">浏览外观</h2><button className="icon-button glass" onClick={onClose} aria-label="关闭外观面板"><Icon name="close" /></button></div>
    <div className="studio-options">
      <div><span className="setting-label">材质</span><SegmentedControl label="玻璃材质" value={settings.material} onChange={v=>change('material',v)} options={[{value:'clear',label:'清透'},{value:'soft',label:'柔和'}]} /></div>
      <div><span className="setting-label">配色</span><SegmentedControl label="配色模式" value={settings.theme} onChange={v=>change('theme',v)} options={[{value:'light',label:'浅色'},{value:'dark',label:'深色'}]} /></div>
    </div>
    <div className="glass-slider"><div className="slider-heading"><label htmlFor="transmission">透光程度</label><output htmlFor="transmission">{settings.transmission}%</output></div><input id="transmission" aria-label="透光程度" type="range" min="10" max="100" step="1" value={settings.transmission} onChange={e=>change('transmission',Number(e.target.value))} style={{'--range-progress':`${(settings.transmission-10)/90*100}%`}} /></div>
    <OpticalScene theme={settings.theme} material={settings.material} transmission={settings.transmission} background={background} />
    <div className="studio-background"><span className="setting-label">背景</span><SegmentedControl label="玻璃背景" value={background} onChange={setBackground} options={[{value:'image',label:'影像'},{value:'blocks',label:'色块'},{value:'detail',label:'后台截图'}]} /></div>
  </aside>;
}
