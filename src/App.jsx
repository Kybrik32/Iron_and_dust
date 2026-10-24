import { useCallback, useLayoutEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Services from './components/Services.jsx';
import SelectedBuilds from './components/SelectedBuilds.jsx';
import Process from './components/Process.jsx';
import ContactForm from './components/ContactForm.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [contactRequest, setContactRequest] = useState(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof window.IntersectionObserver !== 'function') return;
    const groups = [
      ['.about-heading h2, .about-photo, .about-copy', 90],
      ['.services .section-heading > *, .service-row', 80],
      ['.builds .section-heading > *, .build-card', 90],
      ['.process .eyebrow, .process-heading > *, .process-step', 85],
      ['.contact-intro, .form-panel', 100],
    ];
    const targets = groups.flatMap(([selector, stagger]) => [...document.querySelectorAll(selector)].map((node, index) => {
      node.dataset.reveal = '';
      node.style.setProperty('--reveal-delay', `${Math.min(index, 3) * stagger}ms`);
      return node;
    }));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(node => observer.observe(node));
    document.documentElement.classList.add('motion-ready');
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('motion-ready');
      targets.forEach(node => {
        delete node.dataset.reveal;
        node.classList.remove('is-visible');
        node.style.removeProperty('--reveal-delay');
      });
    };
  }, []);

  const requestContact = useCallback((projectType) => {
    setContactRequest({ projectType, requestId: Date.now() + Math.random() });
    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      document.getElementById('contact-title')?.focus({ preventScroll: true });
      history.replaceState(null, '', '#contact');
    });
  }, []);

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Services onContact={requestContact} />
        <SelectedBuilds onContact={requestContact} />
        <Process />
        <ContactForm request={contactRequest} />
      </main>
      <Footer />
    </div>
  </>;
}
