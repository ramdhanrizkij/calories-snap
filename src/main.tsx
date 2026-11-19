import { defineCustomElements } from '@ionic/pwa-elements/loader';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import { registerServiceWorker } from './serviceWorkerRegistration';

// Call the element loader before rendering so Capacitor Camera works on the web
defineCustomElements(window);

// Register Service Worker for PWA installability and offline support
registerServiceWorker();

// Dismiss initial splash screen smoothly once the DOM and React app are initialized
function dismissInitialSplash() {
  const splash = document.getElementById('cs-initial-splash');
  if (splash) {
    // Keep splash visible briefly for a polished native app feeling
    setTimeout(() => {
      splash.classList.add('cs-splash-hidden');
      setTimeout(() => {
        splash.remove();
      }, 500);
    }, 700);
  }
}

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Trigger splash dismissal
dismissInitialSplash();
