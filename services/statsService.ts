import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Meal } from '@/types/meal';
import { HydrationEntry } from '@/types/hydration';
import { DailyStats, WeeklyStats } from '@/types/stats';
import { UserGoals, DEFAULT_USER_GOALS } from '@/types/user';

/**
 * Calculer les stats du jour à partir des repas et de l'hydratation
 */
export const calculateDailyStats = (
  meals: Meal[],
  hydrationEntries: HydrationEntry[],
  goals: UserGoals = DEFAULT_USER_GOALS
): DailyStats => {
  // Calculer calories et macros depuis les repas
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + (meal.nutrition?.calories || meal.calories || 0),
      protein: acc.protein + (meal.nutrition?.protein || 0),
      carbs: acc.carbs + (meal.nutrition?.carbs || 0),
      fat: acc.fat + (meal.nutrition?.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Calculer hydratation totale en ml
  const totalWater = hydrationEntries.reduce(
    (acc, entry) => acc + entry.amount,
    0
  );

  return {
    date: new Date().toISOString().split('T')[0],
    calories: {
      consumed: Math.round(totals.calories),
      goal: goals.calories,
      percentage: Math.round((totals.calories / goals.calories) * 100),
    },
    macros: {
      protein: {
        value: Math.round(totals.protein * 10) / 10,
        goal: goals.protein,
      },
      carbs: {
        value: Math.round(totals.carbs * 10) / 10,
        goal: goals.carbs,
      },
      fat: {
        value: Math.round(totals.fat * 10) / 10,
        goal: goals.fat,
      },
    },
    water: {
      consumed: totalWater,
      goal: goals.water,
      percentage: Math.round((totalWater / goals.water) * 100),
    },
    mealsCount: meals.length,
  };
};

/**
 * Obtenir les stats de la semaine (7 derniers jours)
 */
export const getWeeklyStats = async (
  goals: UserGoals = DEFAULT_USER_GOALS
): Promise<{ data: WeeklyStats | null; error: string | null }> => {
  const user = auth.currentUser;
  if (!user) {
    return { data: null, error: 'Non authentifié' };
  }

  try {
    const today = new Date();
    const days: WeeklyStats['days'] = [];
    let totalCalories = 0;
    let totalMeals = 0;

    // Noms des jours en français (abrégé)
    const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

    // Générer les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const dateStr = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];

      // Récupérer les repas du jour
      const q = query(
        collection(db, 'meals'),
        where('userId', '==', user.uid),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );

      const snapshot = await getDocs(q);

      const dayCalories = snapshot.docs.reduce((acc, doc) => {
        const data = doc.data();
        return acc + (data.nutrition?.calories || data.calories || 0);
      }, 0);

      days.push({
        date: dateStr,
        dayName,
        calories: Math.round(dayCalories),
        isToday: i === 0,
      });

      totalCalories += dayCalories;
      totalMeals += snapshot.docs.length;
    }

    return {
      data: {
        days,
        averageCalories: Math.round(totalCalories / 7),
        totalMeals,
      },
      error: null,
    };
  } catch (error) {
    console.error('Erreur stats hebdo:', error);
    return { data: null, error: 'Erreur lors de la récupération des statistiques' };
  }
};
