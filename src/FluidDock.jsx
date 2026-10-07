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
    let cancelled = false, idle = null, openingFinished = false;
    // Finish the title opening before loading/compiling the WebGL material.
    const timer = setTimeout(() => {
      const mount = () => { openingFinished = true; if (!cancelled && !reduced.matches && !contrast.matches && !transparency.matches) setReady(true); };
      idle = window.requestIdleCallback ? requestIdleCallback(mount, { timeout: 1200 }) : setTimeout(mount, 0);
    }, 3300);
    const preferences = () => { if (openingFinished) setReady(!reduced.matches && !contrast.matches && !transparency.matches); };
    [reduced, contrast, transparency].forEach(query => query.addEventListener('change', preferences));
    return () => { cancelled = true; clearTimeout(timer); window.cancelIdleCallback?.(idle); clearTimeout(idle); [reduced, contrast, transparency].forEach(query => query.removeEventListener('change', preferences)); };
  }, []);
  return <div className="fluid-dock" aria-hidden="true">
    {ready && <MaterialBoundary><Suspense fallback={null}><FluidGlass mode="bar" barProps={{ ior: 1.12, thickness: 3, chromaticAberration: .003, anisotropicBlur: 0, transmission: 1, roughness: 0 }} /></Suspense></MaterialBoundary>}
  </div>;
}
