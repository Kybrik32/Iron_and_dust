import { services } from '../data.js';

export default function Services({ onContact }) {
  return <section className="section services" id="services" aria-labelledby="services-title"><div className="shell">
    <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" />What We Do / 02</p><h2 id="services-title" tabIndex="-1">Made around<br /><em>your ride.</em></h2></div><p>Different directions. One approach: get every detail working together.</p></div>
    <div className="service-list">{services.map(service => <article className="service-row" key={service.number}>
      <span className="service-number">/{service.number}</span>
      <div className="service-title"><h3>{service.title}</h3><p>{service.description}</p><a href="#contact" onClick={event => { event.preventDefault(); onContact(service.projectType); }} className="text-link">{service.link} <span aria-hidden="true">↗</span></a></div>
      <div className="service-image image-frame" aria-hidden="true"><img src={service.image} alt="" width="320" height="200" loading="lazy" /></div>
    </article>)}</div>
  </div></section>;
}
