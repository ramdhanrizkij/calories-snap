import { IonContent, IonIcon, IonPage, useIonRouter } from '@ionic/react';
import { cameraOutline, flame, trashOutline } from 'ionicons/icons';
import React from 'react';

import { useCalorie } from '../context/useCalorie';
import type { MealAnalysis } from '../types/calorie';
import './HistoryPage.css';

function formatMealDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}

function isSameLocalDay(isoDate: string, now: Date): boolean {
  const date = new Date(isoDate);
  return (
    date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
  );
}

const HistoryPage: React.FC = () => {
  const router = useIonRouter();
  const { history, dailyTarget, setCurrentAnalysis, removeFromHistory } = useCalorie();

  const today = new Date();
  const todayCalories = history
    .filter((entry) => isSameLocalDay(entry.createdAt, today))
    .reduce((sum, entry) => sum + entry.totalCalories, 0);

  const progressPercent = Math.min(100, Math.round((todayCalories / dailyTarget) * 100));

  const handleSelectMeal = (meal: MealAnalysis) => {
    setCurrentAnalysis(meal);
    router.push('/hasil', 'forward', 'push');
  };

  return (
    <IonPage className="history-page">
      <IonContent fullscreen className="history-content">
        <div className="cs-page-container history-container">
          <header className="history-header">
            <h1 className="history-title">Riwayat</h1>
            <p className="history-subtitle">Catatan estimasi kalori makanan Anda</p>
          </header>

          {/* Today's Summary Card */}
          <section className="history-summary-card" aria-label="Ringkasan Kalori Hari Ini">
            <div className="history-summary-top">
              <div>
                <span className="history-summary-label">Total Hari Ini</span>
                <div className="history-summary-value">
                  <span className="history-summary-number">{todayCalories}</span>
                  <span className="history-summary-unit">/ {dailyTarget} kkal</span>
                </div>
              </div>
              <div className="history-flame-badge" aria-hidden="true">
                <IonIcon icon={flame} />
              </div>
            </div>

            <div
              className="history-progress-track"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="history-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </section>

          {/* Saved Meals List */}
          {history.length === 0 ? (
            <section className="history-empty">
              <div className="history-empty-icon">
                <IonIcon icon={cameraOutline} />
              </div>
              <h2>Belum ada riwayat</h2>
              <p>Foto makanan Anda di halaman Beranda lalu simpan hasil estimasi kalorinya di sini.</p>
              <button
                type="button"
                className="history-empty-cta"
                onClick={() => router.push('/beranda', 'back', 'replace')}
              >
                Mulai Foto Makanan
              </button>
            </section>
          ) : (
            <section className="history-list-section" aria-label="Daftar Makanan Tersimpan">
              <h2 className="history-section-title">Tersimpan ({history.length})</h2>
              <ul className="history-list">
                {history.map((meal) => {
                  const summaryNames = meal.items.map((item) => item.name).join(', ');
                  return (
                    <li key={meal.id} className="history-item-card">
                      <button type="button" className="history-item-main" onClick={() => handleSelectMeal(meal)}>
                        <div className="history-item-thumb">
                          {meal.imageUrl ? <img src={meal.imageUrl} alt={summaryNames} /> : <IonIcon icon={flame} />}
                        </div>
                        <div className="history-item-info">
                          <span className="history-item-names">{summaryNames}</span>
                          <span className="history-item-date">{formatMealDate(meal.createdAt)}</span>
                          <span className="history-item-calories">{meal.totalCalories} kkal</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="history-item-delete"
                        onClick={() => removeFromHistory(meal.id)}
                        aria-label={`Hapus ${summaryNames}`}
                      >
                        <IonIcon icon={trashOutline} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HistoryPage;
