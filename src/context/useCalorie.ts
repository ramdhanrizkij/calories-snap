import { useContext } from 'react';

import { CalorieContext, type CalorieContextValue } from './calorieContext';

export function useCalorie(): CalorieContextValue {
  const ctx = useContext(CalorieContext);
  if (!ctx) {
    throw new Error('useCalorie must be used within a CalorieProvider');
  }
  return ctx;
}
