import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION } from './motionConfig.js';

gsap.registerPlugin(ScrollTrigger);

export default function usePortfolioMotion(pageRef) {
  useLayoutEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    let disposed = false;
    const media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 900px)', reduced: '(prefers-reduced-motion: reduce)' }, context => {
      const { desktop, reduced } = context.conditions;
      if (!desktop || reduced) {
        root.dataset.motionMode = reduced ? 'reduced' : 'static';
        root.dataset.opening = 'complete';
        return;
      }
      root.dataset.motionMode = 'cinematic';
      const query = selector => [...root.querySelectorAll(selector)];
      const entries = [], promoted = new Set();
      const promote = elements => elements.forEach(el => { el.classList.add('motion-promoted'); promoted.add(el); });
      const settle = elements => elements.forEach(el => { el.classList.remove('motion-promoted'); promoted.delete(el); });
      function entrance(trigger, elements, start = 'top 86%', endTrigger = trigger) {
        const timeline = gsap.timeline({
          id: `entrance-${trigger.id || trigger.classList[0]}`,
          paused: true,
          defaults: { duration: MOTION.section.content, ease: MOTION.ease },
          onStart: () => promote(elements),
          onComplete: () => settle(elements),
        });
        entries.push({ trigger, endTrigger, timeline, start, armed: true });
        return timeline;
      }
      const hero = root.querySelector('.hero');
      const header = root.querySelector('.site-header');
      const art = root.querySelector('.hero-art');
      const titleLines = query('.hero-title-line');
      const eyebrow = root.querySelector('.opening-label');
      const description = root.querySelector('.opening-description');
      const navContent = query('.site-header .wordmark, .site-header nav, .site-header .header-actions');
      const openingElements = [art, header, ...navContent, ...titleLines, eyebrow, description];
      // Prime every stagger target together; delayed children must never flash unmasked.
      gsap.set(art, { '--opening-cut': '46%', clipPath: 'inset(var(--opening-cut) 0)', scale: 1.12 });
      gsap.set(header, { '--nav-cut': '49%', clipPath: 'inset(0 var(--nav-cut) round 999px)' });
      gsap.set(navContent, { y: 14, clipPath: 'inset(0 0 100% 0)' });
      gsap.set(titleLines, { yPercent: 125, xPercent: 3, scaleX: .92, scaleY: .64, rotation: 1.8 });
      gsap.set(eyebrow, { yPercent: 130 });
      gsap.set(description, { yPercent: 140 });
      const opening = gsap.timeline({
        id: 'portfolio-opening',
        paused: true,
        defaults: { ease: MOTION.ease },
        onStart: () => { root.dataset.opening = 'playing'; promote(openingElements); },
        onComplete: () => {
          root.dataset.opening = 'complete';
          settle(openingElements);
          gsap.set(openingElements, { clearProps: 'transform,clipPath' });
          art.style.removeProperty('--opening-cut');
          header.style.removeProperty('--nav-cut');
        },
      });
      opening.to(art, { '--opening-cut': '0%', scale: 1, duration: MOTION.opening.image, ease: MOTION.revealEase }, 0)
        .to(header, { '--nav-cut': '0%', duration: 1.2, ease: MOTION.revealEase }, .08)
        .to(navContent, { y: 0, clipPath: 'inset(0px 0px 0%)', stagger: .09, duration: .75 }, .72)
        .to(titleLines, { yPercent: 0, xPercent: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: MOTION.opening.title, stagger: MOTION.opening.stagger }, .34)
        .to(eyebrow, { yPercent: 0, duration: 1 }, .55)
        .to(description, { yPercent: 0, duration: 1.15 }, 1.28)
        .call(() => {}, [], MOTION.opening.finish);
      // A direct case link opens where the reader asked; wheel/keyboard can skip the opening.
      const atCover = scrollY < 80 && (!location.hash || ['#top', '#about'].includes(location.hash));
      if (atCover) opening.play(0);
      else opening.progress(1);
      const finishOpening = () => { if (opening.progress() < 1) opening.progress(1); };

      // Returning to the cover replays its visual entrance, while the fixed
      // navigation stays available. Do not run a second opening on initial load.
      const coverElements = [art, ...titleLines, eyebrow, description];
      const coverReplay = entrance(hero, coverElements, 'top bottom');
      const coverEntry = entries[entries.length - 1];
      coverEntry.armed = !atCover;
      coverReplay.eventCallback('onStart', () => { root.dataset.opening = 'replaying'; promote(coverElements); });
      coverReplay.eventCallback('onComplete', () => {
        root.dataset.opening = 'complete'; settle(coverElements);
        gsap.set(coverElements, { clearProps: 'transform,clipPath' });
      });
      coverReplay.fromTo(art, { clipPath: 'inset(18% 0)', scale: 1.08 }, { clipPath: 'inset(0% 0)', scale: 1, duration: 1.8, immediateRender: false, ease: MOTION.revealEase }, 0)
        .fromTo(titleLines, { yPercent: 125, xPercent: 3, scaleX: .92, scaleY: .64, rotation: 1.8 }, { yPercent: 0, xPercent: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: MOTION.opening.title, stagger: MOTION.opening.stagger, immediateRender: false }, .2)
        .fromTo(eyebrow, { yPercent: 130 }, { yPercent: 0, duration: 1, immediateRender: false }, .38)
        .fromTo(description, { yPercent: 140 }, { yPercent: 0, duration: 1.15, immediateRender: false }, .95);

      // Match the browser's normalized inset syntax so CSSPlugin interpolates
      // the mask continuously instead of holding it until the final frame.
      for (const section of query('#profile, #tech, #douyin')) {
        const heading = section.querySelector('.section-heading');
        const title = heading.querySelector('.motion-title');
        const cues = [...heading.querySelectorAll('.eyebrow, .section-index')];
        gsap.set(title, { yPercent: 115, x: -85, scaleX: .9, scaleY: .72, rotation: 1.6 });
        gsap.set(cues, { y: 30, clipPath: 'inset(100% 0 0 0)' });
        const last = section.querySelector('.experience-grid, .account-context') || heading;
        const timeline = entrance(heading, [title, ...cues], 'top 86%', last);
        timeline.to(title, { yPercent: 0, x: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: MOTION.section.title }, 0)
          .to(cues, { y: 0, clipPath: 'inset(0% 0px 0px)', stagger: .12, duration: .9 }, .28);
        if (section.id === 'profile') {
          const portrait = section.querySelector('.portrait-placeholder');
          const copy = [...section.querySelector('.experience-copy').children];
          gsap.set(portrait, { y: 70, scale: .94, clipPath: 'inset(0 0 100% 0 round 32px)' });
          gsap.set(copy, { y: 55, clipPath: 'inset(100% 0 0 0)' });
          timeline.to(portrait, { y: 0, scale: 1, clipPath: 'inset(0px 0px 0% round 32px)', duration: 1.4, ease: MOTION.revealEase }, .38)
            .to(copy, { y: 0, clipPath: 'inset(0% 0px 0px)', stagger: .14 }, .5);
          // Release promotion after this section has arrived.
          timeline.eventCallback('onStart', () => promote([title, ...cues, portrait, ...copy]));
          timeline.eventCallback('onComplete', () => settle([title, ...cues, portrait, ...copy]));
        } else if (section.id === 'tech') {
          const contextRows = [...section.querySelector('.account-context').children];
          gsap.set(contextRows, { y: 48, clipPath: 'inset(100% 0 0 0)' });
          timeline.to(contextRows, { y: 0, clipPath: 'inset(0% 0px 0px)', stagger: .18 }, .45);
        }
      }
      const account = root.querySelector('.account-evidence');
      const values = query('.account-stat strong');
      const accountLabels = query('.account-label, .account-stat p');
      gsap.set(values, { yPercent: 120, scaleY: .6 });
      gsap.set(accountLabels, { y: 35, clipPath: 'inset(100% 0 0 0)' });
      entrance(account, [...values, ...accountLabels])
        .to(values, { yPercent: 0, scaleY: 1, stagger: .18, duration: 1.4 }, 0)
        .to(accountLabels, { y: 0, clipPath: 'inset(0% 0px 0px)', stagger: .08 }, .3);
      const projectGrid = root.querySelector('.project-grid');
      const cards = query('.project-card');
      const papers = query('.project-paper');
      const images = query('.project-paper .motion-media');
      const caseTitle = root.querySelector('.case-subheading');
      gsap.set(caseTitle, { y: 45, clipPath: 'inset(100% 0 0 0)' });
      gsap.set(cards, { y: 105, scale: .95 });
      gsap.set(papers, { clipPath: 'inset(0 0 100% 0 round 16px)' });
      gsap.set(images, { scale: 1.18 });
      entrance(projectGrid, [...cards, ...papers, ...images, caseTitle], 'top 88%')
        .to(caseTitle, { y: 0, clipPath: 'inset(0% 0px 0px)', duration: .9 }, 0)
        .to(cards, { y: 0, scale: 1, duration: 1.4, stagger: MOTION.section.stagger }, .18)
        .to(papers, { clipPath: 'inset(0px 0px 0% round 16px)', duration: MOTION.image.reveal, stagger: .22, ease: MOTION.revealEase }, .35)
        .to(images, { scale: MOTION.image.scale, duration: 1.65, stagger: .22 }, .35);
      // Preview movement is owned by each button's hover CSS, with no paired
      // scroll displacement still settling while the pointer enters a card.
      const rows = query('.additional-projects .project-row');
      gsap.set(rows, { y: 50, clipPath: 'inset(0 100% 0 0)' });
      entrance(root.querySelector('.additional-projects'), rows)
        .to(rows, { y: 0, clipPath: 'inset(0px 0% 0px 0px)', stagger: .16, duration: 1.15, ease: MOTION.revealEase });
      const douyin = root.querySelector('.douyin-grid');
      const videos = query('.douyin-work');
      const videoFrames = query('.video-placeholder');
      gsap.set(videos, { y: 100, scale: .95 });
      gsap.set(videoFrames, { clipPath: 'inset(0 0 100% 0 round 28px)' });
      entrance(douyin, [...videos, ...videoFrames], 'top 85%')
        .to(videos, { y: 0, scale: 1, duration: 1.35, stagger: .22 }, .2)
        .to(videoFrames, { clipPath: 'inset(0px 0px 0% round 28px)', duration: 1.4, stagger: .22, ease: MOTION.revealEase }, .3);
      const footer = root.querySelector('.site-footer');
      const footerContent = [...footer.children].filter(el => !el.classList.contains('copy-feedback'));
      gsap.set(footerContent, { y: 42, clipPath: 'inset(100% 0 0 0)' });
      entrance(footer, footerContent, 'top 94%')
        .to(footerContent, { y: 0, clipPath: 'inset(0% 0px 0px)', stagger: .12 });

      // Arm again only after the entire group leaves the viewport. The gap
      // between entering and resetting prevents flicker near a scroll boundary.
      // All timelines are populated before their triggers are attached.
      entries.forEach(entry => {
        // Timeline targets are fixed; cache them once for replay and keyboard focus.
        const targets = [...new Set(entry.timeline.getChildren(false, true, false).flatMap(tween => tween.targets()))];
        entry.targets = targets;
        const show = self => {
          if (!entry.armed || !self.isActive) return;
          const threshold = Number(entry.start.match(/(\d+)%/)?.[1] || 100) / 100;
          if (self.direction > 0 && self.scroll() < self.start + innerHeight * (1 - threshold)) return;
          entry.armed = false;
          const focus = document.activeElement;
          if (focus?.matches(':focus-visible') && targets.some(el => el === focus || el.contains?.(focus))) entry.timeline.progress(1).pause();
          else entry.timeline.restart();
        };
        const reset = () => {
          entry.armed = true;
          entry.timeline.pause(0, true);
          settle(targets);
        };
        ScrollTrigger.create({
          trigger: entry.trigger, start: 'top bottom', endTrigger: entry.endTrigger, end: 'bottom top',
          onEnter: show, onEnterBack: show, onUpdate: show,
          onLeave: reset, onLeaveBack: reset,
        });
      });

      function onKey(event) { if (['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) finishOpening(); }
      function onClick(event) { if (event.target.closest('a[href^="#"]')) finishOpening(); }
      function onFocus(event) {
        if (!event.target.matches(':focus-visible')) return;
        finishOpening();
        entries.forEach(({ trigger, timeline, targets }) => {
          const containsFocus = trigger.contains(event.target) || targets.some(el => el === event.target || el.contains?.(event.target));
          if (containsFocus) timeline.progress(1);
        });
      }
      function onVisibility() {
        if (document.hidden) { finishOpening(); entries.forEach(({ timeline }) => { if (timeline.isActive()) timeline.progress(1); }); }
      }
      addEventListener('wheel', finishOpening, { passive: true });
      addEventListener('touchstart', finishOpening, { passive: true });
      addEventListener('keydown', onKey);
      root.addEventListener('click', onClick, true);
      root.addEventListener('focusin', onFocus);
      document.addEventListener('visibilitychange', onVisibility);
      return () => {
        removeEventListener('wheel', finishOpening);
        removeEventListener('touchstart', finishOpening);
        removeEventListener('keydown', onKey);
        root.removeEventListener('click', onClick, true);
        root.removeEventListener('focusin', onFocus);
        document.removeEventListener('visibilitychange', onVisibility);
        settle([...promoted]);
      };
    }, root);
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); delete root.dataset.motionMode; delete root.dataset.opening; };
  }, [pageRef]);
}
