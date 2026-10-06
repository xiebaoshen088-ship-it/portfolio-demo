import { useEffect, useRef } from 'react';

// The offline asset contains the loop seam and interpolated frames. One decoder only.
export default function HeroVideo() {
  const artRef=useRef(null),videoRef=useRef(null);
  useEffect(()=>{
    const art=artRef.current,video=videoRef.current,reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const compact=matchMedia('(max-width:760px)').matches||navigator.connection?.saveData;
    let visible=true,disposed=false,refreshFrame=null;
    // Match decoder work to the display; 60Hz displays do not benefit from decoding 120fps.
    const timings=[];
    function chooseSource(time){
      timings.push(time);
      if(timings.length<18){refreshFrame=requestAnimationFrame(chooseSource);return;}
      const gaps=timings.slice(1).map((t,i)=>t-timings[i]).sort((a,b)=>a-b);
      if(disposed)return;
      const highRefresh=gaps[Math.floor(gaps.length/2)]<11;
      video.src=compact?'/assets/hero-flow-loop-mobile-60fps.mp4':`/assets/hero-flow-loop-${highRefresh?'120':'60'}fps.mp4`;
      video.dataset.targetFps=compact||!highRefresh?'60':'120';reconcile();
    }
    refreshFrame=requestAnimationFrame(chooseSource);
    function reconcile(){
      art.classList.toggle('is-reduced',reduced.matches);
      if(disposed||reduced.matches||!visible||document.hidden||document.body.classList.contains('dialog-open'))video.pause();
      else if(video.getAttribute('src'))video.play().catch(()=>{});
    }
    const ready=()=>art.classList.add('is-ready');video.addEventListener('loadeddata',ready);
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>=.15;reconcile();},{threshold:.15});
    observer.observe(art.closest('.hero'));
    const modal=new MutationObserver(reconcile);modal.observe(document.body,{attributes:true,attributeFilter:['class']});
    reduced.addEventListener('change',reconcile);document.addEventListener('visibilitychange',reconcile);reconcile();
    return()=>{disposed=true;cancelAnimationFrame(refreshFrame);video.pause();observer.disconnect();modal.disconnect();video.removeEventListener('loadeddata',ready);reduced.removeEventListener('change',reconcile);document.removeEventListener('visibilitychange',reconcile);};
  },[]);
  return <div className="hero-art" ref={artRef} aria-hidden="true">
    <img className="hero-poster" src="/assets/hero-flow-loop-poster.jpg" alt="" />
    <video className="hero-video is-active" ref={videoRef} muted loop playsInline preload="auto" poster="/assets/hero-flow-loop-poster.jpg" disablePictureInPicture />
    <div className="video-edges" />
  </div>;
}
