import { useState } from 'react';
import HeroVideo from './HeroVideo.jsx';
import { contact, projects, strengths } from './data.js';
import { DetailDialog, EvidenceDialog } from './Dialog.jsx';
import useGlass from './useGlass.js';
import ScrollJourney from './ScrollJourney.jsx';

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
  useGlass();
  const openDetail = (id, trigger) => setDetail({ kind: 'case', id, trigger, rect: trigger?.getBoundingClientRect() });
  const openShot = (id, trigger) => setShot({ kind: 'shot', id, trigger, rect: trigger?.getBoundingClientRect() });
  async function copyEmail() {
    try { await navigator.clipboard.writeText(contact.email); setCopied(true); setFeedback('邮箱已复制，可粘贴到邮件应用。'); }
    catch { setCopied(false); setFeedback(`请手动复制邮箱：${contact.email}`); }
  }

  return <>
    <a href="#experience" className="skip-link">跳到个人经历</a>
    <header className="site-header shell">
      <a className="wordmark" href="#top" aria-label="解宝珅，返回首页">xiebaoshen<span className="wordmark-dot" /></a>
      <nav className="nav-glass glass" aria-label="主导航">
        <a href="#experience">经历</a><a href="#projects">项目</a><a href="#strengths">优势</a><a href="#contact">联系</a>
      </nav>
      <a className="button glass header-contact" href="#contact"><Icon />联系我</a>
    </header>
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <HeroVideo />
        <div className="hero-content shell">
          <p className="eyebrow hero-eyebrow">运营作品集</p>
          <h1 id="hero-title"><span className="serif">content sense,</span><span>growth mindset.</span></h1>
          <p className="hero-description">内容判断与跨平台运营</p>
          <a className="button glass hero-cta" href="#experience">探索运营实践<Icon name="down" /></a>
        </div>
        <div className="hero-footer shell"><span>解宝珅 · 凤凰网 / 凰家评测</span><span>内容 · 传播 · 运营</span></div>
      </section>

      <section className="experience section shell" id="experience" aria-labelledby="experience-title">
        <div className="section-heading"><div><p className="eyebrow">个人经历</p><h2 id="experience-title">判断内容，也经营反馈。</h2></div><span className="section-index">01 / 04</span></div>
        <div className="experience-grid">
          <div className="portrait-placeholder" aria-label="个人头像位置，等待补充照片">
            <span className="portrait-initial">解</span>
            <div className="portrait-caption glass"><span>解宝珅</span><small>个人照片待补充</small></div>
          </div>
          <div className="experience-copy">
            <p className="intro-name">我是解宝珅。</p>
            <p className="intro-text">在凤凰网 · 凰家评测做科技数码内容运营，<br className="desktop-break" />把选题、发布、互动与数据复盘连起来。</p>
            <div className="experience-record"><span>2026.06 — 2026.09</span><h3>凤凰网 · 新媒体运营实习</h3><p>独立运营微博，参与抖音、小红书、视频号与微信公众号内容发布。</p></div>
            <div className="education"><span>大连艺术学院</span><span>播音与主持艺术 · 本科</span></div>
            <div className="about-actions"><button className="button glass" onClick={e => openDetail('resume', e.currentTarget)}>查看简历</button><a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a></div>
          </div>
        </div>
        <div className="account-evidence">
          <div className="account-label"><h3>我运营过的成熟账号</h3><span>凰家评测 · 微博近30日</span><button className="text-link" onClick={e => openDetail('platforms', e.currentTarget)}>查看后台截图</button></div>
          <div className="account-stat"><strong>570<span>万+</span></strong><p>账号累计阅读</p></div>
          <div className="account-stat"><strong>600<span>万+</span></strong><p>账号视频播放</p></div>
          <p className="metric-note">账号整体数据，完整统计起止未说明。</p>
        </div>
      </section>

      <section className="projects section shell" id="projects" aria-labelledby="projects-title">
        <div className="section-heading"><div><p className="eyebrow">精选项目</p><h2 id="projects-title">让能力，落在作品里。</h2></div><span className="section-index">02 / 04</span></div>
        <div className="project-grid">
          {projects.map((project, i) => <article className={`project-card project-${project.tone}`} key={project.id}>
            <button className="project-visual" onClick={e => openDetail(project.id, e.currentTarget)} aria-label={`查看${project.subtitle}项目详情`}>
              <span className="visual-number">0{i + 1}</span>
              <div className="project-paper"><img src={`/assets/${project.image}`} alt={project.alt} loading="lazy" /></div>
              <span className="visual-tag glass">{project.tag}</span>
              <span className="project-open glass"><Icon name="plus" /></span>
            </button>
            <div className="project-copy"><p className="eyebrow">{project.category}</p><h3>{project.title}</h3><p>{project.subtitle}</p><button className="text-link" onClick={e => openDetail(project.id, e.currentTarget)}>查看项目</button></div>
          </article>)}
        </div>
        <div className="additional-projects">
          <button className="project-row" onClick={e => openDetail('topics', e.currentTarget)}><span className="row-mark">#</span><span><strong>5个原创话题，让账号有持续表达的场景。</strong><small>小凰鸡系列 · 内容栏目</small></span><span className="glass row-control"><Icon name="plus" /></span></button>
          <button className="project-row" onClick={e => openDetail('bambu', e.currentTarget)}><span className="row-mark row-bambu">B</span><span><strong>拓竹 · 产品传播项目</strong><small>查看项目与视频</small></span><span className="glass row-control"><Icon name="plus" /></span></button>
        </div>
      </section>

      <section className="strengths section shell" id="strengths" aria-labelledby="strengths-title">
        <div className="section-heading"><div><p className="eyebrow">个人优势</p><h2 id="strengths-title">从内容判断，到传播推进。</h2></div><span className="section-index">03 / 04</span></div>
        <div className="strength-grid">{strengths.map(s => <article className="strength-card" key={s.index}><span className="strength-index">{s.index}</span><h3>{s.title}</h3><p>{s.copy}</p><button className="text-link" onClick={e => openDetail(s.detail, e.currentTarget)}>{s.evidence}<Icon name="plus" /></button></article>)}</div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-wash" aria-hidden="true" />
        <div className="contact-content shell"><p className="eyebrow">保持联系</p><h2 id="contact-title">聊聊内容，<br /><span className="serif">and what’s next.</span></h2><p className="contact-subtitle">期待把下一次内容判断，变成新的运营实践。</p><a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}</a><div className="contact-actions"><a className="button glass" href={`mailto:${contact.email}`}><Icon />发送邮件</a><button className="button glass" onClick={copyEmail}><Icon name="copy" />{copied ? '已复制邮箱' : '复制邮箱'}</button><a className="button glass" href="/assets/resume.pdf" download="解宝珅简历.pdf">下载简历</a></div><p className="copy-feedback" role="status">{feedback}</p><p className="contact-phone">电话：{contact.phone}</p></div>
        <footer className="footer shell"><span>© 2026 解宝珅 · 运营作品集</span><a href="#top">回到首页</a><a className="font-credit" href="https://www.onlinewebfonts.com/" target="_blank" rel="noreferrer">Fonts by OnlineWebFonts</a></footer>
      </section>
    </main>
    <ScrollJourney />
    {detail && <DetailDialog key={detail.id} entry={detail} onClose={() => setDetail(null)} onShot={openShot} />}
    {shot && <EvidenceDialog key={shot.id} entry={shot} onClose={() => setShot(null)} />}
  </>;
}
