import { useEffect, useRef } from 'react';

export default function ScrollJourney({ onActiveChange }) {
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current,header=document.querySelector('.site-header');
    let frame=null,lastActive=null,lastExpanded=null,geometry=[],disposed=false;
    let max=1,height=innerHeight,travel=innerHeight*.5-19;
    function measure(){
      if(disposed)return;
      document.documentElement.classList.toggle('large-type',parseFloat(getComputedStyle(document.documentElement).fontSize)>=24);
      height=innerHeight;max=Math.max(1,document.documentElement.scrollHeight-height);travel=height*.5-19;
      geometry=['experience','projects','strengths','contact'].map(id=>({id,top:document.getElementById(id).getBoundingClientRect().top+scrollY}));schedule();
    }
    function update(){
      frame=null;const y=scrollY,ratio=Math.max(0,Math.min(1,y/max));
      el.style.setProperty('--journey-progress',ratio);el.style.setProperty('--journey-y',`${ratio*travel}px`);el.classList.toggle('is-started',y>height*.35);
      let active='';for(const section of geometry)if(section.top-y<height*.45)active=section.id;
      if(active!==lastActive){lastActive=active;onActiveChange?.(active);}
      const expanded=lastExpanded===false?y<height*.18:y<height*.3;
      if(expanded!==lastExpanded){lastExpanded=expanded;header.dataset.expanded=String(expanded);}
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(update);}
    const resize=new ResizeObserver(measure);resize.observe(document.body);
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);document.fonts.ready.then(measure);measure();
    return()=>{disposed=true;removeEventListener('scroll',schedule);removeEventListener('resize',measure);resize.disconnect();if(frame)cancelAnimationFrame(frame);};
  },[onActiveChange]);
  return <div className="scroll-journey" aria-hidden="true" ref={ref}><span className="journey-track"/><span className="journey-ink"/><span className="journey-lens"/></div>;
}
