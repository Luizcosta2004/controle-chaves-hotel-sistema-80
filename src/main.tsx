import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Inicializa elementos PWA necessários para funcionalidades nativas
defineCustomElements(window);

createRoot(document.getElementById("root")!).render(<App />);