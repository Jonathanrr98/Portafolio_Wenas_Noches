import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import imageCompression from 'browser-image-compression';


const firebaseConfig = {
  apiKey: "AIzaSyCS-Q4EVek83cil-jJ1H-lDtm9S6UwkaHQ",
  authDomain: "wenas-noches-portfolio.firebaseapp.com",
  projectId: "wenas-noches-portfolio",
  storageBucket: "wenas-noches-portfolio.firebasestorage.app",
  messagingSenderId: "830176011562",
  appId: "1:830176011562:web:c971af1f7bebf8bdd32a53"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


const defaultData = {
  texts: {
    heroTitle: "Wenas Noches",
    heroSubtitle: "Fotografía Profesional",
    heroTags: ["Retrato", "Eventos", "Producto", "Fine Art"],
    aboutQuote: "Cada captura es una narrativa; mi compromiso es que la historia sea impactante.",
    aboutBody1: "Fotógrafo independiente basado en Montevideo con una identidad visual sólida fundamentada en la estética Fine Art. Captura la esencia de marcas y personas a través de una narrativa visual sofisticada y técnica avanzada.",
    aboutBody2: "Enfoque en la creación de contenido de alto impacto que combina técnica, composición artística y visión comercial estratégica. Especializado en el desarrollo de campañas visuales completas para marcas, e-commerce y lanzamientos.",
    contactBody: "Siempre abierto a nuevas colaboraciones, proyectos creativos y propuestas de trabajo. Si tenés una idea, escribime.",
    phone: "+598 [Tu Teléfono]",
    email: "[tuemail@ejemplo.com]",
    instagram: "@wenas_nochesj",
    website: "wenas-noches.com"
  },
  portfolioItems: [
    { id: 1, cat: "Retrato", title: "Sesión de Autor", image: null },
    { id: 2, cat: "Evento", title: "Cobertura Corporativa", image: null },
    { id: 3, cat: "Producto", title: "Campaña E-commerce", image: null },
    { id: 4, cat: "Fine Art", title: "Serie Editorial", image: null },
    { id: 5, cat: "Lifestyle", title: "Marca Personal", image: null },
    { id: 6, cat: "Retrato", title: "Portada Editorial", image: null },
  ],
  services: [
    { id: 1, num: "01", name: "Retrato & Sesiones", desc: "Sesiones personales, corporativas y de autor con dirección artística completa.", price: "Desde USD [Precio]" },
    { id: 2, num: "02", name: "Cobertura de Eventos", desc: "Documentación artística de bodas, eventos corporativos y celebraciones.", price: "Desde USD [Precio]" },
    { id: 3, num: "03", name: "Fotografía de Producto", desc: "Catálogos para e-commerce, marca y redes sociales con foco en identidad.", price: "Desde USD [Precio]" },
    { id: 4, num: "04", name: "Contenido & Reels", desc: "Producción de video corto para Instagram y TikTok con edición cinematográfica.", price: "Desde USD [Precio]" },
    { id: 5, num: "05", name: "Branding Visual", desc: "Consultoría integral de identidad visual para marcas y startups.", price: "Desde USD [Precio]" },
    { id: 6, num: "06", name: "Impresiones Fine Art", desc: "Materialización de obra en papel Hahnemühle para colecciones y exposiciones.", price: "Desde USD [Precio]" },
  ],
  skills: [
    { id: 1, name: "Adobe Lightroom", level: 96 },
    { id: 2, name: "Photoshop", level: 92 },
    { id: 3, name: "Capture One", level: 88 },
    { id: 4, name: "Davinci Resolve", level: 78 },
    { id: 5, name: "IA Tools", level: 82 },
  ],
  specialties: ["Fine Art", "Editorial", "E-commerce", "Retrato", "Lifestyle", "Bodas", "Producto", "Reels", "Branding", "Gastronomía"],
  formation: [
    { id: 1, title: "Fotografía Fine Art", sub: "Autodidacta · 2020–2022" },
    { id: 2, title: "Iluminación de Estudio", sub: "Workshop Online · 2023" },
  ],
  gallery: []
};

export const getPortfolioData = async () => {
  try {
    const docRef = doc(db, "portfolio", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...defaultData, ...docSnap.data() };
    } else {
      await setDoc(docRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Firebase read error, cargando datos por defecto locales.", error);
    return defaultData;
  }
};

export const savePortfolioData = async (data) => {
  try {
    const docRef = doc(db, "portfolio", "main");
    await setDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error guardando en Firebase:", error);
    alert("Error al guardar en Firebase. Verifica los permisos de la base de datos.");
    return false;
  }
};

export const uploadImageToFirebase = async (file) => {
  // Modificado para usar ImgBB y evitar el cobro en Firebase Storage
  try {
    const options = {
      maxSizeMB: 0.8,         // Reducir la imagen a un máximo de 800KB
      maxWidthOrHeight: 1600, // Limitar tamaño a 1600px para que cargue rapidísimo en web
      useWebWorker: true
    };
    const compressedFile = await imageCompression(file, options);

    const formData = new FormData();
    formData.append("image", compressedFile);

    const response = await fetch("https://api.imgbb.com/1/upload?key=36064b2be17601025ca16fd70125c245", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      return result.data.url;
    } else {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Error subiendo imagen a ImgBB:", error);
    alert("Error al subir imagen. Verifica tu conexión a internet.");
    return null;
  }
};

export const login = async (password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Contraseña del admin panel.
      if (password === 'admin123') {
        localStorage.setItem('adminToken', 'firebase-connected-token');
        resolve({ success: true });
      } else {
        resolve({ success: false, error: 'Contraseña incorrecta' });
      }
    }, 500);
  });
};

export const logout = () => {
  localStorage.removeItem('adminToken');
};

export const isAuthenticated = () => {
  return localStorage.getItem('adminToken') === 'firebase-connected-token';
};
