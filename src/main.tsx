import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker immediately
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { 
    type: 'classic',
    scope: '/'
  }).then((registration) => {
    console.log('ServiceWorker registration successful:', registration.scope);
  }).catch((err) => {
    console.error('ServiceWorker registration failed:', err);
  });
}

createRoot(document.getElementById("root")!).render(<App />);