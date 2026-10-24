const links = [['About','about'],['Services','services'],['Builds','builds'],['Process','process'],['Contact','contact']];
export default function Footer() {
  return <footer className="footer"><div className="shell"><div className="footer-top"><div><a href="#top" className="footer-wordmark">IRON <span>&</span> DUST.</a><p>For the machines that feel like yours.</p></div><nav aria-label="Footer navigation">{links.map(([label,id]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav></div><div className="footer-bottom"><p>Fictional brand · Portfolio concept by Maxim</p><a href="#top">Back to top ↑</a></div></div></footer>;
}
