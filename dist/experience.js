(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const gallery=document.getElementById('platform-gallery');
 const cards=[...gallery.querySelectorAll('[data-gallery-platform]')];
 const tabs=[...document.querySelectorAll('[data-platform]')];
 let active=0,ignoreClickBefore=0;
 const names=['微博','小红书','抖音','视频号','公众号'];
 function arrange(index){
  active=index;
  cards.forEach((card,i)=>{
   let offset=i-index;if(offset>2)offset-=5;if(offset< -2)offset+=5;
   card.style.setProperty('--offset',offset);card.style.setProperty('--distance',Math.abs(offset));
   card.classList.toggle('is-selected',i===index);card.setAttribute('aria-pressed',String(i===index));
   card.tabIndex=i===index?0:-1;
   card.setAttribute('aria-label',i===index&&card.dataset.evidence?'查看'+names[i]+'原图':'选择'+names[i]+'材料');
  });
  document.querySelector('.gallery-counter').textContent=String(index+1).padStart(2,'0')+' / 05';
 }
 arrange(0);
 document.addEventListener('platformchange',e=>arrange(e.detail.index));
 gallery.addEventListener('click',e=>{
  if(performance.now()<ignoreClickBefore){e.preventDefault();e.stopPropagation();return;}
  const card=e.target.closest('[data-gallery-platform]');if(!card)return;
  const index=cards.indexOf(card);
  if(index!==active){e.preventDefault();e.stopPropagation();tabs[index].click();}
 });
 // Native vertical scrolling remains available while a horizontal gesture changes platforms.
 let start;
 gallery.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY};},{passive:true});
 gallery.addEventListener('pointerup',e=>{
  if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=undefined;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4){ignoreClickBefore=performance.now()+450;tabs[(active+(dx<0?1:4))%5].click();}
 },{passive:true});
 gallery.addEventListener('pointercancel',()=>{start=undefined;},{passive:true});
 const scene=document.querySelector('.hero-scene'),spread=document.querySelector('.spread-field'),strip=document.querySelector('.motion-strip');
 let queued=false;
 const clamp=n=>Math.max(0,Math.min(1,n));
 function render(){
  const total=document.documentElement.scrollHeight-innerHeight;
  document.documentElement.style.setProperty('--reading-progress',total>0?clamp(scrollY/total):0);
  const animated=!reduced.matches&&!document.body.classList.contains('large-type');
  const desktop=innerWidth>760;
  const heroProgress=animated&&desktop?clamp(-scene.getBoundingClientRect().top/240):0;
  scene.style.setProperty('--hero-progress',heroProgress);
  const rect=spread.getBoundingClientRect();
  spread.style.setProperty('--spread-progress',animated?clamp((innerHeight*.9-rect.top)/(innerHeight*.65)):1);
  const sr=strip.getBoundingClientRect();strip.style.setProperty('--strip-shift',animated?Math.max(-65,Math.min(65,(innerHeight*.5-sr.top)*.07)):0);
  queued=false;
 }
 function requestRender(){if(!queued){queued=true;requestAnimationFrame(render);}}
 addEventListener('scroll',requestRender,{passive:true});addEventListener('resize',requestRender);reduced.addEventListener('change',requestRender);
 if('ResizeObserver' in window)new ResizeObserver(requestRender).observe(document.body);
 render();
})();
