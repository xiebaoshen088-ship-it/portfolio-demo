import GlassButton from './GlassButton.jsx';
import { useRef, useState } from 'react';
import HeroVideo from './HeroVideo.jsx';
import { contact, projects } from './data.js';
import { DetailDialog, EvidenceDialog } from './Dialog.jsx';
import useGlass from './useGlass.js';
import SectionNavigation from './SectionNavigation.jsx';
import SegmentedControl from './SegmentedControl.jsx';
import usePortfolioMotion from './usePortfolioMotion.js';
import FluidDock from './FluidDock.jsx';
import { WorkFrame, PageBottomBlur } from './CardEffects.jsx';

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
  const pageRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [detail, setDetail] = useState(null);
  const [shot, setShot] = useState(null);
  const [activeSection,setActiveSection] = useState('');
  useGlass();
  usePortfolioMotion(pageRef);
  const openDetail = (id, trigger) => setDetail({ kind: 'case', id, trigger, rect: trigger?.getBoundingClientRect() });
  const openShot = (id, trigger) => setShot({ kind: 'shot', id, trigger, rect: trigger?.getBoundingClientRect() });
  async function copyEmail() {
    try { await navigator.clipboard.writeText(contact.email); setCopied(true); setFeedback('邮箱已复制，可粘贴到邮件应用。'); }
    catch { setCopied(false); setFeedback(`请手动复制邮箱：${contact.email}`); }
  }

  return <div className="portfolio-page" ref={pageRef}>
    <a href="#profile" className="skip-link">跳到个人介绍</a>
    <header className="site-header shell glass" data-expanded="true">
      <FluidDock />
      <a className="wordmark" href="#top" aria-label="解宝珅，返回首页">xiebaoshen<span className="wordmark-dot" /></a>
      <nav aria-label="主导航"><SegmentedControl navigation className="nav-glass" label="主导航" value={activeSection} onChange={setActiveSection} options={[{value:'about',label:'个人介绍'},{value:'tech',label:'凰家评测'},{value:'douyin',label:'个人抖音'}]} /></nav>
      <div className="header-actions"><GlassButton as="a" className="button header-contact" href="#contact"><Icon />联系我</GlassButton></div>
    </header>
    <main>
      <section id="about" aria-labelledby="profile-title">
      <div className="hero" id="top" aria-labelledby="hero-title">
        <HeroVideo />
        <div className="hero-content shell">
          <p className="eyebrow hero-eyebrow motion-mask"><span className="opening-label">运营作品集</span></p>
          <h1 id="hero-title"><span className="serif motion-mask"><span className="hero-title-line motion-title">content sense,</span></span><span className="motion-mask"><span className="hero-title-line motion-title">growth mindset.</span></span></h1>
          <p className="hero-description motion-mask"><span className="opening-description">内容、增长与跨平台运营</span></p>
        </div>
      </div>

      <div className="profile section shell" id="profile">
        <div className="section-heading"><h2 id="profile-title" className="motion-mask"><span className="motion-title">个人介绍</span></h2><span className="section-index">01 / 03</span></div>
        <div className="experience-grid">
          <div className="portrait-placeholder" aria-label="解宝珅个人照片">
            <img className="profile-portrait" src="/assets/profile-photo.jpg" alt="解宝珅证件照" loading="lazy" decoding="async" />
          </div>
          <div className="experience-copy">
            <p className="intro-name">解宝珅</p>
            <p className="intro-text">大连艺术学院</p>
            <div className="education"><span>播音与主持艺术 · 本科</span></div>
            <ul className="profile-highlights" aria-label="个人荣誉与校园职务">
              <li>国际大学生配音大赛三等奖</li>
              <li>辽宁省大学生主持人大赛三等奖</li>
              <li>戏剧影视与传媒学院分团委组织部副部长</li>
            </ul>
            <div className="about-actions"><GlassButton className="button" onClick={e => openDetail('resume', e.currentTarget)} aria-haspopup="dialog">查看简历</GlassButton><a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a></div>
          </div>
        </div>
      </div>
      </section>

      <section className="tech-case section shell" id="tech" aria-labelledby="tech-title">
        <div className="section-heading"><div><p className="eyebrow">科技数码类账号运营</p><h2 id="tech-title" className="motion-mask"><span className="motion-title">凰家评测</span></h2></div><span className="section-index">02 / 03</span></div>
        <div className="account-context">
          <div><h3>凤凰网 · 全网矩阵账号运营</h3><span>2026.06 — 2026.09</span></div>
          <div className="account-description">
            <p>独立运营微博账号，持续跟进科技数码新品、厂商动态与行业热点，根据不同平台特征完成选题判断、内容包装与分发。提升账号在科技数码领域的内容响应速度与传播效率。</p>
            <p>协同运营抖音、小红书、快手、B站等平台，对数据进行持续的跟进和复盘。</p>
          </div>
        </div>
        <div className="account-evidence">
          <div className="account-label"><h3><img className="platform-logo" src="/assets/weibo.svg" alt="微博标识" />账号运营数据</h3><span>微博 · 近30日</span><button className="text-link" onClick={e => openDetail('platforms', e.currentTarget)}>查看后台截图</button></div>
          <div className="account-stat"><div className="motion-mask metric-mask"><strong>570<span>万+</span></strong></div><p>账号累计阅读</p></div>
          <div className="account-stat"><div className="motion-mask metric-mask"><strong>600<span>万+</span></strong></div><p>账号视频播放</p></div>
        </div>
        <h3 className="case-subheading">重点项目</h3>
        <div className="project-grid">
          {projects.map((project, i) => <article className={`project-card project-${project.tone}`} key={project.id}>
            <WorkFrame tone={project.tone}>
            <button className="project-visual" onClick={e => openDetail(project.id, e.currentTarget)} aria-label={`查看${project.title}${project.title.endsWith('项目') ? '详情' : '项目详情'}`}>
              <span className="visual-number">0{i + 1}</span>
              <div className={`project-paper${project.id === 'bambu' ? ' bambu-paper' : ''}`}>{project.image ? <img className="motion-media" src={`/assets/${project.image}`} alt={project.alt} decoding="async" /> : <div className="bambu-cover motion-media"><span className="bambu-cover-symbol">B</span><strong>BAMBU LAB</strong><span>拓竹 · 产品传播项目</span></div>}</div>
              <span className="visual-tag glass">{project.tag}</span>
              <GlassButton as="span" className="project-open"><Icon name="plus" /></GlassButton>
            </button>
            </WorkFrame>
            <div className="project-copy"><p className="eyebrow">{project.category}</p><h3>{project.title}</h3><p>{project.subtitle}</p><button className="text-link" onClick={e => openDetail(project.id, e.currentTarget)}>查看项目</button></div>
          </article>)}
        </div>
        <div className="additional-projects">
          <button className="project-row" onClick={e => openDetail('topics', e.currentTarget)}><span className="row-mark">#</span><span><strong>4个原创话题</strong><small>账号栏目与话题运营</small></span><GlassButton as="span" className="row-control"><Icon name="plus" /></GlassButton></button>
          <button className="project-row" onClick={e => openDetail('poll', e.currentTarget)}><span className="row-mark row-poll">↗</span><span><strong>手机系统偏好投票</strong><small>投票内容与用户讨论</small></span><GlassButton as="span" className="row-control"><Icon name="plus" /></GlassButton></button>
        </div>
      </section>

      <section className="douyin-case section shell" id="douyin" aria-labelledby="douyin-title">
        <div className="section-heading"><div><p className="eyebrow">个人抖音</p><h2 id="douyin-title" className="motion-mask"><span className="motion-title">爆款视频策划</span></h2></div><span className="section-index">03 / 03</span></div>
        <div className="douyin-grid">{[1,2].map(i => <article className="douyin-work" key={i}>
          <WorkFrame tone="video" radius={28}>
          <div className="video-placeholder" aria-label={`代表视频${i}，资料待补充`}><span className="video-placeholder-number">0{i}</span><span>视频资料待补充</span></div>
          </WorkFrame>
          <h3>代表视频 0{i}</h3>
        </article>)}</div>
      </section>
    </main>
    <footer className="site-footer shell" id="contact" aria-label="联系方式">
      <div className="footer-contact"><a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}</a><span className="contact-phone">{contact.phone}</span></div>
      <div className="contact-actions"><GlassButton as="button" className="button" onClick={copyEmail}><Icon name="copy" />{copied ? '已复制邮箱' : '复制邮箱'}</GlassButton><GlassButton as="a" className="button" href="/assets/resume.pdf" download="解宝珅简历.pdf">下载简历</GlassButton></div>
      <p className="copy-feedback" role="status">{feedback}</p>
      <div className="footer-meta"><span>© 2026 解宝珅 · 运营作品集</span><a href="#top">回到首页</a><a className="font-credit" href="https://www.onlinewebfonts.com/" target="_blank" rel="noreferrer">Fonts by OnlineWebFonts</a></div>
    </footer>
    <PageBottomBlur />
    <SectionNavigation onActiveChange={setActiveSection} />
    {detail && <DetailDialog key={detail.id} entry={detail} onClose={() => setDetail(null)} onShot={openShot} />}
    {shot && <EvidenceDialog key={shot.id} entry={shot} onClose={() => setShot(null)} />}
  </div>;
}
