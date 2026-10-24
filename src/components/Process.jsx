const steps = [
  ['Tell Us Your Vision', 'Start with the way you ride, the bike you have, and the details that matter to you.'],
  ['Design & Planning', 'Bring the direction into focus through proportions, materials, and a considered plan.'],
  ['The Build', 'Follow the concept through fabrication, assembly, and attention to the smallest details.'],
  ['The Reveal', 'See how the individual choices come together as one complete motorcycle.'],
];

export default function Process() {
  return <section className="section process" id="process" aria-labelledby="process-title"><div className="shell">
    <p className="eyebrow"><span className="eyebrow-line" />How It Comes Together / 04</p>
    <div className="process-heading"><h2 id="process-title" tabIndex="-1">From an idea to a<br /><em>personal statement.</em></h2><p>Every good build starts with a point of view.</p></div>
    <div className="process-grid">{steps.map(([title, description], i) => <article className="process-step" key={title}><span className="step-number">0{i + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    <p className="micro-copy process-note">An illustrative workflow for this portfolio concept.</p>
  </div></section>;
}
