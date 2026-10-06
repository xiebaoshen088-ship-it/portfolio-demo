import { forwardRef } from 'react';
import GlassSurface from './GlassSurface.jsx';

// Keep the supplied registry source untouched; tune portfolio controls here.
export const BUTTON_GLASS = Object.freeze({
  displace: 15,
  distortionScale: -150,
  redOffset: 5,
  greenOffset: 15,
  blueOffset: 25,
  brightness: 60,
  opacity: 0.8,
  mixBlendMode: 'screen',
  backgroundOpacity: 0,
  saturation: 1.15,
});

export function GlassMaterial({ className = '', radius = 28 }) {
  return <span className={`glass-control-material ${className}`} aria-hidden="true">
    <GlassSurface {...BUTTON_GLASS} width="100%" height="100%" borderRadius={radius} className="portfolio-control-surface" />
  </span>;
}

// The original native element remains the hit target and dialog animation source.
// Only the separate, non-interactive backdrop layer receives the optical filter.
const GlassButton = forwardRef(function GlassButton({ as: Tag = 'button', className = 'button', children, ...props }, ref) {
  return <Tag {...(Tag === 'button' ? { type: 'button' } : {})} {...props} ref={ref} className={`${className} glass glass-control`}>
    <GlassMaterial />
    <span className="glass-control-content">{children}</span>
  </Tag>;
});

export default GlassButton;
