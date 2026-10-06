import { useState } from 'react';
import { columns, shots } from './data.js';

export default function EvidenceStack({ onShot }) {
  const [expanded,setExpanded]=useState(false);
  return <div className={`evidence-deck ${expanded?'is-expanded':''}`}>
    <div className="deck-toolbar"><span>原创话题 · 已有作品记录</span><button className="button glass" aria-expanded={expanded} aria-controls="column-deck" onClick={()=>setExpanded(v=>!v)}>{expanded?'收起栏目':'展开栏目'}</button></div>
    <div className="stack-cards" id="column-deck">{columns.map((item,i)=><button className="stack-card" style={{'--card-index':i}} key={item.shot} onClick={e=>{if(!expanded){setExpanded(true);return;}onShot(item.shot,e.currentTarget);}} tabIndex={expanded||i===0?0:-1} aria-label={expanded?`放大${item.title}`:'展开原创话题卡片'}><img src={`/assets/${shots[item.shot].file}`} alt={item.title} /><h3>{item.title}</h3><p>{item.metric}</p></button>)}</div>
  </div>;
}
