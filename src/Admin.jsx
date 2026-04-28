import React, { useState, useEffect } from 'react';
import { getPortfolioData, savePortfolioData, login, logout, isAuthenticated, uploadImageToFirebase } from './api';
import './index.css'; // Just to get any base resets

const Admin = () => {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('texts');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authed) {
      loadData();
    }
  }, [authed]);

  const loadData = async () => {
    setLoading(true);
    const pd = await getPortfolioData();
    setData(pd);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(password);
    if (res.success) {
      setAuthed(true);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await savePortfolioData(data);
    setSaving(false);
    alert('Cambios guardados con éxito. Vuelve a la página principal para verlos.');
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setSaving(true);
      const url = await uploadImageToFirebase(file);
      if (url) {
        const newItems = [...data.portfolioItems];
        newItems[index] = { ...newItems[index], image: url };
        setData({ ...data, portfolioItems: newItems });
      }
      setSaving(false);
      e.target.value = ''; // Resetear el input para poder subir el mismo archivo de nuevo
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSaving(true);
      const url = await uploadImageToFirebase(file);
      if (url) {
        const newGallery = data.gallery ? [...data.gallery, url] : [url];
        setData({ ...data, gallery: newGallery });
      }
      setSaving(false);
      e.target.value = '';
    }
  };

  if (!authed) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#f5f0eb', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#080808', padding: '48px', border: '1px solid #333' }}>
          <h2>Admin Login</h2>
          <p style={{fontSize: '0.8rem', color: '#888'}}>Contraseña de prueba: admin123</p>
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff', outline: 'none' }}
          />
          <button disabled={loading} style={{ padding: '12px', background: '#c9a96e', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  if (loading || !data) {
    return <div style={{ color: '#fff', padding: '48px' }}>Cargando datos...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111', color: '#f5f0eb', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#080808', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #333' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#c9a96e' }}>Admin Panel</h2>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {[
            { id: 'texts', label: 'Textos Generales' },
            { id: 'portfolio', label: 'Portafolio Principal' },
            { id: 'services', label: 'Servicios' },
            { id: 'gallery', label: 'Galería de Fotos' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '16px 24px', textAlign: 'left', background: activeTab === tab.id ? '#222' : 'transparent',
                border: 'none', borderBottom: '1px solid #222', color: activeTab === tab.id ? '#c9a96e' : '#888', cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '24px', borderTop: '1px solid #333' }}>
          <button onClick={handleLogout} style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer' }}>Cerrar Sesión</button>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, padding: '48px', overflowY: 'auto', paddingBottom: '120px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1>{activeTab === 'texts' ? 'Textos Generales' : activeTab === 'portfolio' ? 'Gestión de Portafolio' : activeTab === 'gallery' ? 'Galería de Fotos' : 'Servicios'}</h1>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="/" target="_blank" style={{ color: '#c9a96e', textDecoration: 'none', padding: '12px' }}>Ver Sitio</a>
            <button 
              onClick={handleSave} 
              disabled={saving}
              style={{ padding: '12px 24px', background: '#c9a96e', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {activeTab === 'texts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '600px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#888' }}>Título Principal</label>
              <input type="text" value={data.texts.heroTitle} onChange={(e) => setData({...data, texts: {...data.texts, heroTitle: e.target.value}})} style={{ padding: '12px', background: '#222', border: 'none', color: '#fff' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#888' }}>Subtítulo Principal</label>
              <input type="text" value={data.texts.heroSubtitle} onChange={(e) => setData({...data, texts: {...data.texts, heroSubtitle: e.target.value}})} style={{ padding: '12px', background: '#222', border: 'none', color: '#fff' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#888' }}>Teléfono (Contacto)</label>
              <input type="text" value={data.texts.phone} onChange={(e) => setData({...data, texts: {...data.texts, phone: e.target.value}})} style={{ padding: '12px', background: '#222', border: 'none', color: '#fff' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#888' }}>Email</label>
              <input type="text" value={data.texts.email} onChange={(e) => setData({...data, texts: {...data.texts, email: e.target.value}})} style={{ padding: '12px', background: '#222', border: 'none', color: '#fff' }} />
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            {data.portfolioItems.map((item, idx) => (
              <div key={item.id} style={{ background: '#222', padding: '24px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input type="text" value={item.title} onChange={(e) => {
                    const newItems = [...data.portfolioItems];
                    newItems[idx].title = e.target.value;
                    setData({...data, portfolioItems: newItems});
                  }} style={{ padding: '8px', background: '#111', border: 'none', color: '#fff' }} placeholder="Título" />
                  
                  <input type="text" value={item.cat} onChange={(e) => {
                    const newItems = [...data.portfolioItems];
                    newItems[idx].cat = e.target.value;
                    setData({...data, portfolioItems: newItems});
                  }} style={{ padding: '8px', background: '#111', border: 'none', color: '#fff' }} placeholder="Categoría" />

                  <div style={{ marginTop: '16px' }}>
                    {item.image ? (
                      <div style={{ position: 'relative' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <button onClick={() => {
                          const newItems = [...data.portfolioItems];
                          newItems[idx].image = null;
                          setData({...data, portfolioItems: newItems});
                        }} style={{ position: 'absolute', top: 8, right: 8, background: 'red', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>X</button>
                      </div>
                    ) : (
                      <div style={{ width: '100%', height: '200px', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #444' }}>
                        <label style={{ cursor: 'pointer', color: '#c9a96e' }}>
                          Subir Imagen
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, idx)} />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {data.services.map((svc, idx) => (
              <div key={svc.id} style={{ background: '#222', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', alignItems: 'start' }}>
                <input type="text" value={svc.name} onChange={(e) => {
                  const newSvc = [...data.services];
                  newSvc[idx].name = e.target.value;
                  setData({...data, services: newSvc});
                }} style={{ padding: '12px', background: '#111', border: 'none', color: '#fff' }} />
                
                <textarea value={svc.desc} onChange={(e) => {
                  const newSvc = [...data.services];
                  newSvc[idx].desc = e.target.value;
                  setData({...data, services: newSvc});
                }} style={{ padding: '12px', background: '#111', border: 'none', color: '#fff', minHeight: '80px' }} />
                
                <input type="text" value={svc.price} onChange={(e) => {
                  const newSvc = [...data.services];
                  newSvc[idx].price = e.target.value;
                  setData({...data, services: newSvc});
                }} style={{ padding: '12px', background: '#111', border: 'none', color: '#fff' }} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#222', padding: '24px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: '#aaa', margin: 0 }}>Sube más fotos de muestra para tu galería pública.</p>
              <label style={{ padding: '12px 24px', background: '#c9a96e', color: '#000', cursor: 'pointer', fontWeight: 'bold' }}>
                Subir Nueva Foto
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleGalleryUpload} />
              </label>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {(data.gallery || []).map((imgUrl, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={imgUrl} alt={`Gallery ${idx}`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
                  <button onClick={() => {
                    const newGallery = data.gallery.filter((_, i) => i !== idx);
                    setData({...data, gallery: newGallery});
                  }} style={{ position: 'absolute', top: 8, right: 8, background: 'red', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '4px' }}>X</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
