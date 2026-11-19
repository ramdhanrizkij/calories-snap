import { defineCustomElements } from '@ionic/pwa-elements/loader';
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

// Call the element loader before rendering so Capacitor Camera works on the web
defineCustomElements(window);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
