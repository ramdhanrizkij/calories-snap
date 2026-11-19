import { IonContent, IonFooter, IonIcon, IonPage, IonToast, useIonRouter } from '@ionic/react';
import { bookmark, checkmarkCircle, chevronBack, flame, shareOutline } from 'ionicons/icons';
import React, { useState } from 'react';

import { useCalorie } from '../context/useCalorie';
import type { MealAnalysis } from '../types/calorie';
import './ResultPage.css';

const SAMPLE_FALLBACK_MEAL: MealAnalysis = {
  id: 'sample_preview',
  imageUrl: '',
  totalCalories: 520,
  marginPercent: 15,
  items: [
    { id: 'sample-1', name: 'Nasi Putih', calories: 200, color: 'orange' },
    { id: 'sample-2', name: 'Ayam Panggang', calories: 180, color: 'green' },
    { id: 'sample-3', name: 'Sayuran (Brokoli & Tomat)', calories: 60, color: 'green' },
  ],
  createdAt: new Date().toISOString(),
};

const ResultPage: React.FC = () => {
  const router = useIonRouter();
  const { currentAnalysis, saveToHistory, isSavedInHistory } = useCalorie();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const meal = currentAnalysis ?? SAMPLE_FALLBACK_MEAL;
  const alreadySaved = isSavedInHistory(meal.id);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.goBack();
    } else {
      router.push('/beranda', 'back', 'replace');
    }
  };

  const handleShare = async () => {
    const breakdownText = meal.items.map((item) => `• ${item.name}: ${item.calories} kkal`).join('\n');
    const summaryText = `Estimasi Kalori (CalorieSnap): ${meal.totalCalories} kkal (± ${meal.marginPercent}%)\n\nRincian:\n${breakdownText}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Estimasi Kalori - CalorieSnap',
          text: summaryText,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryText);
        setToastMessage('Ringkasan kalori disalin ke clipboard');
        return;
      }

      setToastMessage('Fitur berbagi tidak tersedia di browser ini');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      setToastMessage('Gagal membagikan hasil estimasi');
    }
  };

  const handleSaveToHistory = () => {
    if (alreadySaved) {
      setToastMessage('Makanan ini sudah tersimpan di Riwayat');
      return;
    }

    const saved = saveToHistory(meal);
    if (saved) {
      setToastMessage('Berhasil disimpan ke Riwayat');
    }
  };

  return (
    <IonPage className="result-page">
      <IonContent fullscreen className="result-content">
        <div className="cs-page-container result-container">
          {/* Top Action Bar */}
          <header className="result-header">
            <button type="button" className="cs-circle-icon-btn" onClick={handleBack} aria-label="Kembali">
              <IonIcon icon={chevronBack} />
            </button>

            <button
              type="button"
              className="cs-circle-icon-btn"
              onClick={() => void handleShare()}
              aria-label="Bagikan hasil"
            >
              <IonIcon icon={shareOutline} />
            </button>
          </header>

          {/* Food Photo */}
          <div className="result-photo-card">
            {meal.imageUrl ? (
              <img src={meal.imageUrl} alt="Foto makanan yang dianalisis" className="result-photo-img" />
            ) : (
              <div className="result-photo-placeholder">
                <span>Belum ada foto makanan</span>
              </div>
            )}
          </div>

          {/* Calorie Estimation Summary Card */}
          <section className="calorie-summary-card" aria-label="Estimasi Kalori">
            <div className="calorie-flame-circle" aria-hidden="true">
              <IonIcon icon={flame} className="calorie-flame-icon" />
            </div>

            <div className="calorie-summary-info">
              <span className="calorie-summary-label">Estimasi Kalori</span>
              <div className="calorie-summary-value">
                <span className="calorie-number">{meal.totalCalories}</span>
                <span className="calorie-unit">kkal</span>
              </div>
            </div>

            <span className="calorie-margin-badge">± {meal.marginPercent}%</span>
          </section>

          {/* Breakdown List */}
          <section className="breakdown-section" aria-label="Rincian Kalori">
            <h2 className="breakdown-title">Rincian</h2>
            <ul className="breakdown-list">
              {meal.items.map((item) => (
                <li key={item.id} className="breakdown-row">
                  <div className="breakdown-item-left">
                    <span className={`breakdown-dot breakdown-dot--${item.color}`} aria-hidden="true" />
                    <span className="breakdown-item-name">{item.name}</span>
                  </div>
                  <span className="breakdown-item-calories">{item.calories} kkal</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <IonToast
          isOpen={toastMessage !== null}
          message={toastMessage ?? ''}
          duration={2400}
          position="top"
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>

      {/* Bottom CTA Footer */}
      <IonFooter className="result-footer ion-no-border">
        <div className="cs-page-container result-footer-inner">
          <button
            type="button"
            className={`save-history-btn${alreadySaved ? ' save-history-btn--saved' : ''}`}
            onClick={handleSaveToHistory}
          >
            <IonIcon icon={alreadySaved ? checkmarkCircle : bookmark} />
            <span>{alreadySaved ? 'Tersimpan di Riwayat' : 'Simpan ke Riwayat'}</span>
          </button>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default ResultPage;
