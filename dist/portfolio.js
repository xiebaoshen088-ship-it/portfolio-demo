(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
  const shots = {
    poll: { src:'S17-poll.png', title:'手机系统偏好投票', note:'微博单条内容。发布于2026年7月，统计截止未说明。阅读、投票与点赞分别展示。' },
    overview: { src:'S23-overview.png', title:'凰家评测 · 微博后台', note:'近30日账号整体数据。累计阅读与视频播放分别展示，完整统计起止未说明。' },
    topic: { src:'S31-topic.jpg', title:'电视适老化 · 话题记录', note:'话题页「全部」口径，截图时间未说明。榜单排名字段的口径差异仍需核对。' },
    rank: { src:'S30-rank.jpg', title:'电视适老化 · 科技榜记录', note:'科技榜最高第8位。与话题页是不同快照，拍摄时间均未说明，不相加，也不推算增长。' },
    views: { src:'S11-views.png', title:'小红书 · 观看反馈', note:'7月20日至8月18日，年份未说明。环比来自后台原值，前期基数未显示；包含付费投流。' },
    interactions: { src:'S13-interactions.png', title:'小红书 · 互动反馈', note:'与观看数据为同一周期。收藏环比来自后台原值；自然流量与付费效果尚未拆分。' },
    followers: { src:'S14-followers.png', title:'小红书 · 关注反馈', note:'同一周期。后台净涨粉与新增减取消的差额不一致，保留原图，关注口径待核。' },
    column6: { src:'S06-column.png', title:'小凰鸡聊科技', note:'话题页累计口径，统计起止与截止未说明。' },
    column5: { src:'S05-column.png', title:'小凰鸡深夜Deep talk', note:'话题页累计口径，统计起止与截止未说明。' },
    column7: { src:'S07-column.png', title:'小凰鸡闲聊站', note:'话题页累计口径，统计起止与截止未说明。' }
  };
  const evidenceButton = (key, text) => `<button class="glass button" data-shot="${key}">${text}${arrow}</button>`;
  const cases = {
    poll: { title:'内容判断 · 手机系统偏好投票', html:`<p class="dialog-lead">把一个具体问题，交给用户回应。</p><p>围绕手机系统偏好，以投票形式组织用户参与。作品提供了阅读、投票与点赞三种反馈。</p><div class="dialog-facts"><span>阅读 5万+</span><span>约3000人投票</span><span>点赞 2500+</span></div><div class="case-split"><div class="case-step"><h3>内容切口</h3><p>从用户熟悉的使用偏好出发，让讨论有明确的参与入口。</p></div><div class="case-step"><h3>观察反馈</h3><p>将内容被看到、用户作出选择与用户表达认同分别观察，不把不同反馈相加。</p></div></div><div class="case-figure"><img src="assets/S17-poll.png" alt="手机系统偏好投票原图"></div><div class="dialog-actions">${evidenceButton('poll','查看完整作品')}</div><p class="dialog-note">以上为作品内容与结果观察；具体策划过程可结合工作记录继续补充。</p>` },
    hot: { title:'热搜传播 · 电视适老化话题', html:`<p class="dialog-lead">把内容议题，推进为一次传播。</p><p>围绕「电视应该为老人做减法吗？」展开传播。我负责热搜词条设计、联系 KOL 协同传播，以及话题运营。</p><div class="dialog-facts"><span>话题阅读 370万+</span><span>互动 约6000次</span><span>15家媒体参与</span></div><div class="case-split"><div class="case-step"><h3>词条设计</h3><p>设计「电视应该为老人做减法吗？」作为热搜词条，把议题落在长辈的电视使用体验上。</p></div><div class="case-step"><h3>协同传播</h3><p>主动联系 KOL 参与协同传播，围绕同一话题推进内容扩散。具体对接数量与时间以协同记录为准。</p></div><div class="case-step"><h3>个人分工</h3><p>我的职责集中在运营与传播推进。成品视频用于呈现传播对象，视频内容制作不计入个人职责。</p></div><div class="case-step"><h3>结果观察</h3><p>话题页记录了用户讨论与媒体参与；另一张快照记录了科技榜最高第8位。话题整体结果与个人职责分别呈现。</p></div></div><div class="dialog-actions"><a class="glass button" href="https://weibo.com/2707058873/RepP90jXb" target="_blank" rel="noopener noreferrer">查看主帖与视频${arrow}</a>${evidenceButton('topic','话题完整记录')}${evidenceButton('rank','科技榜记录')}</div><p class="dialog-note">传播连线表示证据关系，完整时序与协同细节仍需结合过程记录补充。KOL对接人数与截图中的发布媒体数分开统计。</p>` },
    topics: { title:'持续内容 · 原创话题', html:`<p class="dialog-lead">让日常内容，拥有持续表达的场景。</p><p>实习期间主动搭建5个原创话题。通过稳定的栏目名称组织内容，形成账号可持续经营的表达方式。</p><div class="column-list"><div class="column-item"><button data-shot="column6"><img src="assets/S06-column.png" alt="小凰鸡聊科技话题"><h3>小凰鸡聊科技</h3><p>话题阅读 130万+</p></button></div><div class="column-item"><button data-shot="column5"><img src="assets/S05-column.png" alt="小凰鸡深夜Deep talk话题"><h3>小凰鸡深夜Deep talk</h3><p>话题阅读 36万+</p></button></div><div class="column-item"><button data-shot="column7"><img src="assets/S07-column.png" alt="小凰鸡闲聊站话题"><h3>小凰鸡闲聊站</h3><p>话题阅读 约100万</p></button></div></div><p class="dialog-note">这里展示已有原图的栏目。小凰鸡数码讲堂的完整记录及第5个话题的名称和材料尚待补齐；话题累计阅读与账号周期数据分开展示。</p>` },
    bambu: { title:'产品内容 · 拓竹', html:`<p class="dialog-lead">从产品，走向用户关心的内容。</p><div class="bambu-identity"><strong>BAMBU LAB</strong><p>产品理解 → 用户问题 → 内容表达</p></div><p>拓竹产品传播项目。先查看传播成品，再结合选题、表达与发布过程展开项目讨论。</p><div class="dialog-actions"><a class="glass button" href="https://weibo.com/2707058873/RbYpCAFJm" target="_blank" rel="noopener noreferrer">观看项目成品${arrow}</a></div><p class="dialog-note">完整策划过程、具体个人分工与效果证据将结合项目材料补充；当前不添加未经核实的成果数据。</p>` },
    review: { title:'数据复盘 · 小红书', html:`<p class="dialog-lead">观看增长之后，继续看互动与关注。</p><p>同一周期，观看上升，收藏与净涨粉下降。把不同方向的反馈放在一起，继续核对内容表现与流量来源。</p><div class="dialog-facts"><span>观看 30万+</span><span>收藏 约1500</span><span>净涨粉 约400</span></div><div class="case-split"><div class="case-step"><h3>先看可见变化</h3><p>后台标注观看环比上升18%，收藏下降43%，净涨粉下降25%。这是后台原值，前一周期基数未显示。</p></div><div class="case-step"><h3>再拆流量来源</h3><p>这组数据包含付费投流，需要结合投流金额、目标与作品分布拆分自然和付费表现。</p></div><div class="case-step"><h3>核对统计口径</h3><p>关注页中，新增减取消与后台净涨粉不一致。保留原始记录，避免自行改写数值。</p></div><div class="case-step"><h3>带着问题继续运营</h3><p>把作品、用户反馈与后续调整放在同一份复盘里；具体调整记录和可比结果仍需进一步补充。</p></div></div><div class="dialog-actions">${evidenceButton('views','观看记录')}${evidenceButton('interactions','互动记录')}${evidenceButton('followers','关注记录')}</div><p class="dialog-note">统计范围为7月20日至8月18日，年份未说明。页面以概数展示，完整后台原值可在截图中查看。</p>` },
    resume: { title:'解宝珅 · 个人简历', compact:true, html:`<p class="dialog-lead">判断内容，也经营反馈。</p><div class="resume-summary">凤凰网 · 凰家评测<br>科技数码方向运营实习<br><br>大连艺术学院 · 播音与主持艺术</div><div class="dialog-actions"><a class="glass button" href="assets/resume.pdf" target="_blank" rel="noopener noreferrer">查看完整简历${arrow}</a><a class="glass button" href="assets/resume.pdf" download="解宝珅简历.pdf">下载简历${arrow}</a></div>` },
    contact: { title:'联系解宝珅', compact:true, html:`<p class="dialog-lead">聊聊内容，也聊聊机会。</p><div class="contact-address">2535362675@qq.com</div><div class="dialog-actions"><a class="glass button" href="mailto:2535362675@qq.com">发送邮件${arrow}</a><button class="glass button" data-copy-email>复制邮箱${arrow}</button></div><p class="email-feedback" aria-live="polite"></p>` }
  };

  const detail = document.getElementById('case-dialog');
  const reader = document.getElementById('reader-dialog');
  const windows = new WeakMap();
  function nativeRect(dialog) {
    const previous = dialog.style.transform;
    dialog.style.transform = 'none';
    const rect = dialog.getBoundingClientRect();
    dialog.style.transform = previous;
    return rect;
  }
  function sourceTransform(source, target) {
    return `translate(${source.left-target.left}px,${source.top-target.top}px) scale(${source.width/target.width},${source.height/target.height})`;
  }
  function openWindow(dialog, trigger) {
    if (dialog.open) return;
    const source = trigger?.getBoundingClientRect();
    dialog.classList.remove('is-closing');
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
    const state = { trigger, animation:null, closing:false };
    windows.set(dialog, state);
    if (!reduced.matches && source && source.width>0 && source.height>0) {
      const target = nativeRect(dialog);
      trigger.classList.add('is-source-hidden');
      dialog.classList.add('is-materializing');
      state.animation = dialog.animate([
        {transform:sourceTransform(source,target),borderRadius:'99px'},
        {transform:'translate(0,0) scale(1,1)',borderRadius:getComputedStyle(dialog).borderRadius}
      ], {duration:620,easing:'cubic-bezier(.2,.85,.2,1)',fill:'both'});
      setTimeout(() => { if (dialog.open && !state.closing) dialog.classList.remove('is-materializing'); },130);
      state.animation.finished.then(() => {state.animation=null;dialog.getAnimations().forEach(a=>a.cancel());dialog.style.transform='';dialog.classList.remove('is-materializing');}).catch(()=>{});
    }
  }
  async function closeWindow(dialog) {
    if (!dialog.open) return;
    const state=windows.get(dialog);
    if (state?.closing) return;
    if (state) state.closing=true;
    const current=getComputedStyle(dialog).transform;
    state?.animation?.cancel();
    dialog.classList.remove('is-materializing');
    const target=nativeRect(dialog);
    const source=state?.trigger?.isConnected?state.trigger.getBoundingClientRect():null;
    dialog.classList.add('is-closing');
    if (!reduced.matches && source && source.width>0 && source.height>0) {
      const animation=dialog.animate([
        {transform:current==='none'?'translate(0,0) scale(1,1)':current,borderRadius:getComputedStyle(dialog).borderRadius},
        {transform:sourceTransform(source,target),borderRadius:'99px'}
      ],{duration:420,easing:'cubic-bezier(.45,0,.22,1)',fill:'both'});
      try { await animation.finished; } catch {}
      dialog.close(); animation.cancel();
    } else dialog.close();
    dialog.classList.remove('is-closing');dialog.style.transform='';
    state?.trigger?.classList.remove('is-source-hidden');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    state?.trigger?.focus({preventScroll:true});
  }
  function showCase(key, trigger) {
    const item=cases[key];if(!item)return;
    detail.classList.toggle('compact-dialog',!!item.compact);
    document.getElementById('case-title').textContent=item.title;
    document.getElementById('case-body').innerHTML=item.html;
    openWindow(detail,trigger);
  }
  function showShot(key,trigger) {
    const item=shots[key];if(!item)return;
    document.getElementById('reader-title').textContent=item.title;
    document.getElementById('reader-note').textContent=item.note;
    const image=document.getElementById('reader-image');image.src='assets/'+item.src;image.alt=item.title;
    const viewport=reader.querySelector('.image-scroll');viewport.classList.remove('zoomed');viewport.scrollTop=0;
    const zoom=document.getElementById('reader-zoom');zoom.textContent='放大';zoom.setAttribute('aria-pressed','false');
    openWindow(reader,trigger);
  }
  document.addEventListener('click',async e=>{
    const closer=e.target.closest('[data-dismiss]');if(closer){closeWindow(closer.closest('dialog'));return;}
    const shot=e.target.closest('[data-shot]');if(shot){showShot(shot.dataset.shot,shot);return;}
    const trigger=e.target.closest('[data-case]');if(trigger){showCase(trigger.dataset.case,trigger);return;}
    const copy=e.target.closest('[data-copy-email]');if(copy){const feedback=detail.querySelector('.email-feedback');try{await navigator.clipboard.writeText('2535362675@qq.com');feedback.textContent='邮箱已复制';}catch{feedback.textContent='请选中上方邮箱地址复制';}}
  });
  [detail,reader].forEach(dialog=>{
    dialog.addEventListener('cancel',e=>{e.preventDefault();closeWindow(dialog);});
    dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeWindow(dialog);});
    dialog.addEventListener('close',()=>{const state=windows.get(dialog);state?.trigger?.classList.remove('is-source-hidden');if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');});
  });
  document.getElementById('reader-zoom').addEventListener('click',e=>{const active=reader.querySelector('.image-scroll').classList.toggle('zoomed');e.currentTarget.textContent=active?'适应宽度':'放大';e.currentTarget.setAttribute('aria-pressed',String(active));});

  function moveSelection(container,item) {
    const indicator=container.querySelector('.selection');if(!indicator||!item)return;
    indicator.style.width=item.offsetWidth+'px';indicator.style.transform=`translateX(${item.offsetLeft}px)`;
  }
  const picker=document.querySelector('.platform-picker');
  const tabs=[...picker.querySelectorAll('[data-platform]')];
  function selectPlatform(index,focus=false) {
    tabs.forEach((tab,i)=>{const selected=i===index;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;const panel=document.getElementById(tab.getAttribute('aria-controls'));panel.hidden=!selected;if(selected&&!reduced.matches){panel.querySelectorAll('.platform-copy,.platform-exhibit').forEach(el=>el.animate([{opacity:.35,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:430,easing:'cubic-bezier(.2,.75,.25,1)'}));}});
    moveSelection(picker,tabs[index]);if(focus)tabs[index].focus();requestLayout();
  }
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectPlatform(index));tab.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();selectPlatform(next,true);});});
  moveSelection(picker,tabs[0]);
  const navigation=document.querySelector('.navigation');
  const navLinks=[...navigation.querySelectorAll('a')];
  function updateNavigation() {
    let active=navLinks[0];navLinks.forEach(link=>{const section=document.querySelector(link.hash);if(section?.getBoundingClientRect().top<innerHeight*.42)active=link;});
    navLinks.forEach(link=>{const selected=link===active;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    moveSelection(navigation,active);
  }
  document.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType==='touch')return;const el=e.target.closest('.glass');if(!el)return;const r=el.getBoundingClientRect();el.style.setProperty('--gx',((e.clientX-r.left)/r.width*100)+'%');el.style.setProperty('--gy',((e.clientY-r.top)/r.height*100)+'%');},{passive:true});

  if('IntersectionObserver' in window){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
  const probe=document.createElement('span');probe.style.cssText='position:fixed;visibility:hidden;width:1rem;height:1rem;pointer-events:none';probe.setAttribute('aria-hidden','true');document.body.append(probe);
  if('ResizeObserver' in window)new ResizeObserver(()=>{document.body.classList.toggle('large-type',probe.getBoundingClientRect().width>24);requestLayout();}).observe(probe);

  const layer=document.getElementById('journey-layer');
  const svg=document.getElementById('journey-svg');
  const route=document.getElementById('journey-base');
  const ink=document.getElementById('journey-ink');
  const lens=document.getElementById('journey-cursor');
  const spread=document.querySelector('.spread-field');
  let routeLength=0,points=[],queued=false,layoutQueued=false;
  function measureRoute() {
    const height=Math.ceil(document.querySelector('main').getBoundingClientRect().bottom+scrollY);
    layer.style.height=height+'px';svg.setAttribute('viewBox',`0 0 ${layer.clientWidth} ${height}`);
    points=[...document.querySelectorAll('[data-waypoint]')].map(el=>{const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+scrollY+r.height/2};});
    let d=`M ${points[0].x} ${points[0].y}`;
    for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],distance=b.y-a.y;d+=` C ${a.x} ${a.y+distance*.48},${b.x} ${b.y-distance*.48},${b.x} ${b.y}`;}
    route.setAttribute('d',d);ink.setAttribute('d',d);routeLength=route.getTotalLength();layer.style.setProperty('--route-length',routeLength);lens.classList.add('is-ready');
  }
  function render() {
    updateNavigation();
    const rect=spread.getBoundingClientRect();const progress=reduced.matches?1:Math.max(0,Math.min(1,(innerHeight*.87-rect.top)/(innerHeight*.65)));spread.style.setProperty('--spread-progress',progress);
    if(points.length && routeLength){
      const targetY=Math.max(points[0].y,Math.min(points.at(-1).y,scrollY+innerHeight*.7));
      let low=0,high=routeLength;for(let i=0;i<13;i++){const middle=(low+high)/2;if(route.getPointAtLength(middle).y<targetY)low=middle;else high=middle;}
      const distance=(low+high)/2,p=route.getPointAtLength(distance),size=lens.offsetWidth;
      lens.style.transform=`translate3d(${p.x-size/2}px,${p.y-size/2}px,0)`;layer.style.setProperty('--route-rest',routeLength-distance);
    }
    queued=false;
  }
  function requestRender(){if(!queued){queued=true;requestAnimationFrame(render);}}
  function requestLayout(){if(layoutQueued)return;layoutQueued=true;requestAnimationFrame(()=>{measureRoute();updateNavigation();moveSelection(picker,picker.querySelector('[aria-selected=true]'));layoutQueued=false;requestRender();});}
  addEventListener('scroll',requestRender,{passive:true});addEventListener('resize',requestLayout);reduced.addEventListener('change',requestLayout);
  if('ResizeObserver' in window)new ResizeObserver(requestLayout).observe(document.querySelector('main'));
  document.fonts.ready.then(requestLayout);requestLayout();
})();
