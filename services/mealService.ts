import { db } from '@/config/firebase';
import { FoodItem, Meal, MealType, NutritionInfo } from '@/types/meal';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  limit as firestoreLimit,
} from 'firebase/firestore';

const MEALS_COLLECTION = 'meals';

export const calculateNutrition = (
  nutritionPer100g: NutritionInfo,
  portionSize: number
): NutritionInfo => {
  const factor = portionSize / 100;
  return {
    calories: Math.round(nutritionPer100g.calories * factor),
    protein: Math.round(nutritionPer100g.protein * factor * 10) / 10,
    carbs: Math.round(nutritionPer100g.carbs * factor * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * factor * 10) / 10,
    fiber: nutritionPer100g.fiber
      ? Math.round(nutritionPer100g.fiber * factor * 10) / 10
      : undefined,
    sugar: nutritionPer100g.sugar
      ? Math.round(nutritionPer100g.sugar * factor * 10) / 10
      : undefined,
    sodium: nutritionPer100g.sodium
      ? Math.round(nutritionPer100g.sodium * factor)
      : undefined,
  };
};

export const saveMeal = async (
  userId: string,
  foodItem: FoodItem,
  portionSize: number,
  mealType: MealType,
  date: Date
): Promise<{ data: Meal | null; error: string | null }> => {
  try {
    const nutrition = calculateNutrition(foodItem.nutritionPer100g, portionSize);
    const time = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const mealData = {
      userId,
      foodItem,
      portionSize,
      nutrition,
      mealType,
      date: Timestamp.fromDate(date),
      time,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      emoji: foodItem.emoji,
      name: foodItem.name,
      calories: nutrition.calories,
    };

    const docRef = await addDoc(collection(db, MEALS_COLLECTION), mealData);

    return {
      data: {
        id: docRef.id,
        ...mealData,
        date,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Meal,
      error: null,
    };
  } catch (error) {
    console.error('Erreur sauvegarde repas:', error);
    return { data: null, error: "Erreur lors de l'enregistrement du repas" };
  }
};

export const getMealsByDate = async (
  userId: string,
  date: Date
): Promise<{ data: Meal[]; error: string | null }> => {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, MEALS_COLLECTION),
      where('userId', '==', userId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    const meals = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Meal;
    });

    return { data: meals, error: null };
  } catch (error) {
    console.error('Erreur récupération repas:', error);
    return { data: [], error: 'Erreur lors de la récupération des repas' };
  }
};

export const getRecentMeals = async (
  userId: string,
  maxResults: number = 10
): Promise<{ data: Meal[]; error: string | null }> => {
  try {
    const q = query(
      collection(db, MEALS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(maxResults)
    );

    const snapshot = await getDocs(q);
    const meals = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Meal;
    });

    return { data: meals, error: null };
  } catch (error) {
    console.error('Erreur récupération repas récents:', error);
    return { data: [], error: 'Erreur lors de la récupération des repas' };
  }
};

export const getTodayNutritionSummary = async (
  userId: string
): Promise<{ data: NutritionInfo | null; error: string | null }> => {
  const { data: meals, error } = await getMealsByDate(userId, new Date());

  if (error) {
    return { data: null, error };
  }

  const summary: NutritionInfo = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.nutrition?.calories || meal.calories || 0),
      protein: acc.protein + (meal.nutrition?.protein || 0),
      carbs: acc.carbs + (meal.nutrition?.carbs || 0),
      fat: acc.fat + (meal.nutrition?.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return { data: summary, error: null };
};
