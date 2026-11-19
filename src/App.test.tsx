import type * as CapacitorCamera from '@capacitor/camera';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';

import App from './App';
import { CalorieProvider } from './context/CalorieContext';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';

vi.mock('@capacitor/camera', async (importOriginal) => {
  const actual = await importOriginal<typeof CapacitorCamera>();
  return {
    ...actual,
    Camera: {
      getPhoto: vi.fn(),
    },
  };
});

afterEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
});

test('renders App without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});

test('renders CalorieSnap HomePage and triggers Capacitor Camera for camera & gallery', async () => {
  const mockedGetPhoto = vi.mocked(Camera.getPhoto);
  mockedGetPhoto.mockRejectedValue(new Error('User cancelled photos app'));

  render(
    <CalorieProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </CalorieProvider>,
  );

  expect(screen.getByText(/Foto Makanan,/i)).toBeInTheDocument();
  expect(screen.getByText(/Ketahui Kalorinya!/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Ambil Foto' }));
  await waitFor(() => {
    expect(mockedGetPhoto).toHaveBeenCalledWith({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
  });

  fireEvent.click(screen.getByRole('button', { name: 'Pilih dari Galeri' }));
  await waitFor(() => {
    expect(mockedGetPhoto).toHaveBeenCalledWith({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 100,
    });
  });
});

test('renders CalorieSnap ResultPage breakdown and saves meal to history', () => {
  render(
    <CalorieProvider>
      <MemoryRouter>
        <ResultPage />
      </MemoryRouter>
    </CalorieProvider>,
  );

  expect(screen.getByText('Estimasi Kalori')).toBeInTheDocument();
  expect(screen.getByText('520')).toBeInTheDocument();
  expect(screen.getByText('± 15%')).toBeInTheDocument();
  expect(screen.getByText('Rincian')).toBeInTheDocument();
  expect(screen.getByText('Nasi Putih')).toBeInTheDocument();
  expect(screen.getByText('Ayam Panggang')).toBeInTheDocument();
  expect(screen.getByText('Sayuran (Brokoli & Tomat)')).toBeInTheDocument();

  const saveButton = screen.getByRole('button', { name: /Simpan ke Riwayat/i });
  fireEvent.click(saveButton);
  expect(screen.getByText('Tersimpan di Riwayat')).toBeInTheDocument();
});
