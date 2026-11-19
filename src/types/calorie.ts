export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export type FoodCategoryColor = 'orange' | 'green';

export interface FoodBreakdownItem {
  id: string;
  name: string;
  calories: number;
  color: FoodCategoryColor;
}

export interface MealAnalysis {
  id: string;
  imageUrl: string;
  totalCalories: number;
  marginPercent: number;
  items: FoodBreakdownItem[];
  createdAt: string;
}
