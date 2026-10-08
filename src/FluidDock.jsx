import { Component, lazy, Suspense, useEffect, useState } from 'react';
import './FluidGlass.css';

// Three is an optional, deferred material layer. Navigation is always native HTML.
const FluidGlass = lazy(() => import('./FluidGlass.jsx'));
class MaterialBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}
export default function FluidDock() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const contrast = matchMedia('(prefers-contrast: more)');
    const transparency = matchMedia('(prefers-reduced-transparency: reduce)');
    const desktop = matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
    const connection = navigator.connection;
    const allowed = () => desktop.matches && !reduced.matches && !contrast.matches && !transparency.matches && !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType);
    let cancelled = false, idle = null, openingFinished = false;
    // Finish the title opening before loading/compiling the WebGL material.
    const timer = setTimeout(() => {
      const mount = () => { openingFinished = true; if (!cancelled && allowed() && !document.hidden) setReady(true); };
      idle = window.requestIdleCallback ? requestIdleCallback(mount, { timeout: 1200 }) : setTimeout(mount, 0);
    }, 3300);
    const preferences = () => { if (openingFinished) setReady(allowed()); };
    const visibility = () => { if (!document.hidden && openingFinished && allowed()) setReady(true); };
    [reduced, contrast, transparency, desktop].forEach(query => query.addEventListener('change', preferences));
    connection?.addEventListener('change', preferences);
    document.addEventListener('visibilitychange', visibility);
    return () => { cancelled = true; clearTimeout(timer); window.cancelIdleCallback?.(idle); clearTimeout(idle); [reduced, contrast, transparency, desktop].forEach(query => query.removeEventListener('change', preferences)); connection?.removeEventListener('change', preferences); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <div className="fluid-dock" aria-hidden="true">
    {ready && <MaterialBoundary><Suspense fallback={null}><FluidGlass mode="bar" barProps={{ ior: 1.12, thickness: 3, chromaticAberration: .003, anisotropicBlur: 0, transmission: 1, roughness: 0 }} /></Suspense></MaterialBoundary>}
  </div>;
}
