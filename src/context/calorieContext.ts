import { createContext } from 'react';

import type { MealAnalysis } from '../types/calorie';

export interface CalorieContextValue {
  currentAnalysis: MealAnalysis | null;
  history: MealAnalysis[];
  dailyTarget: number;
  setCurrentAnalysis: (meal: MealAnalysis | null) => void;
  saveToHistory: (meal: MealAnalysis) => boolean;
  removeFromHistory: (id: string) => void;
  isSavedInHistory: (id: string) => boolean;
  setDailyTarget: (target: number) => void;
}

export const CalorieContext = createContext<CalorieContextValue | undefined>(undefined);
