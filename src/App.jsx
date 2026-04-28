import { useState, useEffect, useRef } from "react";
import { getPortfolioData } from "./api";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Archivo:wght@300;400;500;700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #080808;
    --deep: #0d0d0d;
    --surface: #111111;
    --border: rgba(255,255,255,0.06);
    --white: #f5f0eb;
    --dim: rgba(245,240,235,0.65);
    --muted: rgba(245,240,235,0.4);
    --gold: #c9a96e;
    --gold-dim: rgba(201,169,110,0.15);
    --serif: 'Cormorant Garamond', serif;
    --sans: 'Archivo', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--sans);
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
  }


  /* Noise overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9990;
    opacity: 0.35;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 5px; }
  ::-webkit-scrollbar-thumb:hover { background: #b08d55; }

  /* NAV */
  nav {
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 48px;
    background: linear-gradient(to bottom, rgba(8,8,8,0.95), transparent);
  }
  .nav-logo {
    font-family: var(--serif);
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: var(--white);
    text-transform: uppercase;
  }
  .nav-links {
    display: flex;
    gap: 40px;
    list-style: none;
  }
  .nav-links a {
    display: inline-block;
    padding: 12px;
    margin: -12px;
    font-family: var(--sans);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--dim);
    text-decoration: none;
    transition: color 0.3s ease;
  }
  .nav-links a:hover { color: var(--white); }
  .mobile-menu-btn {
    display: none;
    font-family: var(--sans);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    cursor: pointer;
    z-index: 101;
  }

  /* HERO */
  .hero {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 48px 64px;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(ellipse 80% 60% at 70% 40%, rgba(201,169,110,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 20% 80%, rgba(201,169,110,0.03) 0%, transparent 50%),
      var(--black);
  }
  .hero-grid-line {
    position: absolute;
    top: 0; bottom: 0;
    width: 1px;
    background: var(--border);
  }
  .hero-eyebrow {
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 24px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .hero-eyebrow::before {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: var(--gold);
  }
  .hero-title {
    font-family: var(--serif);
    font-size: clamp(4rem, 9vw, 9rem);
    font-weight: 300;
    line-height: 0.9;
    letter-spacing: -0.02em;
    color: var(--white);
    position: relative;
    margin-bottom: 8px;
  }
  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }
  .hero-subtitle {
    font-family: var(--serif);
    font-size: clamp(1.2rem, 2.5vw, 2rem);
    font-weight: 300;
    font-style: italic;
    color: var(--dim);
    margin-bottom: 48px;
    letter-spacing: 0.02em;
  }
  .hero-meta {
    display: flex;
    align-items: center;
    gap: 40px;
    border-top: 1px solid var(--border);
    padding-top: 32px;
  }
  .hero-tags {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .tag {
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--dim);
    border: 1px solid var(--border);
    padding: 6px 14px;
    transition: all 0.3s ease;
  }
  .tag:hover { border-color: var(--gold); color: var(--gold); cursor: pointer; }
  .hero-scroll {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .scroll-line {
    width: 1px;
    height: 60px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(0.7); }
  }

  /* SECTION BASE */
  section { padding: 120px 48px; }
  .section-label {
    font-family: var(--sans);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 64px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    max-width: 80px;
    height: 1px;
    background: var(--gold);
    opacity: 0.4;
  }

  /* ABOUT */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }
  .about-quote {
    font-family: var(--serif);
    font-size: clamp(1.6rem, 3vw, 2.8rem);
    font-weight: 300;
    line-height: 1.3;
    color: var(--white);
    letter-spacing: 0.01em;
  }
  .about-quote em { color: var(--gold); font-style: italic; }
  .about-body {
    font-size: 0.85rem;
    line-height: 1.9;
    color: var(--dim);
    margin-bottom: 32px;
  }
  .about-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-top: 48px;
  }
  .stat {
    border-top: 1px solid var(--border);
    padding-top: 20px;
  }
  .stat-number {
    font-family: var(--serif);
    font-size: 2.8rem;
    font-weight: 300;
    color: var(--white);
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-label {
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* PORTFOLIO GRID */
  .portfolio-intro {
    max-width: 500px;
    margin-bottom: 80px;
  }
  .portfolio-intro h2 {
    font-family: var(--serif);
    font-size: clamp(2.5rem, 5vw, 5rem);
    font-weight: 300;
    line-height: 1.05;
    margin-bottom: 24px;
  }
  .portfolio-intro p {
    font-size: 0.82rem;
    line-height: 1.8;
    color: var(--dim);
  }
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: auto;
    gap: 12px;
  }
  .portfolio-item {
    position: relative;
    overflow: hidden;
    background: var(--surface);
  }
  .portfolio-item:nth-child(1) { grid-column: span 7; grid-row: span 2; aspect-ratio: 4/3; }
  .portfolio-item:nth-child(2) { grid-column: span 5; aspect-ratio: 3/2; }
  .portfolio-item:nth-child(3) { grid-column: span 5; aspect-ratio: 3/2; }
  .portfolio-item:nth-child(4) { grid-column: span 4; aspect-ratio: 1/1; }
  .portfolio-item:nth-child(5) { grid-column: span 8; aspect-ratio: 16/9; }
  .portfolio-item:nth-child(6) { grid-column: span 4; aspect-ratio: 1/1; }
  
  .portfolio-placeholder {
    width: 100%;
    height: 100%;
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1px dashed rgba(201,169,110,0.15);
    transition: all 0.4s ease;
  }
  .portfolio-item:hover .portfolio-placeholder {
    border-color: rgba(201,169,110,0.35);
    background: rgba(201,169,110,0.03);
  }
  .placeholder-icon {
    font-family: var(--serif);
    font-size: 2rem;
    color: rgba(201,169,110,0.2);
    font-style: italic;
  }
  .placeholder-label {
    font-size: 0.6rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .portfolio-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(8,8,8,0.95) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 28px;
  }
  .portfolio-item:hover .portfolio-overlay { opacity: 1; }
  .portfolio-overlay-cat {
    font-size: 0.58rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 6px;
  }
  .portfolio-overlay-title {
    font-family: var(--serif);
    font-size: 1.2rem;
    font-weight: 300;
    color: var(--white);
  }

  /* SERVICES */
  .services { background: var(--deep); }
  .services-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 80px;
  }
  .services-header h2 {
    font-family: var(--serif);
    font-size: clamp(2.5rem, 5vw, 5rem);
    font-weight: 300;
    line-height: 1.05;
  }
  .services-header p {
    max-width: 320px;
    font-size: 0.82rem;
    line-height: 1.8;
    color: var(--dim);
    text-align: right;
  }
  .services-list { display: flex; flex-direction: column; }
  .service-row {
    display: grid;
    grid-template-columns: 80px 1fr 200px 160px;
    align-items: center;
    padding: 28px 0;
    border-top: 1px solid var(--border);
    transition: all 0.3s ease;
    gap: 40px;
  }
  .service-row:last-child { border-bottom: 1px solid var(--border); }
  .service-row:hover { padding-left: 16px; border-top-color: rgba(201,169,110,0.3); }
  .service-num {
    font-family: var(--serif);
    font-size: 0.75rem;
    font-style: italic;
    color: var(--gold);
    opacity: 0.6;
  }
  .service-name {
    font-family: var(--serif);
    font-size: 1.3rem;
    font-weight: 300;
    color: var(--white);
    transition: color 0.3s ease;
  }
  .service-row:hover .service-name { color: var(--gold); }
  .service-desc {
    font-size: 0.75rem;
    line-height: 1.7;
    color: var(--dim);
  }
  .service-price {
    font-family: var(--serif);
    font-size: 1rem;
    font-style: italic;
    color: var(--dim);
    text-align: right;
    transition: color 0.3s ease;
  }
  .service-row:hover .service-price { color: var(--gold); }

  /* SKILLS */
  .skills-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
  }
  .skills-col h3 {
    font-family: var(--serif);
    font-size: 1.8rem;
    font-weight: 300;
    margin-bottom: 40px;
    color: var(--white);
  }
  .skill-bar-row {
    margin-bottom: 24px;
  }
  .skill-bar-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: var(--dim);
  }
  .skill-bar-track {
    height: 1px;
    background: var(--border);
    position: relative;
  }
  .skill-bar-fill {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    background: linear-gradient(to right, var(--gold), rgba(201,169,110,0.3));
    transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .specialty-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }
  .specialty-tag {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--dim);
    border: 1px solid var(--border);
    padding: 8px 16px;
    transition: all 0.3s ease;
  }
  .specialty-tag:hover { color: var(--gold); border-color: var(--gold); background: var(--gold-dim); cursor: pointer; }

  /* CONTACT */
  .contact { background: var(--black); }
  .contact-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
  .contact-heading {
    font-family: var(--serif);
    font-size: clamp(3rem, 6vw, 6rem);
    font-weight: 300;
    line-height: 1;
    margin-bottom: 32px;
  }
  .contact-heading em { font-style: italic; color: var(--gold); }
  .contact-body {
    font-size: 0.82rem;
    line-height: 1.9;
    color: var(--dim);
    margin-bottom: 48px;
  }
  .contact-links { display: flex; flex-direction: column; gap: 0; }
  .contact-link-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    border-top: 1px solid var(--border);
    text-decoration: none;
    color: var(--white);
    transition: all 0.3s ease;
    font-size: 0.82rem;
  }
  .contact-link-row:last-child { border-bottom: 1px solid var(--border); }
  .contact-link-row:hover { color: var(--gold); padding-left: 8px; }
  .contact-link-label {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .contact-link-arrow {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
    color: var(--gold);
    opacity: 0;
  }
  .contact-link-row:hover .contact-link-arrow { opacity: 1; transform: translateX(6px); }
  .contact-form { display: flex; flex-direction: column; gap: 0; }
  .form-group {
    position: relative;
    margin-bottom: 0;
    border-top: 1px solid var(--border);
  }
  .form-group:last-of-type { border-bottom: 1px solid var(--border); margin-bottom: 32px; }
  .form-group label {
    position: absolute;
    top: 20px; left: 0;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    transition: all 0.3s ease;
    pointer-events: none;
  }
  .form-group input,
  .form-group textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: var(--white);
    font-family: var(--sans);
    font-size: 0.9rem;
    font-weight: 300;
    padding: 18px 0 18px 100px;
    resize: none;
    cursor: text;
  }
  .form-group textarea { min-height: 100px; }
  .form-group input:focus + label,
  .form-group textarea:focus + label { color: var(--gold); }
  .btn-submit {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: var(--sans);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    padding: 18px 36px;
    cursor: pointer;
    transition: all 0.4s ease;
    align-self: flex-start;
  }
  .btn-submit:hover { background: var(--gold); color: var(--black); }
  .btn-submit-arrow { transition: transform 0.3s ease; }
  .btn-submit:hover .btn-submit-arrow { transform: translateX(6px); }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 32px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-logo {
    font-family: var(--serif);
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    color: var(--dim);
  }
  .footer-copy {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    color: var(--muted);
    text-align: center;
  }
  .footer-right {
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    color: var(--muted);
    text-align: right;
  }

  /* FADE IN */
  .fade-in {
    opacity: 0;
    transform: translateY(32px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fade-in.visible { opacity: 1; transform: translateY(0); }
  .fade-in.delay-1 { transition-delay: 0.1s; }
  .fade-in.delay-2 { transition-delay: 0.2s; }
  .fade-in.delay-3 { transition-delay: 0.3s; }
  .fade-in.delay-4 { transition-delay: 0.4s; }

  /* MOBILE */
  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .mobile-menu-btn { display: block; }
    .nav-links { 
      position: fixed; top: 0; right: -100%; width: 100%; height: 100vh;
      background: rgba(8,8,8,0.98); backdrop-filter: blur(10px);
      flex-direction: column; justify-content: center; align-items: center; gap: 40px;
      transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .nav-links.open { right: 0; }
    .nav-links a { font-size: 1.2rem; }
    section { padding: 80px 24px; }
    .hero { padding: 0 24px 48px; }
    .hero-title { font-size: 3.5rem; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .portfolio-item { grid-column: span 12 !important; grid-row: span 1 !important; }
    .services-header { flex-direction: column; gap: 24px; }
    .services-header p { text-align: left; }
    .service-row { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; padding: 32px 0; }
    .service-price { text-align: left; margin-top: 8px; }
    .skills-wrap { grid-template-columns: 1fr; gap: 48px; }
    .contact-inner { grid-template-columns: 1fr; gap: 60px; }
    .form-group label { position: static; display: block; margin-bottom: 4px; margin-top: 16px; }
    .form-group input, .form-group textarea { padding: 12px 0; }
    footer { flex-direction: column; gap: 16px; text-align: center; }
    .about-stats { grid-template-columns: 1fr; gap: 32px; }
  }
`;

// Datos cargados dinámicamente desde api.js

function useFadeIn() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function AppWrapper() {
  const [data, setData] = useState(null);
  useEffect(() => {
    getPortfolioData().then(setData);
  }, []);
  if (!data) return <div style={{background: '#080808', height: '100vh'}} />;
  return <WenasNochesPortfolio data={data} />;
}

function WenasNochesPortfolio({ data }) {
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const skillsRef = useRef(null);

  useFadeIn();

  useEffect(() => {
    if (!skillsRef.current) return;
    const observer = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSkillsVisible(true),
      { threshold: 0.3 }
    );
    observer.observe(skillsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{style}</style>

      {/* Nav */}
      <nav>
        <div className="nav-logo">Wenas Noches</div>
        <div className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? 'Cerrar' : 'Menú'}
        </div>
        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          {[
            { label: "Trabajo", id: "trabajo" },
            { label: "Servicios", id: "servicios" },
            { label: "Sobre mí", id: "sobremi" },
            { label: "Contacto", id: "contacto" }
          ].map(l => (
            <li key={l.id} onClick={() => setMobileMenuOpen(false)}><a href={`#${l.id}`}>{l.label}</a></li>
          ))}
          <li onClick={() => setMobileMenuOpen(false)}><a href="/galeria" style={{ color: 'var(--gold)' }}>Galería</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        {[20, 40, 60, 80].map(p => (
          <div key={p} className="hero-grid-line" style={{ left: `${p}%` }} />
        ))}
        <div className="hero-eyebrow fade-in">Montevideo, Uruguay · 2026</div>
        <h1 className="hero-title fade-in delay-1" dangerouslySetInnerHTML={{__html: data.texts.heroTitle.replace('Noches', '<em>Noches</em>')}}>
        </h1>
        <p className="hero-subtitle fade-in delay-2">{data.texts.heroSubtitle}</p>
        <div className="hero-meta fade-in delay-3">
          <div className="hero-tags">
            {data.texts.heroTags.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
          <div className="hero-scroll">
            <div className="scroll-line" />
            <span>Scroll</span>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="sobremi" style={{ background: 'var(--deep)' }}>
        <div className="section-label fade-in">Sobre mí</div>
        <div className="about-grid">
          <div className="fade-in delay-1">
            <blockquote className="about-quote">
              "Cada captura es una narrativa;<br />mi compromiso es que la<br /><em>historia sea impactante.</em>"
            </blockquote>
            <div className="about-stats">
              <div className="stat">
                <div className="stat-number">4+</div>
                <div className="stat-label">Años de experiencia</div>
              </div>
              <div className="stat">
                <div className="stat-number">∞</div>
                <div className="stat-label">Proyectos realizados</div>
              </div>
              <div className="stat">
                <div className="stat-number">6</div>
                <div className="stat-label">Especialidades</div>
              </div>
            </div>
          </div>
          <div className="fade-in delay-2">
            <p className="about-body">
              {data.texts.aboutBody1}
            </p>
            <p className="about-body">
              {data.texts.aboutBody2}
            </p>
            <div className="hero-tags">
              <span className="tag">{data.texts.instagram}</span>
              <span className="tag">{data.texts.website}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="trabajo">
        <div className="portfolio-intro">
          <div className="section-label fade-in">Trabajo</div>
          <h2 className="fade-in delay-1">Muestra<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>selecta</em></h2>
          <p className="fade-in delay-2">Una selección de proyectos que refleja mi visión artística y capacidad técnica en distintos géneros fotográficos.</p>
        </div>
        <div className="portfolio-grid">
          {data.portfolioItems.map((item, i) => (
            <div key={item.id} className={`portfolio-item fade-in delay-${(i % 4) + 1}`}>
              {item.image ? (
                <img src={item.image} alt={item.title} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%'}} />
              ) : (
                <div className="portfolio-placeholder">
                  <div className="placeholder-icon">✦</div>
                  <div className="placeholder-label">{item.cat}</div>
                </div>
              )}
              <div 
                className="portfolio-overlay" 
                onClick={() => item.image && setModalImage(item.image)}
                style={{ cursor: item.image ? 'pointer' : 'none' }}
              >
                <div className="portfolio-overlay-cat">{item.cat}</div>
                <div className="portfolio-overlay-title">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="services">
        <div className="services-header">
          <div>
            <div className="section-label fade-in">Propuesta Visual 2026</div>
            <h2 className="fade-in delay-1">Servicios</h2>
          </div>
          <p className="fade-in delay-2">Soluciones visuales completas adaptadas a cada proyecto, marca y visión.</p>
        </div>
        <div className="services-list">
          {data.services.map((s, i) => (
            <div key={s.id} className={`service-row fade-in delay-${(i % 3) + 1}`}>
              <span className="service-num">{s.num}</span>
              <span className="service-name">{s.name}</span>
              <span className="service-desc">{s.desc}</span>
              <span className="service-price">{s.price}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section ref={skillsRef}>
        <div className="section-label fade-in">Dominio técnico</div>
        <div className="skills-wrap">
          <div className="fade-in delay-1">
            <h3>Software</h3>
            {data.skills.map((s, i) => (
              <div key={s.id} className="skill-bar-row">
                <div className="skill-bar-label">
                  <span>{s.name}</span>
                  <span style={{ color: 'var(--gold)', opacity: 0.7 }}>{s.level}%</span>
                </div>
                <div className="skill-bar-track">
                  <div className="skill-bar-fill" style={{ width: skillsVisible ? `${s.level}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="fade-in delay-2">
            <h3>Especialidades</h3>
            <div className="specialty-grid">
              {data.specialties.map((s, i) => (
                <span key={i} className="specialty-tag">{s}</span>
              ))}
            </div>
            <div style={{ marginTop: '48px' }}>
              <h3 style={{ marginBottom: '24px' }}>Formación</h3>
              {data.formation.map((f) => (
                <div key={f.id} style={{ borderTop: '1px solid var(--border)', padding: '16px 0' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--white)', marginBottom: '4px' }}>{f.title}</div>
                  <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'var(--muted)', textTransform: 'uppercase' }}>{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="contact">
        <div className="contact-inner">
          <div>
            <div className="section-label fade-in">Contacto</div>
            <h2 className="contact-heading fade-in delay-1">
              Hablemos<br />de tu<br /><em>proyecto.</em>
            </h2>
              <p className="contact-body fade-in delay-2">
              {data.texts.contactBody}
            </p>
            <div className="contact-links fade-in delay-3">
              {[
                { label: "Teléfono", value: data.texts.phone },
                { label: "Email", value: data.texts.email },
                { label: "Instagram", value: data.texts.instagram },
                { label: "Web", value: data.texts.website },
              ].map((c, i) => (
                <a key={i} href="#" className="contact-link-row">
                  <span className="contact-link-label">{c.label}</span>
                  <span>{c.value}</span>
                  <span className="contact-link-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
          <div className="fade-in delay-2">
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("¡Mensaje enviado correctamente! Nos pondremos en contacto pronto."); e.target.reset(); }}>
              {[
                { label: "Nombre", type: "text", id: "nombre" },
                { label: "Email", type: "email", id: "email" },
                { label: "Proyecto", type: "text", id: "proyecto" },
              ].map((f, i) => (
                <div key={i} className="form-group">
                  <input type={f.type} id={f.id} required />
                  <label htmlFor={f.id}>{f.label}</label>
                </div>
              ))}
              <div className="form-group">
                <textarea id="mensaje" rows={4} required />
                <label htmlFor="mensaje">Mensaje</label>
              </div>
              <button type="submit" className="btn-submit">
                Enviar mensaje
                <span className="btn-submit-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo">Wenas Noches</div>
        <div className="footer-copy">© 2026 · Fotografía Profesional</div>
        <div className="footer-right">WENAS-NOCHES</div>
      </footer>

      {/* Modal / Lightbox */}
      {modalImage && (
        <div 
          onClick={() => setModalImage(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100000,
            background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: '24px'
          }}
        >
          <img 
            src={modalImage} 
            alt="Full size" 
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.1)' }} 
          />
          <div style={{ position: 'absolute', top: '24px', right: '32px', color: 'var(--white)', fontSize: '2rem', fontFamily: 'var(--sans)', fontWeight: '300' }}>
            &times;
          </div>
        </div>
      )}

      {/* Scroll to Top */}
      <div 
        onClick={scrollToTop}
        style={{
          position: 'fixed', bottom: '32px', right: '32px',
          width: '50px', height: '50px',
          background: 'var(--gold)', color: 'var(--black)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 9000,
          opacity: showScrollTop ? 1 : 0, visibility: showScrollTop ? 'visible' : 'hidden',
          transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          fontSize: '1.4rem'
        }}
      >
        ↑
      </div>
    </>
  );
}