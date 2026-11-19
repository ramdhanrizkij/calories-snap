import { IonApp } from '@ionic/react';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { PwaInstallModal } from './PwaInstallModal';

describe('PwaInstallModal', () => {
  it('renders correctly for Android/Desktop with Install button', async () => {
    const handleDismiss = vi.fn();
    const handleInstall = vi.fn().mockResolvedValue(undefined);

    render(
      <IonApp>
        <PwaInstallModal
          isOpen={true}
          onDismiss={handleDismiss}
          onInstall={handleInstall}
          isIOS={false}
          isInstalled={false}
        />
      </IonApp>,
    );

    expect(await screen.findByText('Pasang CalorieSnap')).toBeInTheDocument();
    expect(screen.getByText('Buka Instan & Cepat')).toBeInTheDocument();
    expect(screen.getByText('Kamera Siap Saji')).toBeInTheDocument();
    expect(screen.getByText('Ringan & Hemat Memori')).toBeInTheDocument();

    const installBtn = screen.getByRole('button', { name: /Install Sekarang/i });
    expect(installBtn).toBeInTheDocument();
    fireEvent.click(installBtn);
    expect(handleInstall).toHaveBeenCalledTimes(1);

    const laterBtn = screen.getByRole('button', { name: /Nanti Saja/i });
    fireEvent.click(laterBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders step-by-step instructions for iOS devices', async () => {
    const handleDismiss = vi.fn();
    const handleInstall = vi.fn();

    render(
      <IonApp>
        <PwaInstallModal
          isOpen={true}
          onDismiss={handleDismiss}
          onInstall={handleInstall}
          isIOS={true}
          isInstalled={false}
        />
      </IonApp>,
    );

    expect(await screen.findByText(/Cara Pasang di iPhone \/ iPad:/i)).toBeInTheDocument();
    expect(screen.getByText(/Tambahkan ke Layar Utama/i)).toBeInTheDocument();

    const understandBtn = screen.getByRole('button', { name: /Saya Mengerti/i });
    expect(understandBtn).toBeInTheDocument();
    fireEvent.click(understandBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows installed message when already installed', async () => {
    render(
      <IonApp>
        <PwaInstallModal isOpen={true} onDismiss={vi.fn()} onInstall={vi.fn()} isIOS={false} isInstalled={true} />
      </IonApp>,
    );

    expect(await screen.findByText('Aplikasi Sudah Terpasang!')).toBeInTheDocument();
    expect(screen.getByText('CalorieSnap sudah siap di layar utama perangkat Anda.')).toBeInTheDocument();
  });
});
