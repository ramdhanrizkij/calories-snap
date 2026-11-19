import type { MealAnalysis } from '../types/calorie';

/**
 * Generates a calorie estimation for a captured or uploaded food photo.
 * Replace the mock logic below with your Vision AI / backend API call
 * (e.g., sending `imageUrl` to your calorie detection endpoint).
 */
export async function estimateFoodCalories(imageUrl: string): Promise<MealAnalysis> {
  // Brief simulated processing delay for smooth UX feedback
  await new Promise((resolve) => setTimeout(resolve, 650));

  return {
    id: `meal_${Date.now()}`,
    imageUrl,
    totalCalories: 520,
    marginPercent: 15,
    items: [
      {
        id: 'item-1',
        name: 'Nasi Putih',
        calories: 200,
        color: 'orange',
      },
      {
        id: 'item-2',
        name: 'Ayam Panggang',
        calories: 180,
        color: 'green',
      },
      {
        id: 'item-3',
        name: 'Sayuran (Brokoli & Tomat)',
        calories: 60,
        color: 'green',
      },
    ],
    createdAt: new Date().toISOString(),
  };
}
