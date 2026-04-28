import React, { useEffect, useState } from 'react';
import { getPortfolioData } from './api';
import { Link } from 'react-router-dom';

const Gallery = () => {
  const [data, setData] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const pd = await getPortfolioData();
    setData(pd);
  };

  if (!data) return <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;

  return (
    <div style={{ background: '#080808', minHeight: '100vh', color: '#f5f0eb', padding: '48px 24px', fontFamily: 'sans-serif' }}>
      <header style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '64px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.texts.heroTitle} - Galería</h1>
        <Link to="/" style={{ color: '#c9a96e', textDecoration: 'none', fontWeight: 'bold' }}>Volver al Inicio</Link>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {data.gallery && data.gallery.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {data.gallery.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setModalImage(img)}
                style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', cursor: 'pointer' }}
              >
                <img 
                  src={img} 
                  alt={`Fotografía ${idx + 1}`} 
                  loading="lazy"
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', transition: 'transform 0.5s ease' }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '64px' }}>
            <p>Aún no hay fotos en la galería.</p>
          </div>
        )}
      </div>

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
          <div style={{ position: 'absolute', top: '24px', right: '32px', color: '#fff', fontSize: '2rem', fontWeight: '300' }}>
            &times;
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
