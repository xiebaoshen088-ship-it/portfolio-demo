import { useEffect, useRef } from 'react';

// Original first-published animation assets, restored byte-for-byte from 7e9d426.
export default function HeroVideo() {
  const artRef=useRef(null),videoRef=useRef(null);
  useEffect(()=>{
    const art=artRef.current,video=videoRef.current,reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const compact=matchMedia('(max-width:760px)').matches||navigator.connection?.saveData;
    let visible=true,disposed=false;
    // Preserve the first version's native playback and timing.
    video.src=compact?'/assets/hero-flow-loop-mobile-60fps.mp4':'/assets/hero-flow-loop-60fps.mp4';
    video.dataset.targetFps='60';
    video.playbackRate=1;
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
    return()=>{disposed=true;video.pause();observer.disconnect();modal.disconnect();video.removeEventListener('loadeddata',ready);reduced.removeEventListener('change',reconcile);document.removeEventListener('visibilitychange',reconcile);};
  },[]);
  return <div className="hero-art" ref={artRef} data-animation-version="original" aria-hidden="true">
    <img className="hero-poster" src="/assets/hero-flow-loop-poster.jpg" alt="" />
    <video className="hero-video is-active" ref={videoRef} muted loop playsInline preload="auto" poster="/assets/hero-flow-loop-poster.jpg" disablePictureInPicture />
    <div className="video-edges" />
  </div>;
}
