import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, statsChart } from 'ionicons/icons';
import React from 'react';
import { Navigate, Route, useLocation } from 'react-router-dom';

import { CalorieProvider } from './context/CalorieContext';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'ios',
});

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isResultRoute = location.pathname.startsWith('/hasil');

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/beranda" element={<HomePage />} />
        <Route path="/riwayat" element={<HistoryPage />} />
        <Route path="/hasil" element={<ResultPage />} />
        <Route path="/" element={<Navigate to="/beranda" replace />} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className={`cs-tab-bar${isResultRoute ? ' cs-tab-bar--hidden' : ''}`}>
        <IonTabButton tab="beranda" href="/beranda" className="cs-tab-button">
          <IonIcon aria-hidden="true" icon={home} />
          <IonLabel>Beranda</IonLabel>
        </IonTabButton>
        <IonTabButton tab="riwayat" href="/riwayat" className="cs-tab-button">
          <IonIcon aria-hidden="true" icon={statsChart} />
          <IonLabel>Riwayat</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

const App: React.FC = () => (
  <IonApp>
    <CalorieProvider>
      <IonReactRouter>
        <AppRoutes />
      </IonReactRouter>
    </CalorieProvider>
  </IonApp>
);

export default App;
