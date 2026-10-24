import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { builds } from '../data.js';

function BuildModal({ build, onClose, onContact }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    return () => { if (dialog.open) dialog.close(); };
  }, []);

  return <dialog className="build-dialog" ref={dialogRef} aria-labelledby="dialog-title" onClose={onClose} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === dialogRef.current) onClose(); }}>
    <div className="dialog-inner">
      <button type="button" className="dialog-close" aria-label="Close concept" onClick={onClose}>×</button>
      <div className="dialog-photo image-frame"><img src={build.image} alt={build.alt} width="1200" height="800" /></div>
      <div className="dialog-copy"><p className="eyebrow"><span className="eyebrow-line" />{build.category} / Concept</p><h2 id="dialog-title">{build.name}</h2><p className="dialog-summary">{build.summary}</p><p className="direction-label">The direction</p><ol>{build.direction.map((item,i) => <li key={item}><span>0{i + 1}</span>{item}</li>)}</ol><p className="micro-copy">An illustrative concept for this fictional workshop.</p><button type="button" className="button" onClick={onContact}>Discuss a Similar Project <span aria-hidden="true">↗</span></button></div>
    </div>
  </dialog>;
}

export default function SelectedBuilds({ onContact }) {
  const [active, setActive] = useState(null);
  const triggerRef = useRef(null);
  const contactExit = useRef(false);

  const close = () => {
    setActive(null);
    if (!contactExit.current) requestAnimationFrame(() => triggerRef.current?.focus());
    contactExit.current = false;
  };
  const discuss = () => {
    contactExit.current = true;
    setActive(null);
    requestAnimationFrame(() => onContact('Custom Build'));
  };

  return <section className="section builds" id="builds" aria-labelledby="builds-title"><div className="shell">
    <div className="section-heading builds-heading"><div><p className="eyebrow"><span className="eyebrow-line" />Selected Builds / 03</p><h2 id="builds-title" tabIndex="-1">Three ways to<br /><em>make it yours.</em></h2></div><p>Three fictional motorcycle concepts, each with a character of its own.</p></div>
    <div className="build-grid">{builds.map((build,i) => <article className={`build-card${i === 0 ? ' build-featured' : ''}`} key={build.id}>
      <div className="build-photo image-frame"><img src={build.image} alt={build.alt} width={i === 0 ? 1600 : 800} height={i === 0 ? 900 : 600} loading="lazy" /><span className="build-photo-number">0{i + 1} / 03</span></div>
      <div className="build-info"><div><p className="build-category">{build.category}</p><h3>{build.name}</h3><p>{build.summary}</p></div><button type="button" className="outline-button" onClick={event => { triggerRef.current = event.currentTarget; setActive(build); }}>View Concept <span aria-hidden="true">↗</span></button></div>
    </article>)}</div>
    <p className="micro-copy builds-note">Illustrative concepts. Project names and descriptions are fictional.</p>
  </div>{active && createPortal(<BuildModal build={active} onClose={close} onContact={discuss} />, document.body)}</section>;
}
