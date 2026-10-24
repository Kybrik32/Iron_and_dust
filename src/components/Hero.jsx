export default function Hero() {
  return <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="hero-image image-frame"><picture><source media="(max-width: 767px)" srcSet="/images/hero-mobile.webp" /><img src="/images/hero.webp" alt="Black cafe racer inside a working motorcycle workshop" width="1600" height="900" fetchPriority="high" /></picture></div>
    <div className="hero-shade" aria-hidden="true"></div>
    <div className="shell hero-content">
      <div className="hero-copy">
        <div className="hero-heading">
          <p className="eyebrow"><span className="eyebrow-line" />Custom Motorcycle Workshop</p>
          <h1 id="hero-title"><span className="hero-title-line"><span className="hero-title-ink">Built different.</span></span>{' '}<span className="hero-title-line"><span className="hero-title-ink"><em>Ride your own way.</em></span></span></h1>
        </div>
        <div className="hero-detail">
          <p className="hero-lead">Custom motorcycles. Honest craftsmanship. No compromises.</p>
          <div className="hero-actions"><a className="button" href="#builds">Explore Our Builds <span aria-hidden="true">↗</span></a><a className="text-link" href="#contact">Start Your Project <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
      <div className="hero-bottom"><span>Portfolio concept</span><span>Built for the ride <span aria-hidden="true">—</span> 01 / 05</span></div>
    </div>
  </section>;
}
