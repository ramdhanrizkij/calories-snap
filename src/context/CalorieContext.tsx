import React, { useCallback, useMemo, useState } from 'react';

import type { MealAnalysis } from '../types/calorie';

import { CalorieContext, type CalorieContextValue } from './calorieContext';

const HISTORY_STORAGE_KEY = 'caloriesnap_history_v1';
const TARGET_STORAGE_KEY = 'caloriesnap_daily_target_v1';
const DEFAULT_DAILY_TARGET = 2000;

function loadStoredHistory(): MealAnalysis[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as MealAnalysis[]) : [];
  } catch {
    return [];
  }
}

function loadStoredTarget(): number {
  try {
    const raw = window.localStorage.getItem(TARGET_STORAGE_KEY);
    const parsed = raw ? Number(raw) : NaN;
    return Number.isFinite(parsed) && parsed >= 500 ? parsed : DEFAULT_DAILY_TARGET;
  } catch {
    return DEFAULT_DAILY_TARGET;
  }
}

export const CalorieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<MealAnalysis | null>(null);
  const [history, setHistory] = useState<MealAnalysis[]>(() => loadStoredHistory());
  const [dailyTarget, setDailyTargetState] = useState<number>(() => loadStoredTarget());

  const persistHistory = useCallback((nextHistory: MealAnalysis[]) => {
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, []);

  const saveToHistory = useCallback(
    (meal: MealAnalysis): boolean => {
      let didSave = false;
      setHistory((prev) => {
        if (prev.some((entry) => entry.id === meal.id)) {
          return prev;
        }
        didSave = true;
        const next = [meal, ...prev];
        persistHistory(next);
        return next;
      });
      return didSave;
    },
    [persistHistory],
  );

  const removeFromHistory = useCallback(
    (id: string) => {
      setHistory((prev) => {
        const next = prev.filter((entry) => entry.id !== id);
        persistHistory(next);
        return next;
      });
    },
    [persistHistory],
  );

  const isSavedInHistory = useCallback((id: string) => history.some((entry) => entry.id === id), [history]);

  const setDailyTarget = useCallback((target: number) => {
    const clamped = Math.max(800, Math.min(6000, Math.round(target)));
    setDailyTargetState(clamped);
    try {
      window.localStorage.setItem(TARGET_STORAGE_KEY, String(clamped));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const value = useMemo<CalorieContextValue>(
    () => ({
      currentAnalysis,
      history,
      dailyTarget,
      setCurrentAnalysis,
      saveToHistory,
      removeFromHistory,
      isSavedInHistory,
      setDailyTarget,
    }),
    [currentAnalysis, history, dailyTarget, saveToHistory, removeFromHistory, isSavedInHistory, setDailyTarget],
  );

  return <CalorieContext.Provider value={value}>{children}</CalorieContext.Provider>;
};
