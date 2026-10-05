(() => {
 const video=document.getElementById('hero-video'),toggle=document.getElementById('video-toggle');
 if(!video||!toggle)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let userPaused=false,userRequestedPlayback=false,isVisible=true,failed=false;
 function syncButton(){
  const paused=video.paused;
  toggle.setAttribute('aria-pressed',String(paused));
  toggle.setAttribute('aria-label',paused?'播放背景动画':'暂停背景动画');toggle.title=toggle.getAttribute('aria-label');
 }
 function play(){if(failed)return;video.play().then(syncButton).catch(()=>{syncButton();});}
 function reconcile(){
  if(userPaused||(reduced.matches&&!userRequestedPlayback)||!isVisible||document.hidden)video.pause();else play();
  syncButton();
 }
 video.muted=true;video.autoplay=!reduced.matches;video.src=video.dataset.src;
 video.addEventListener('loadeddata',()=>{video.parentElement.classList.add('is-ready');reconcile();});
 video.addEventListener('play',syncButton);video.addEventListener('pause',syncButton);
 video.addEventListener('error',()=>{failed=true;video.parentElement.classList.add('is-unavailable');toggle.hidden=true;});
 toggle.addEventListener('click',()=>{if(video.paused){userPaused=false;userRequestedPlayback=true;play();}else{userPaused=true;userRequestedPlayback=false;video.pause();}syncButton();});
 reduced.addEventListener('change',()=>{userRequestedPlayback=false;video.autoplay=!reduced.matches;reconcile();});
 document.addEventListener('visibilitychange',reconcile);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{isVisible=entries[0].isIntersecting;reconcile();},{threshold:.04}).observe(document.querySelector('.hero-scene'));
 reconcile();
})();
