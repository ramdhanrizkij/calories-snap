import { IonContent, IonIcon, IonLoading, IonModal, IonPage, IonToast, useIonRouter } from '@ionic/react';
import {
  arrowDownCircleOutline,
  checkmarkCircleOutline,
  chevronForward,
  closeOutline,
  imageOutline,
  settingsOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';

import { BrandLogoIcon, CardBurstRays, FilledCameraIcon, HeroBurstRays } from '../components/CalorieSnapIcons';
import { PwaInstallModal } from '../components/PwaInstallModal';
import { useCalorie } from '../context/useCalorie';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { estimateFoodCalories } from '../services/calorieEstimator';
import './HomePage.css';

const HomePage: React.FC = () => {
  const router = useIonRouter();
  const { takePhoto, pickFromGallery, isCapturing } = usePhotoGallery();
  const { setCurrentAnalysis, dailyTarget, setDailyTarget } = useCalorie();
  const { isInstalled, isIOS, showPrompt, promptInstall, dismissPrompt, openInstallDialog } = usePwaInstall();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [targetInput, setTargetInput] = useState(String(dailyTarget));

  const processCapturedPhoto = async (photoSource: 'camera' | 'gallery') => {
    try {
      const photo = photoSource === 'camera' ? await takePhoto() : await pickFromGallery();
      if (!photo?.webviewPath) {
        return;
      }

      setIsAnalyzing(true);
      const analysis = await estimateFoodCalories(photo.webviewPath);
      setCurrentAnalysis(analysis);
      setIsAnalyzing(false);
      router.push('/hasil', 'forward', 'push');
    } catch {
      setIsAnalyzing(false);
      setToastMessage(
        photoSource === 'camera'
          ? 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diaktifkan.'
          : 'Tidak dapat membuka galeri. Pastikan izin galeri telah diaktifkan.',
      );
    }
  };

  const handleOpenSettings = () => {
    setTargetInput(String(dailyTarget));
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(targetInput);
    if (Number.isFinite(numeric) && numeric >= 800 && numeric <= 6000) {
      setDailyTarget(numeric);
      setIsSettingsOpen(false);
      setToastMessage(`Target kalori harian diperbarui menjadi ${Math.round(numeric)} kkal`);
    } else {
      setToastMessage('Masukkan target kalori antara 800 hingga 6000 kkal.');
    }
  };

  const handleInstallClick = async () => {
    const result = await promptInstall();
    if (result === 'accepted') {
      setToastMessage('Terima kasih! CalorieSnap sedang dipasang di layar utama Anda.');
    }
  };

  return (
    <IonPage className="home-page">
      <IonContent fullscreen className="home-content">
        <div className="cs-page-container home-container">
          {/* Header */}
          <header className="home-header">
            <div className="home-brand" aria-label="CalorieSnap">
              <BrandLogoIcon className="home-brand-icon" />
              <span className="home-brand-title">
                <span className="brand-dark">Calorie</span>
                <span className="brand-purple">Snap</span>
              </span>
            </div>

            <div className="home-header-actions">
              {!isInstalled && (
                <button
                  type="button"
                  className="cs-install-header-btn"
                  onClick={openInstallDialog}
                  aria-label="Pasang Aplikasi"
                >
                  <IonIcon icon={arrowDownCircleOutline} />
                  <span>Pasang App</span>
                </button>
              )}

              <button type="button" className="cs-circle-icon-btn" onClick={handleOpenSettings} aria-label="Pengaturan">
                <IonIcon icon={settingsOutline} />
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="home-hero">
            <div className="home-hero-heading-row">
              <h1 className="home-hero-title">
                Foto Makanan,
                <br />
                Ketahui Kalorinya!
              </h1>
              <HeroBurstRays className="home-hero-rays" />
            </div>

            <p className="home-hero-subtitle">
              Ambil foto makanan Anda,
              <br />
              dan dapatkan estimasi kalori dengan mudah.
            </p>
          </section>

          {/* Primary Camera Capture Card */}
          <section className="home-actions">
            <button
              type="button"
              className="capture-card"
              onClick={() => void processCapturedPhoto('camera')}
              disabled={isCapturing || isAnalyzing}
              aria-label="Ambil Foto"
            >
              <div className="capture-icon-wrapper">
                <div className="capture-icon-circle">
                  <FilledCameraIcon />
                </div>
                <CardBurstRays className="capture-card-rays" />
              </div>

              <span className="capture-card-title">Ambil Foto</span>
              <span className="capture-card-subtitle">Tap untuk mengambil foto makanan</span>
            </button>

            {/* Divider */}
            <div className="home-divider" role="separator" aria-label="atau">
              <span className="home-divider-line" />
              <span className="home-divider-text">atau</span>
              <span className="home-divider-line" />
            </div>

            {/* Secondary Gallery Button */}
            <button
              type="button"
              className="gallery-button"
              onClick={() => void processCapturedPhoto('gallery')}
              disabled={isCapturing || isAnalyzing}
              aria-label="Pilih dari Galeri"
            >
              <span className="gallery-button-left">
                <IonIcon icon={imageOutline} className="gallery-button-icon" />
                <span className="gallery-button-label">Pilih dari Galeri</span>
              </span>
              <IonIcon icon={chevronForward} className="gallery-button-chevron" />
            </button>
          </section>
        </div>

        {/* Settings Sheet Modal */}
        <IonModal
          isOpen={isSettingsOpen}
          onDidDismiss={() => setIsSettingsOpen(false)}
          initialBreakpoint={0.58}
          breakpoints={[0, 0.58, 0.8]}
          className="settings-modal"
        >
          <div className="settings-sheet">
            <div className="settings-sheet-header">
              <h2>Pengaturan</h2>
              <button
                type="button"
                className="cs-circle-icon-btn"
                onClick={() => setIsSettingsOpen(false)}
                aria-label="Tutup Pengaturan"
              >
                <IonIcon icon={closeOutline} />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="settings-form">
              <label htmlFor="daily-target-input" className="settings-label">
                Target Kalori Harian (kkal)
              </label>
              <input
                id="daily-target-input"
                type="number"
                min={800}
                max={6000}
                step={50}
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="settings-input"
              />
              <button type="submit" className="settings-save-btn">
                Simpan Target
              </button>
            </form>

            <div className="settings-pwa-block">
              <span className="settings-label">Status Aplikasi</span>
              {isInstalled ? (
                <div className="settings-pwa-installed">
                  <IonIcon icon={checkmarkCircleOutline} />
                  <span>Aplikasi sudah terpasang di HP Anda</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="settings-pwa-btn"
                  onClick={() => {
                    setIsSettingsOpen(false);
                    openInstallDialog();
                  }}
                >
                  <IonIcon icon={arrowDownCircleOutline} />
                  <span>Pasang Aplikasi ke Handphone</span>
                </button>
              )}
            </div>
          </div>
        </IonModal>

        {/* PWA Install Sheet Modal */}
        <PwaInstallModal
          isOpen={showPrompt}
          onDismiss={() => dismissPrompt(3)}
          onInstall={handleInstallClick}
          isIOS={isIOS}
          isInstalled={isInstalled}
        />

        <IonLoading isOpen={isAnalyzing} message="Menganalisis foto makanan..." spinner="crescent" />

        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2600}
          position="top"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
