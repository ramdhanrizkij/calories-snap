import { IonIcon, IonModal } from '@ionic/react';
import {
  arrowDownCircleOutline,
  cameraOutline,
  checkmarkCircle,
  closeOutline,
  flashOutline,
  phonePortraitOutline,
  shareOutline,
} from 'ionicons/icons';
import React from 'react';

import './PwaInstallModal.css';

interface PwaInstallModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onInstall: () => Promise<void>;
  isIOS: boolean;
  isInstalled: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onDismiss,
  onInstall,
  isIOS,
  isInstalled,
}) => {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      initialBreakpoint={isIOS ? 0.85 : 0.68}
      breakpoints={[0, 0.68, 0.85]}
      className="pwa-install-modal"
    >
      <div className="pwa-install-sheet">
        {/* Drag handle */}
        <div className="pwa-sheet-handle" />

        {/* Close Button */}
        <button type="button" className="pwa-modal-close" onClick={onDismiss} aria-label="Tutup">
          <IonIcon icon={closeOutline} />
        </button>

        {/* App Logo & Header */}
        <div className="pwa-header-section">
          <div className="pwa-logo-wrapper">
            <img
              src="/icon-192.png"
              alt="CalorieSnap Icon"
              className="pwa-modal-logo"
              onError={(e) => {
                // Fallback to svg if png is still generating
                (e.currentTarget as HTMLImageElement).src = '/logo.svg';
              }}
            />
            <span className="pwa-logo-badge">PWA</span>
          </div>

          <h2 className="pwa-modal-title">Pasang CalorieSnap</h2>
          <p className="pwa-modal-subtitle">Aplikasi penghitung kalori foto makanan untuk handphone Anda</p>
        </div>

        {/* Benefits list */}
        <div className="pwa-benefits-list">
          <div className="pwa-benefit-item">
            <div className="pwa-benefit-icon pwa-benefit-icon--fast">
              <IonIcon icon={flashOutline} />
            </div>
            <div className="pwa-benefit-content">
              <strong>Buka Instan & Cepat</strong>
              <span>Akses langsung dari layar utama tanpa repot ketik URL browser.</span>
            </div>
          </div>

          <div className="pwa-benefit-item">
            <div className="pwa-benefit-icon pwa-benefit-icon--camera">
              <IonIcon icon={cameraOutline} />
            </div>
            <div className="pwa-benefit-content">
              <strong>Kamera Siap Saji</strong>
              <span>Pengalaman foto makanan yang lebih mulus dan responsif layaknya aplikasi asli.</span>
            </div>
          </div>

          <div className="pwa-benefit-item">
            <div className="pwa-benefit-icon pwa-benefit-icon--light">
              <IonIcon icon={phonePortraitOutline} />
            </div>
            <div className="pwa-benefit-content">
              <strong>Ringan & Hemat Memori</strong>
              <span>Hanya memakan sedikit memori dan selalu otomatis diperbarui ke versi terbaru.</span>
            </div>
          </div>
        </div>

        {/* Platform-specific Actions */}
        {isInstalled ? (
          <div className="pwa-installed-message">
            <IonIcon icon={checkmarkCircle} className="pwa-installed-icon" />
            <div>
              <strong>Aplikasi Sudah Terpasang!</strong>
              <p>CalorieSnap sudah siap di layar utama perangkat Anda.</p>
            </div>
          </div>
        ) : isIOS ? (
          /* iOS Safari Step-by-Step Instructions */
          <div className="pwa-ios-instructions">
            <h3 className="pwa-ios-guide-title">Cara Pasang di iPhone / iPad:</h3>
            <ol className="pwa-ios-steps">
              <li>
                <span className="pwa-step-num">1</span>
                <span>
                  Ketuk tombol <strong>Bagikan (Share)</strong>{' '}
                  <span className="pwa-inline-icon">
                    <IonIcon icon={shareOutline} />
                  </span>{' '}
                  di bilah menu Safari (bawah atau atas layar).
                </span>
              </li>
              <li>
                <span className="pwa-step-num">2</span>
                <span>
                  Gulir ke bawah pada menu opsi, lalu pilih <strong>&quot;Tambahkan ke Layar Utama&quot;</strong> (Add
                  to Home Screen).
                </span>
              </li>
              <li>
                <span className="pwa-step-num">3</span>
                <span>
                  Ketuk <strong>&quot;Tambah&quot;</strong> di pojok kanan atas. Ikon CalorieSnap akan muncul di layar
                  depan Anda!
                </span>
              </li>
            </ol>
            <button type="button" className="pwa-primary-btn" onClick={onDismiss}>
              Saya Mengerti
            </button>
          </div>
        ) : (
          /* Android / Desktop One-Click Install */
          <div className="pwa-action-buttons">
            <button type="button" className="pwa-primary-btn" onClick={() => void onInstall()}>
              <IonIcon icon={arrowDownCircleOutline} />
              <span>Install Sekarang</span>
            </button>
            <button type="button" className="pwa-secondary-btn" onClick={onDismiss}>
              Nanti Saja
            </button>
          </div>
        )}
      </div>
    </IonModal>
  );
};
