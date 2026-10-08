import { columns } from './data.js';
import EvidenceImage from './EvidenceImage.jsx';

export default function EvidenceStack({ onShot }) {
  return <div className="topic-evidence-grid" aria-label="四个原创话题">
    {columns.map(item=><button className="topic-evidence-card" key={item.shot} onClick={e=>onShot(item.shot,e.currentTarget)} aria-label={`放大${item.title}`}><EvidenceImage id={item.shot} alt={item.title} style={{objectPosition:item.imagePosition || 'top'}} /><h3>{item.title}</h3><p>{item.metric}</p></button>)}
  </div>;
}
