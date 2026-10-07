import GlassButton from './GlassButton.jsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { contact, shots } from './data.js';
import { Icon } from './App.jsx';
import EvidenceStack from './EvidenceStack.jsx';
import { GLASS } from './glassConfig.js';
import SegmentedControl from './SegmentedControl.jsx';

function sourceTransform(source, target) {
  return `translate(${source.left - target.left}px, ${source.top - target.top}px) scale(${source.width / target.width}, ${source.height / target.height})`;
}

function Modal({ entry, title, onClose, children, className = '' }) {
  const ref = useRef(null);
  const closing = useRef(false);
  const transition = useRef(null);
  const animationTimer = useRef(null);

  useLayoutEffect(() => {
    const dialog = ref.current;
    const trigger = entry.trigger;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    dialog.showModal();
    document.body.classList.add('dialog-open');
    if (!reduced && entry.rect?.width && entry.rect?.height) {
      const target = dialog.getBoundingClientRect();
      trigger?.classList.add('is-source-hidden');
      dialog.classList.add('is-materializing');
      const animation = dialog.animate([
        { transform: sourceTransform(entry.rect, target), borderRadius: '32px' },
        { transform: 'translate(0,0) scale(1,1)', borderRadius: '28px' },
      ], { duration: GLASS.motion.open, easing: GLASS.motion.easing, fill: 'both' });
      transition.current = animation;
      animationTimer.current = setTimeout(() => dialog.classList.remove('is-materializing'), 110);
      animation.finished.then(() => { animation.cancel(); transition.current = null; }).catch(() => {});
    }
    return () => {
      clearTimeout(animationTimer.current);
      transition.current?.cancel();
      if (dialog.open) dialog.close();
      trigger?.classList.remove('is-source-hidden');
      if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    };
  }, [entry]);

  async function close() {
    if (closing.current) return;
    closing.current = true;
    const dialog = ref.current;
    const current = getComputedStyle(dialog).transform;
    transition.current?.cancel();
    clearTimeout(animationTimer.current);
    dialog.classList.remove('is-materializing');
    const trigger = entry.trigger;
    const source = trigger?.isConnected ? trigger.getBoundingClientRect() : null;
    const target = dialog.getBoundingClientRect();
    dialog.classList.add('is-closing');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && source?.width && source?.height) {
      const animation = dialog.animate([
        { transform: current === 'none' ? 'translate(0,0) scale(1,1)' : current, borderRadius: '28px' },
        { transform: sourceTransform(source, target), borderRadius: getComputedStyle(trigger).borderRadius },
      ], { duration: GLASS.motion.close, easing: GLASS.motion.easing, fill: 'both' });
      transition.current = animation;
      try { await animation.finished; } catch {}
    }
    dialog.close();
    trigger?.classList.remove('is-source-hidden');
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    trigger?.focus({ preventScroll: true });
    onClose();
  }

  return <dialog ref={ref} className={`detail-dialog ${className}`} aria-labelledby={`dialog-${entry.kind}-${entry.id}`} onCancel={e => { e.preventDefault(); close(); }} onClick={e => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) close();
  }}>
    <header className="dialog-header"><h2 id={`dialog-${entry.kind}-${entry.id}`}>{title}</h2><GlassButton as="button" className="icon-button" onClick={close} aria-label="关闭详情" autoFocus><Icon name="close" /></GlassButton></header>
    {children}
  </dialog>;
}

function EvidenceButton({ id, onShot, children }) {
  return <GlassButton as="button" className="button" onClick={e => onShot(id, e.currentTarget)}><Icon name="zoom" />{children || shots[id].title}</GlassButton>;
}

function Metrics({ items }) {
  return <div className={`dialog-metrics${items.length === 4 ? ' four-metrics' : ''}`}>{items.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>;
}

function PlatformEvidence({ onShot }) {
  const [platform, setPlatform] = useState('weibo');
  const red = platform === 'red';
  return <>
    <p className="dialog-lead">账号运营，让内容持续被看见。</p>
    <p>独立运营微博，并参与抖音、小红书、视频号与微信公众号的内容发布、互动和数据观察。</p>
    <SegmentedControl tabs className="platform-tabs" label="选择平台" value={platform} onChange={setPlatform} options={[{value:'weibo',label:'微博'},{value:'red',label:'小红书'}]} />
    <div id="platform-panel" role="tabpanel" aria-labelledby={`tab-${platform}`}>
      <Metrics items={red ? [['30万+','观看量'],['约1500','收藏'],['约400','净涨粉']] : [['570万+','累计阅读'],['600万+','视频播放']]} />
      <button className="dialog-image" onClick={e => onShot(red ? 'views' : 'overview', e.currentTarget)} aria-label={`放大${red ? '小红书' : '微博'}后台截图`}><img src={`/assets/${shots[red ? 'views' : 'overview'].file}`} alt={shots[red ? 'views' : 'overview'].title} /></button>
    </div>
  </>;
}

export function DetailDialog({ entry, onClose, onShot }) {
  const titles = { hot: '热搜传播 · 电视适老化', poll: '内容判断 · 手机系统偏好投票', topics: '持续内容 · 原创话题', bambu: '产品传播 · 拓竹', platforms: '平台运营 · 凰家评测', contact: '联系解宝珅', resume: '解宝珅 · 完整简历' };
  const id = entry.id;
  return <Modal entry={entry} title={titles[id]} onClose={onClose} className={id === 'resume' ? 'resume-dialog' : ''}>
    <div className="dialog-body">
      {id === 'hot' && <>
        <p className="dialog-lead">把内容议题，推进为一次传播。</p>
        <p>以「电视应该为老人做减法吗？」作为热搜词条，把讨论落在长辈的电视使用体验上。</p>
        <Metrics items={[[ '第8位', '热搜科技榜'],['370万+', '话题阅读'],['5500+', '话题互动'],['超15+', '发布媒体']]} />
        <div className="case-process"><div><span>01</span><h3>设计讨论入口</h3><p>从用户熟悉的电视使用问题出发，把议题提炼成明确的热搜词条。</p></div><div><span>02</span><h3>联系 KOL 协同</h3><p>主动联系 KOL 参与传播，围绕同一话题推进讨论。</p></div><div><span>03</span><h3>观察传播结果</h3><p>结合话题数据与榜单快照，观察用户反馈和媒体参与。</p></div></div>
        <div className="dialog-actions"><GlassButton as="a" className="button" href="https://weibo.com/2707058873/RepP90jXb" target="_blank" rel="noreferrer">查看主帖与视频</GlassButton><EvidenceButton id="topic" onShot={onShot}>话题原图</EvidenceButton></div>
      </>}
      {id === 'poll' && <>
        <p className="dialog-lead">一个具体问题，让用户愿意回应。</p><p>围绕手机系统偏好，用投票提供明确的参与入口。内容的阅读、用户作出选择和点赞，分别构成不同的反馈。</p>
        <Metrics items={[[ '5万+', '单条内容阅读'],['2500+', '参与投票'],['2500+', '点赞']]} />
        <button className="dialog-image poll-detail-image" onClick={e => onShot('poll', e.currentTarget)} aria-label="放大投票作品"><img src="/assets/S17-poll.png" alt="手机系统偏好投票完整作品" /></button>
      </>}
      {id === 'topics' && <>
        <p className="dialog-lead">让日常内容，沉淀成账号自己的栏目。</p><p>自主开创4个原创话题，以稳定的栏目组织科技内容，形成可复用的品牌合作场景，助力账号商业化。</p>
        <EvidenceStack onShot={onShot} />
      </>}
      {id === 'bambu' && <>
        <p className="dialog-lead">把耗材安全问题，转化为可观看的实测内容。</p>
        <p>围绕3D打印进入家庭后的使用顾虑，以6款主流纯净PLA耗材的颗粒物排放实测为切入点，把产品话题连接到家长关心的安全问题。</p>
        <Metrics items={[['173万+', '视频观看'],['1100+', '转发'],['90+', '评论'],['1400+', '点赞']]} />
        <div className="case-process bambu-process">
          <div><span>01</span><h3>从使用场景提出问题</h3><p>用孩子的创造力与想象力引出家庭3D打印场景，再聚焦耗材排放这一具体顾虑，让选题贴近用户的选择。</p></div>
          <div><span>02</span><h3>把问题落到实验比较</h3><p>通过6款PLA耗材的颗粒物排放实测组织内容，以比较和验证支撑表达，建立清晰的观看主线。</p></div>
          <div><span>03</span><h3>用封面建立观看入口</h3><p>封面突出「6款」「排放实测」，用耗材实物与检测仪器呈现测试主题，配合正文说明用户为何需要关注。</p></div>
        </div>
        <button className="dialog-image bambu-detail-image" onClick={e => onShot('bambu', e.currentTarget)} aria-label="放大拓竹微博作品截图"><img src="/assets/bambu-weibo.png" alt="6款3D打印耗材排放实测作品及传播数据" /></button>
        <div className="dialog-actions"><GlassButton as="a" className="button" href="https://weibo.com/2707058873/RbYpCAFJm" target="_blank" rel="noreferrer">观看项目视频</GlassButton><EvidenceButton id="bambu" onShot={onShot}>作品原图</EvidenceButton></div>
      </>}
      {id === 'platforms' && <PlatformEvidence onShot={onShot} />}
      {id === 'resume' && <div className="resume-preview"><img src="/assets/resume-page-1.png" alt="解宝珅完整简历，第1页" decoding="async" /><GlassButton as="a" className="button" href="/assets/resume.pdf" download="解宝珅简历.pdf">下载简历</GlassButton></div>}
      {id === 'contact' && <><p className="dialog-lead">聊聊内容，也聊聊机会。</p><a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}</a><div className="dialog-actions"><GlassButton as="a" className="button" href={`mailto:${contact.email}`}>发送邮件</GlassButton></div></>}
    </div>
  </Modal>;
}

export function EvidenceDialog({ entry, onClose }) {
  const [zoom, setZoom] = useState(false);
  const [longImage, setLongImage] = useState(false);
  const shot = shots[entry.id];
  return <Modal entry={entry} title={shot.title} onClose={onClose} className="reader-dialog"><div className="reader-toolbar">{shot.note && <p>{shot.note}</p>}<GlassButton as="button" className="button" aria-pressed={zoom} onClick={() => setZoom(v => !v)}>{zoom ? '适应窗口' : '放大原图'}</GlassButton><a className="text-link" href={`/assets/${shot.file}`} target="_blank" rel="noreferrer">打开原图</a></div><div className={`reader-scroll${zoom ? ' zoomed' : ''}${longImage ? ' long-image' : ''}`}><img src={`/assets/${shot.file}`} alt={`${shot.title}完整证据截图`} onLoad={e => setLongImage(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth > 3.5)} /></div></Modal>;
}
