import { ActivityLevel, WeightGoal } from '@/types/user';

interface UserData {
  weight: number; // kg
  height: number; // cm
  age: number; // années
  gender: 'male' | 'female';
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

const GOAL_ADJUSTMENTS: Record<WeightGoal, number> = {
  lose: -500, // Déficit de 500 kcal
  maintain: 0,
  gain: 300, // Surplus de 300 kcal
};

/**
 * Calculer le BMR (Basal Metabolic Rate) avec Mifflin-St Jeor
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
};

/**
 * Calculer le TDEE (Total Daily Energy Expenditure)
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
};

/**
 * Calculer les objectifs caloriques et macros
 */
export const calculateGoals = (userData: UserData) => {
  const { weight, height, age, gender, activityLevel, weightGoal } = userData;

  // Calculer BMR et TDEE
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  // Ajuster selon l'objectif
  const calories = Math.round(tdee + GOAL_ADJUSTMENTS[weightGoal]);

  // Calculer les macros (répartition standard)
  // Protéines: 2g par kg de poids corporel (pour maintenir/construire muscle)
  // Lipides: 25% des calories
  // Glucides: le reste
  const protein = Math.round(weight * 2); // g
  const fat = Math.round((calories * 0.25) / 9); // g (1g fat = 9 kcal)
  const proteinCalories = protein * 4; // 1g protein = 4 kcal
  const fatCalories = fat * 9;
  const carbsCalories = calories - proteinCalories - fatCalories;
  const carbs = Math.round(carbsCalories / 4); // g (1g carb = 4 kcal)

  // Eau: 30-35ml par kg
  const water = Math.round(weight * 33);

  return {
    calories,
    protein,
    carbs,
    fat,
    water,
    bmr,
    tdee,
  };
};

/**
 * Calculer l'âge à partir de la date de naissance
 */
export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
