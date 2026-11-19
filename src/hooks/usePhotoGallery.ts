import { Camera, CameraResultType, CameraSource, type Photo } from '@capacitor/camera';
import { useCallback, useState } from 'react';

import type { UserPhoto } from '../types/calorie';

async function convertBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Format gambar tidak valid'));
      }
    };
    reader.readAsDataURL(blob);
  });
}

async function resolveDisplayUrl(photo: Photo): Promise<string | undefined> {
  if (!photo.webPath) {
    return undefined;
  }

  try {
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    return await convertBlobToBase64(blob);
  } catch {
    return photo.webPath;
  }
}

function isUserCancelledError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return (
    message.includes('cancel') ||
    message.includes('canceled') ||
    message.includes('cancelled') ||
    message.includes('no image picked')
  );
}

export interface UsePhotoGalleryResult {
  photos: UserPhoto[];
  isCapturing: boolean;
  takePhoto: () => Promise<UserPhoto | null>;
  pickFromGallery: () => Promise<UserPhoto | null>;
}

/**
 * Custom hook wrapping @capacitor/camera based on the official Ionic React
 * "Taking Photos" guide:
 * https://ionicframework.com/docs/react/your-first-app/taking-photos
 */
export function usePhotoGallery(): UsePhotoGalleryResult {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureWithSource = useCallback(async (source: CameraSource): Promise<UserPhoto | null> => {
    setIsCapturing(true);
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source,
        quality: 100,
      });

      const fileName = `food_${Date.now()}.jpeg`;
      const displayUrl = await resolveDisplayUrl(capturedPhoto);

      const newPhoto: UserPhoto = {
        filepath: fileName,
        webviewPath: displayUrl ?? capturedPhoto.webPath,
      };

      setPhotos((prev) => [newPhoto, ...prev]);
      return newPhoto;
    } catch (error) {
      if (isUserCancelledError(error)) {
        return null;
      }
      throw error;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const takePhoto = useCallback(() => captureWithSource(CameraSource.Camera), [captureWithSource]);

  const pickFromGallery = useCallback(() => captureWithSource(CameraSource.Photos), [captureWithSource]);

  return {
    photos,
    isCapturing,
    takePhoto,
    pickFromGallery,
  };
}
