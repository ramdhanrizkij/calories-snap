// Adds jest-dom's DOM matchers (toBeInTheDocument, toHaveTextContent, ...) to Vitest's expect.
import '@testing-library/jest-dom/vitest';
import { setupIonicReact } from '@ionic/react';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

setupIonicReact();

// Testing Library only cleans up automatically when Vitest globals are enabled.
afterEach(() => {
  cleanup();
});

// Polyfill Map.groupBy for Node 20 environments
if (typeof (Map as unknown as { groupBy?: unknown }).groupBy !== 'function') {
  (
    Map as unknown as { groupBy: <K, T>(items: Iterable<T>, keySelector: (item: T, index: number) => K) => Map<K, T[]> }
  ).groupBy = function <K, T>(items: Iterable<T>, keySelector: (item: T, index: number) => K): Map<K, T[]> {
    const map = new Map<K, T[]>();
    let i = 0;
    for (const item of items) {
      const key = keySelector(item, i++);
      const group = map.get(key);
      if (group) group.push(item);
      else map.set(key, [item]);
    }
    return map;
  };
}

// jsdom doesn't implement matchMedia, which Ionic uses for platform and dark mode checks.
window.matchMedia =
  window.matchMedia ||
  function (query: string): MediaQueryList {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    };
  };
