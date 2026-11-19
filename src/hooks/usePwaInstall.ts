import { useEffect, useState } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface UsePwaInstallReturn {
  canInstall: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  showPrompt: boolean;
  setShowPrompt: (value: boolean) => void;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'ios_guide'>;
  dismissPrompt: (days?: number) => void;
  openInstallDialog: () => void;
}

const DISMISS_KEY = 'caloriesnap_pwa_dismissed_until';
const INSTALLED_KEY = 'caloriesnap_pwa_is_installed';

const checkIsStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

const checkIsIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const isIosDevice =
    /iphone|ipad|ipod/.test(ua) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
  const isSafariBrowser = /safari/.test(ua) && !/chrome|crios|fxios|edgios/.test(ua);
  return isIosDevice && isSafariBrowser;
};

export const usePwaInstall = (): UsePwaInstallReturn => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone] = useState<boolean>(() => checkIsStandalone());
  const [isIOS] = useState<boolean>(() => checkIsIOS());
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return checkIsStandalone() || localStorage.getItem(INSTALLED_KEY) === 'true';
  });
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    // Check if user dismissed recently
    const isDismissExpired = () => {
      const dismissedUntil = localStorage.getItem(DISMISS_KEY);
      return !dismissedUntil || Date.now() > Number(dismissedUntil);
    };

    // 1. Listen for Chrome / Chromium beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      if (!checkIsStandalone() && isDismissExpired()) {
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 2200);
        return () => clearTimeout(timer);
      }
    };

    // 2. Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.setItem(INSTALLED_KEY, 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // If iOS and not standalone and not dismissed, show prompt after delay
    if (checkIsIOS() && !checkIsStandalone() && isDismissExpired()) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<'accepted' | 'dismissed' | 'ios_guide'> => {
    if (isIOS) {
      setShowPrompt(true);
      return 'ios_guide';
    }

    if (!deferredPrompt) {
      setShowPrompt(true);
      return 'dismissed';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setShowPrompt(false);
        setDeferredPrompt(null);
        localStorage.setItem(INSTALLED_KEY, 'true');
        return 'accepted';
      }
      return 'dismissed';
    } catch {
      return 'dismissed';
    }
  };

  const dismissPrompt = (days = 3): void => {
    setShowPrompt(false);
    const expireTime = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(expireTime));
  };

  const openInstallDialog = (): void => {
    setShowPrompt(true);
  };

  const canInstall = !isInstalled && !isStandalone && (Boolean(deferredPrompt) || isIOS);

  return {
    canInstall,
    isInstalled,
    isStandalone,
    isIOS,
    showPrompt,
    setShowPrompt,
    promptInstall,
    dismissPrompt,
    openInstallDialog,
  };
};
