// Editorial pacing: decisive entrance, long settling, no elastic or bounce easing.
export const MOTION = Object.freeze({
  opening: { image: 1.95, title: 1.85, stagger: .22, finish: 2.95 },
  section: { title: 1.35, content: 1.15, stagger: .2 },
  image: { reveal: 1.45, scale: 1.08 },
  ease: 'power4.out',
  revealEase: 'power3.inOut',
});
