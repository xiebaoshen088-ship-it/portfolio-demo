import GlassButton from './GlassButton.jsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { contact, columns, shots } from './data.js';
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
  return <div className="dialog-metrics">{items.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>;
}

function PlatformEvidence({ onShot }) {
  const [platform, setPlatform] = useState('weibo');
  const red = platform === 'red';
  return <>
    <p className="dialog-lead">账号运营，让内容持续被看见。</p>
    <p>我在凰家评测独立运营微博，并参与抖音、小红书、视频号与微信公众号的内容发布、互动和数据观察。</p>
    <SegmentedControl tabs className="platform-tabs" label="选择平台" value={platform} onChange={setPlatform} options={[{value:'weibo',label:'微博'},{value:'red',label:'小红书'}]} />
    <div id="platform-panel" role="tabpanel" aria-labelledby={`tab-${platform}`}>
      <Metrics items={red ? [['30万+','观看量'],['约1500','收藏'],['约400','净涨粉']] : [['570万+','累计阅读'],['600万+','视频播放']]} />
      <p className="evidence-note">{red ? '7月20日—8月18日，年份未说明。包含付费投流，当前尚未拆分自然流量与付费效果。' : '微博近30日账号整体数据，完整统计起止未说明。阅读量和播放量为不同指标。'}</p>
      <button className="dialog-image" onClick={e => onShot(red ? 'views' : 'overview', e.currentTarget)} aria-label={`放大${red ? '小红书' : '微博'}后台截图`}><img src={`/assets/${shots[red ? 'views' : 'overview'].file}`} alt={shots[red ? 'views' : 'overview'].title} /></button>
    </div>
  </>;
}

export function DetailDialog({ entry, onClose, onShot }) {
  const titles = { hot: '热搜传播 · 电视适老化', poll: '内容判断 · 手机系统偏好投票', topics: '持续内容 · 原创话题', bambu: '产品传播 · 拓竹', platforms: '平台运营 · 凰家评测', review: '数据复盘 · 小红书', resume: '解宝珅 · 个人简历', contact: '联系解宝珅' };
  const id = entry.id;
  return <Modal entry={entry} title={titles[id]} onClose={onClose}>
    <div className="dialog-body">
      {id === 'hot' && <>
        <p className="dialog-lead">把内容议题，推进为一次传播。</p>
        <p>以「电视应该为老人做减法吗？」作为热搜词条，把讨论落在长辈的电视使用体验上。我负责词条设计、联系 KOL 协同传播，以及话题运营。</p>
        <Metrics items={[[ '370万+', '话题阅读'],['约6000', '话题互动'],['15家', '发布媒体']]} />
        <div className="case-process"><div><span>01</span><h3>设计讨论入口</h3><p>从用户熟悉的电视使用问题出发，把议题提炼成明确的热搜词条。</p></div><div><span>02</span><h3>联系 KOL 协同</h3><p>主动联系 KOL 参与传播，围绕同一话题推进讨论。</p></div><div><span>03</span><h3>观察传播结果</h3><p>结合话题数据与榜单快照，观察用户反馈和媒体参与。</p></div></div>
        <p className="evidence-note">以上为话题整体结果。「发布媒体15家」与我对接的KOL人数分开统计。视频内容制作由其他成员负责，未计入我的个人分工。</p>
        <div className="dialog-actions"><GlassButton as="a" className="button" href="https://weibo.com/2707058873/RepP90jXb" target="_blank" rel="noreferrer">查看主帖与视频</GlassButton><EvidenceButton id="topic" onShot={onShot}>话题原图</EvidenceButton><EvidenceButton id="rank" onShot={onShot}>科技榜记录</EvidenceButton></div>
        <p className="evidence-note">话题页为「全部」口径，拍摄时间未说明。另有科技榜最高第8位的快照；完整传播时序与对接记录待补充。</p>
      </>}
      {id === 'poll' && <>
        <p className="dialog-lead">一个具体问题，让用户愿意回应。</p><p>围绕手机系统偏好，用投票提供明确的参与入口。内容的阅读、用户作出选择和点赞，分别构成不同的反馈。</p>
        <Metrics items={[[ '5万+', '单条内容阅读'],['约3000', '参与投票'],['2500+', '点赞']]} />
        <button className="dialog-image poll-detail-image" onClick={e => onShot('poll', e.currentTarget)} aria-label="放大投票作品"><img src="/assets/S17-poll.png" alt="手机系统偏好投票完整作品" /></button>
        <div className="dialog-actions"><EvidenceButton id="poll" onShot={onShot}>查看完整原图</EvidenceButton></div><p className="evidence-note">作品发布于2026年7月，统计截止未说明。当前呈现作品内容与结果观察，具体策划和后续调整可继续补充。</p>
      </>}
      {id === 'topics' && <>
        <p className="dialog-lead">让日常内容，沉淀成账号自己的栏目。</p><p>实习期间主动搭建5个原创话题，用稳定的栏目名称组织科技讨论与日常表达，为持续运营提供可复用的内容场景。</p>
        <EvidenceStack onShot={onShot} />
        <p className="evidence-note">这里展示已有原图的3个话题，均为话题累计口径，统计起止未说明。小凰鸡数码讲堂的完整记录与第5个话题的名称和截图待补充。</p>
      </>}
      {id === 'bambu' && <><p className="dialog-lead">从产品，走向用户关心的内容。</p><div className="bambu-identity"><strong>BAMBU LAB</strong><span>拓竹 · 产品传播项目</span></div><p>先通过成品查看项目表达，再结合选题、发布与反馈材料完善这个案例。</p><div className="dialog-actions"><GlassButton as="a" className="button" href="https://weibo.com/2707058873/RbYpCAFJm" target="_blank" rel="noreferrer">观看项目视频</GlassButton></div><p className="evidence-note">项目截图、策划过程、个人分工和效果证据待补充，当前不添加未核实的成果数据。</p></>}
      {id === 'platforms' && <PlatformEvidence onShot={onShot} />}
      {id === 'review' && <>
        <p className="dialog-lead">观看上升之后，继续看互动与关注。</p><p>同一统计周期，观看增长，收藏与净涨粉下降。不同指标提示了不同的问题，需要进一步核对内容表现与流量来源。</p>
        <Metrics items={[[ '30万+', '观看量'],['约1500', '收藏'],['约400', '净涨粉']]} />
        <div className="review-table"><div><span>观看量</span><strong>+18%</strong><span>后台环比</span></div><div><span>收藏</span><strong>−43%</strong><span>后台环比</span></div><div><span>净涨粉</span><strong>−25%</strong><span>后台环比</span></div></div>
        <p className="evidence-note">7月20日—8月18日，年份未说明，包含付费投流。环比直接引用后台，上一周期基数未显示；不能据此认定某项策略导致变化。后台关注口径存在差异，原图保留。</p><div className="dialog-actions"><EvidenceButton id="views" onShot={onShot}>观看记录</EvidenceButton><EvidenceButton id="interactions" onShot={onShot}>互动记录</EvidenceButton><EvidenceButton id="followers" onShot={onShot}>关注记录</EvidenceButton></div>
      </>}
      {id === 'resume' && <><p className="dialog-lead">判断内容，也经营反馈。</p><p>凤凰网 · 凰家评测运营实习<br />大连艺术学院 · 播音与主持艺术</p><div className="dialog-actions"><GlassButton as="a" className="button" href="/assets/resume.pdf" target="_blank" rel="noreferrer">查看完整简历</GlassButton><GlassButton as="a" className="button" href="/assets/resume.pdf" download="解宝珅简历.pdf">下载简历</GlassButton></div></>}
      {id === 'contact' && <><p className="dialog-lead">聊聊内容，也聊聊机会。</p><a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}</a><div className="dialog-actions"><GlassButton as="a" className="button" href={`mailto:${contact.email}`}>发送邮件</GlassButton></div></>}
    </div>
  </Modal>;
}

export function EvidenceDialog({ entry, onClose }) {
  const [zoom, setZoom] = useState(false);
  const shot = shots[entry.id];
  return <Modal entry={entry} title={shot.title} onClose={onClose} className="reader-dialog"><div className="reader-toolbar"><p>{shot.note}</p><GlassButton as="button" className="button" aria-pressed={zoom} onClick={() => setZoom(v => !v)}>{zoom ? '适应窗口' : '放大原图'}</GlassButton><a className="text-link" href={`/assets/${shot.file}`} target="_blank" rel="noreferrer">打开原图</a></div><div className={`reader-scroll ${zoom ? 'zoomed' : ''}`}><img src={`/assets/${shot.file}`} alt={`${shot.title}完整证据截图`} /></div></Modal>;
}
