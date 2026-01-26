export interface UserGoals {
  calories: number; // ex: 2200
  protein: number; // ex: 130g
  carbs: number; // ex: 280g
  fat: number; // ex: 75g
  water: number; // ex: 2500ml
}

export const DEFAULT_USER_GOALS: UserGoals = {
  calories: 2200,
  protein: 130,
  carbs: 280,
  fat: 75,
  water: 2500,
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  goals?: UserGoals;
  weight?: number; // kg
  height?: number; // cm
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  createdAt: Date;
  updatedAt: Date;
}
