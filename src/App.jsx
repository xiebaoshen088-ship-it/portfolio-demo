import { useState } from 'react';
import HeroVideo from './HeroVideo.jsx';
import { contact, projects } from './data.js';
import { DetailDialog, EvidenceDialog } from './Dialog.jsx';
import useGlass from './useGlass.js';
import SectionNavigation from './SectionNavigation.jsx';
import SegmentedControl from './SegmentedControl.jsx';

export function Icon({ name = 'mail', ...props }) {
  const paths = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 7 9 6 9-6" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    down: <path d="m6 9 6 6 6-6" />,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V4H4v12h4" /></>,
    zoom: <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5M10 7v6M7 10h6" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.plus}</svg>;
}

export default function App() {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [detail, setDetail] = useState(null);
  const [shot, setShot] = useState(null);
  const [activeSection,setActiveSection] = useState('');
  useGlass();
  const openDetail = (id, trigger) => setDetail({ kind: 'case', id, trigger, rect: trigger?.getBoundingClientRect() });
  const openShot = (id, trigger) => setShot({ kind: 'shot', id, trigger, rect: trigger?.getBoundingClientRect() });
  async function copyEmail() {
    try { await navigator.clipboard.writeText(contact.email); setCopied(true); setFeedback('邮箱已复制，可粘贴到邮件应用。'); }
    catch { setCopied(false); setFeedback(`请手动复制邮箱：${contact.email}`); }
  }

  return <>
    <a href="#profile" className="skip-link">跳到个人介绍</a>
    <header className="site-header shell glass" data-expanded="true">
      <a className="wordmark" href="#top" aria-label="解宝珅，返回首页">xiebaoshen<span className="wordmark-dot" /></a>
      <nav aria-label="主导航"><SegmentedControl navigation className="nav-glass" label="主导航" value={activeSection} onChange={setActiveSection} options={[{value:'about',label:'个人介绍'},{value:'tech',label:'凰家评测'},{value:'douyin',label:'个人抖音'}]} /></nav>
      <div className="header-actions"><a className="button glass header-contact" href="#contact"><Icon />联系我</a></div>
    </header>
    <main>
      <section id="about" aria-labelledby="profile-title">
      <div className="hero" id="top" aria-labelledby="hero-title">
        <HeroVideo />
        <div className="hero-content shell">
          <p className="eyebrow hero-eyebrow">运营作品集</p>
          <h1 id="hero-title"><span className="serif">content sense,</span><span>growth mindset.</span></h1>
          <p className="hero-description">内容判断与跨平台运营</p>
          <a className="button glass hero-cta" href="#profile">了解个人背景<Icon name="down" /></a>
        </div>
      </div>

      <div className="profile section shell" id="profile">
        <div className="section-heading"><h2 id="profile-title">个人介绍</h2><span className="section-index">01 / 03</span></div>
        <div className="experience-grid">
          <div className="portrait-placeholder" aria-label="个人头像位置，等待补充照片">
            <span className="portrait-initial">解</span>
            <div className="portrait-caption glass"><span>解宝珅</span><small>个人照片待补充</small></div>
          </div>
          <div className="experience-copy">
            <p className="intro-name">解宝珅</p>
            <p className="intro-text">大连艺术学院</p>
            <div className="education"><span>播音与主持艺术 · 本科在读</span></div>
            <div className="about-actions"><button className="button glass" onClick={e => openDetail('resume', e.currentTarget)}>查看简历</button><a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a></div>
          </div>
        </div>
      </div>
      </section>

      <section className="tech-case section shell" id="tech" aria-labelledby="tech-title">
        <div className="section-heading"><div><p className="eyebrow">科技数码类账号运营</p><h2 id="tech-title">凰家评测</h2></div><span className="section-index">02 / 03</span></div>
        <div className="account-context"><div><h3>凤凰网 · 新媒体运营实习</h3><span>2026.06 — 2026.09</span></div><p>独立运营微博，参与抖音、小红书、视频号与微信公众号内容发布、互动和数据复盘。</p></div>
        <div className="account-evidence">
          <div className="account-label"><h3>账号运营数据</h3><span>微博 · 近30日</span><button className="text-link" onClick={e => openDetail('platforms', e.currentTarget)}>查看后台截图</button></div>
          <div className="account-stat"><strong>570<span>万+</span></strong><p>账号累计阅读</p></div>
          <div className="account-stat"><strong>600<span>万+</span></strong><p>账号视频播放</p></div>
          <p className="metric-note">账号整体数据，完整统计起止未说明。</p>
        </div>
        <h3 className="case-subheading">内容与传播实践</h3>
        <div className="project-grid">
          {projects.map((project, i) => <article className={`project-card project-${project.tone}`} key={project.id}>
            <button className="project-visual" onClick={e => openDetail(project.id, e.currentTarget)} aria-label={`查看${project.title}项目详情`}>
              <span className="visual-number">0{i + 1}</span>
              <div className="project-paper"><img src={`/assets/${project.image}`} alt={project.alt} loading="lazy" /></div>
              <span className="visual-tag glass">{project.tag}</span>
              <span className="project-open glass"><Icon name="plus" /></span>
            </button>
            <div className="project-copy"><p className="eyebrow">{project.category}</p><h3>{project.title}</h3><p>{project.subtitle}</p><button className="text-link" onClick={e => openDetail(project.id, e.currentTarget)}>查看项目</button></div>
          </article>)}
        </div>
        <div className="additional-projects">
          <button className="project-row" onClick={e => openDetail('topics', e.currentTarget)}><span className="row-mark">#</span><span><strong>5个原创话题 · 小凰鸡系列</strong><small>账号栏目与话题运营</small></span><span className="glass row-control"><Icon name="plus" /></span></button>
          <button className="project-row" onClick={e => openDetail('bambu', e.currentTarget)}><span className="row-mark row-bambu">B</span><span><strong>拓竹 · 产品传播项目</strong><small>查看项目与视频</small></span><span className="glass row-control"><Icon name="plus" /></span></button>
          <button className="project-row" onClick={e => openDetail('review', e.currentTarget)}><span className="row-mark row-review">↗</span><span><strong>小红书 · 数据复盘</strong><small>观看、互动与关注表现</small></span><span className="glass row-control"><Icon name="plus" /></span></button>
        </div>
      </section>

      <section className="douyin-case section shell" id="douyin" aria-labelledby="douyin-title">
        <div className="section-heading"><div><p className="eyebrow">个人抖音</p><h2 id="douyin-title">爆款视频策划</h2></div><span className="section-index">03 / 03</span></div>
        <div className="douyin-grid">{[1,2].map(i => <article className="douyin-work" key={i}>
          <div className="video-placeholder" aria-label={`代表视频${i}，资料待补充`}><span className="video-placeholder-number">0{i}</span><span>视频资料待补充</span></div>
          <h3>代表视频 0{i}</h3>
        </article>)}</div>
      </section>
    </main>
    <footer className="site-footer shell" id="contact" aria-label="联系方式">
      <div className="footer-contact"><a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}</a><span className="contact-phone">{contact.phone}</span></div>
      <div className="contact-actions"><a className="button glass" href={`mailto:${contact.email}`}><Icon />发送邮件</a><button className="button glass" onClick={copyEmail}><Icon name="copy" />{copied ? '已复制邮箱' : '复制邮箱'}</button><a className="button glass" href="/assets/resume.pdf" download="解宝珅简历.pdf">下载简历</a></div>
      <p className="copy-feedback" role="status">{feedback}</p>
      <div className="footer-meta"><span>© 2026 解宝珅 · 运营作品集</span><a href="#top">回到首页</a><a className="font-credit" href="https://www.onlinewebfonts.com/" target="_blank" rel="noreferrer">Fonts by OnlineWebFonts</a></div>
    </footer>
    <SectionNavigation onActiveChange={setActiveSection} />
    {detail && <DetailDialog key={detail.id} entry={detail} onClose={() => setDetail(null)} onShot={openShot} />}
    {shot && <EvidenceDialog key={shot.id} entry={shot} onClose={() => setShot(null)} />}
  </>;
}
