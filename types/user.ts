export type ActivityLevel =
  | 'sedentary'    // Peu ou pas d'exercice
  | 'light'        // Exercice léger 1-3 jours/sem
  | 'moderate'     // Exercice modéré 3-5 jours/sem
  | 'active'       // Exercice intense 6-7 jours/sem
  | 'veryActive';  // Exercice très intense + travail physique

export type WeightGoal = 'lose' | 'maintain' | 'gain';

export type Gender = 'male' | 'female' | 'other';

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
  displayName?: string | null;
  firstName?: string;
  lastName?: string;
  photoURL?: string | null;

  // Données physiques
  weight?: number; // kg
  height?: number; // cm
  birthDate?: string; // YYYY-MM-DD
  gender?: Gender;
  activityLevel?: ActivityLevel;
  weightGoal?: WeightGoal;

  // Objectifs
  goals?: UserGoals;

  // Préférences
  notificationsEnabled?: boolean;

  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  averageGoalPercentage: number; // 7 derniers jours
  totalMealsLogged: number;
  totalDaysLogged: number;
  lastActiveDate: string;
}

export interface NotificationSettings {
  enabled: boolean;
  hydration: {
    enabled: boolean;
    intervalHours: number; // Ex: 2
    startHour: number; // Ex: 8
    endHour: number; // Ex: 20
  };
  meals: {
    enabled: boolean;
    times: string[]; // Ex: ['08:00', '12:00', '19:00']
  };
  dailySummary: {
    enabled: boolean;
    time: string; // Ex: '21:00'
  };
  streak: {
    enabled: boolean;
    time: string; // Ex: '20:00'
  };
  goals: {
    enabled: boolean;
  };
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  hydration: {
    enabled: true,
    intervalHours: 2,
    startHour: 8,
    endHour: 20,
  },
  meals: {
    enabled: true,
    times: ['08:00', '12:00', '19:00'],
  },
  dailySummary: {
    enabled: false,
    time: '21:00',
  },
  streak: {
    enabled: true,
    time: '20:00',
  },
  goals: {
    enabled: true,
  },
};
