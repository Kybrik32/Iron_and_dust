export default function About() {
  return <section className="section about" id="about" aria-labelledby="about-title">
    <div className="shell about-grid">
      <div className="about-heading"><p className="eyebrow"><span className="eyebrow-line" />The Workshop / 01</p><h2 id="about-title" tabIndex="-1">Not just machines.<br /><em>Personal statements.</em></h2></div>
      <div className="about-photo image-frame"><img src="/images/workshop.webp" alt="Mechanic working on a motorcycle behind tools and a weathered fuel tank" width="1200" height="800" loading="lazy" /><span className="image-caption">The space between vision and machine.</span></div>
      <div className="about-copy"><span className="index-mark">01 — The way we see it</span><p>Every motorcycle starts with a different idea of freedom. IRON & DUST explores that idea through purposeful design, considered details, and a respect for the machine underneath.</p><p>From the first sketch to the final finish, the character is in the choices.</p><div className="about-rule"></div><p className="micro-copy">An exploration of form, function, and character.</p></div>
    </div>
  </section>;
}
