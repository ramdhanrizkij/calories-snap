import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePwaInstall } from './usePwaInstall';

describe('usePwaInstall hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with default state when not standalone and not installed', () => {
    const { result } = renderHook(() => usePwaInstall());

    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isStandalone).toBe(false);
  });

  it('can open and dismiss install dialog', () => {
    const { result } = renderHook(() => usePwaInstall());

    act(() => {
      result.current.openInstallDialog();
    });
    expect(result.current.showPrompt).toBe(true);

    act(() => {
      result.current.dismissPrompt(5);
    });
    expect(result.current.showPrompt).toBe(false);
    expect(localStorage.getItem('caloriesnap_pwa_dismissed_until')).not.toBeNull();
  });

  it('recognizes standalone mode when matchMedia matches', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => usePwaInstall());

    expect(result.current.isStandalone).toBe(true);
    expect(result.current.isInstalled).toBe(true);
  });
});
