// Shared material, geometry, light and motion rules. No per-control magic numbers.
export const GLASS = {
  optics: { displacement: 24, edgeOffset: 8, rim: 11, maxArea: 250000, renderDpr: 1.5 },
  motion: { feedback: 160, switch: 360, open: 420, close: 340, easing: 'cubic-bezier(.2,.82,.22,1)' },
  light: { x: .28, y: .16, strength: .22 },
};

export function applyAppearance({ theme, material, transmission }) {
  const root = document.documentElement;
  root.style.setProperty('--feedback',`${GLASS.motion.feedback}ms`);
  root.style.setProperty('--settle',`${GLASS.motion.switch}ms`);
  root.style.setProperty('--material-ease',GLASS.motion.easing);
  root.dataset.theme = theme;
  root.dataset.material = material;
  const t = transmission / 100;
  root.style.setProperty('--glass-blur', `${material === 'soft' ? 8 + (1 - t) * 10 : .7 + (1 - t) * 3}px`);
  root.style.setProperty('--glass-tint', String(material === 'soft' ? .3 + (1 - t) * .3 : .07 + (1 - t) * .13));
  root.style.setProperty('--glass-saturation', material === 'soft' ? '115%' : '125%');
  root.style.colorScheme = theme;
}
