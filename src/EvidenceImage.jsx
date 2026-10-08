import { useEffect, useState } from 'react';
import { shots } from './data.js';

// Keep the screenshots that previously failed as embedded data, but fetch each
// tiny module only when its image is actually opened. They never enter the home bundle.
const loaders = {
  poll: () => import('./assets/evidence/poll.webp?inline'),
  column6: () => import('./assets/evidence/column-tech.webp?inline'),
  column5: () => import('./assets/evidence/column-deep-talk.webp?inline'),
  column7: () => import('./assets/evidence/column-chat.webp?inline'),
  column8: () => import('./assets/evidence/column-digital-class.webp?inline'),
};
const sources = new Map(), pending = new Map();
const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/%3E';

export default function EvidenceImage({ id, onLoad, ...props }) {
  const fallback = `/assets/${shots[id].file}`;
  const [src, setSrc] = useState(() => sources.get(id) || (loaders[id] ? '' : fallback));
  useEffect(() => {
    if (!loaders[id]) { setSrc(fallback); return; }
    let active = true;
    if (!pending.has(id)) pending.set(id, loaders[id]().then(module => {
      sources.set(id, module.default); return module.default;
    }).catch(error => { pending.delete(id); throw error; }));
    pending.get(id).then(value => { if (active) setSrc(value); }).catch(() => { if (active) setSrc(fallback); });
    return () => { active = false; };
  }, [id, fallback]);
  return <img {...props} src={src || placeholder} decoding="async" aria-busy={!src || undefined} onLoad={event => { if (src) onLoad?.(event); }} />;
}
