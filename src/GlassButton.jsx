import { forwardRef, useLayoutEffect, useRef } from 'react';
import GlassSurface from './GlassSurface.jsx';

// Keep the supplied registry source untouched; tune portfolio controls here.
export const BUTTON_GLASS = Object.freeze({
  displace: 0.6,
  distortionScale: -50,
  redOffset: 0,
  greenOffset: 1,
  blueOffset: 2,
  brightness: 50,
  opacity: 1,
  blur: 3,
  mixBlendMode: 'screen',
  backgroundOpacity: 0,
  saturation: 1.05,
});

// The 40px navigation lens needs a neutral center and a much smaller blur kernel.
// RGB separation made the shared navigation backdrop smoky gray in Chromium.
export const NAVIGATION_GLASS = Object.freeze({
  ...BUTTON_GLASS,
  displace: 0.6,
  distortionScale: -50,
  redOffset: 0,
  greenOffset: 1,
  blueOffset: 2,
  brightness: 50,
  opacity: 1,
  blur: 3,
  saturation: 1.05,
});

export function GlassMaterial({ className = '', radius = 28, variant = 'button' }) {
  const materialRef = useRef(null);
  const optics = variant === 'navigation' ? NAVIGATION_GLASS : BUTTON_GLASS;
  useLayoutEffect(() => {
    // Use the component's real backdrop displacement without splitting RGB.
    // This preserves background color/alpha and keeps upstream files untouched.
    const blur = materialRef.current?.querySelector('feGaussianBlur');
    blur?.setAttribute('in', 'dispRed');
    return () => blur?.setAttribute('in', 'output');
  }, [variant]);
  return <span ref={materialRef} className={`glass-control-material ${className}`} aria-hidden="true">
    <GlassSurface {...optics} width="100%" height="100%" borderRadius={radius} className="portfolio-control-surface" />
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
