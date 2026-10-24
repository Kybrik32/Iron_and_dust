import { useEffect, useRef, useState } from 'react';

const links = [ ['About', 'about'], ['Services', 'services'], ['Builds', 'builds'], ['Process', 'process'], ['Contact', 'contact'] ];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onKey = (event) => {
      if (event.key === 'Escape' && open) { setOpen(false); buttonRef.current?.focus(); }
    };
    const desktop = window.matchMedia('(min-width: 1100px)');
    const onDesktop = () => { if (desktop.matches) setOpen(false); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); desktop.removeEventListener('change', onDesktop); };
  }, [open]);

  const follow = (id) => {
    setOpen(false);
    requestAnimationFrame(() => document.querySelector(`#${id} h2, #${id} h1`)?.focus({ preventScroll: true }));
  };

  return <header className={`site-header${scrolled || open ? ' is-scrolled' : ''}`}>
    <div className="shell header-inner">
      <a className="wordmark" href="#top" onClick={() => setOpen(false)} aria-label="Iron and Dust, back to top">IRON <span>&</span> DUST<span className="wordmark-dot">.</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([label,id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <a className="button button-small header-cta" href="#contact">Start Your Build <span aria-hidden="true">↗</span></a>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" ref={buttonRef} onClick={() => { setOpen(!open); if (open) buttonRef.current?.focus(); }}>
        <span></span><span></span>
      </button>
    </div>
    <nav className={`mobile-nav${open ? ' is-open' : ''}`} id="mobile-navigation" aria-label="Mobile navigation" inert={!open ? true : undefined}>
      {links.map(([label,id], index) => <a key={id} href={`#${id}`} onClick={() => follow(id)}><span>0{index + 1}</span>{label}<span aria-hidden="true">↗</span></a>)}
      <p>Fictional workshop. Built for the feeling of the ride.</p>
    </nav>
  </header>;
}
