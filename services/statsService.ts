import { collection, query, where, getDocs, Timestamp, limit, orderBy } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { Meal } from '@/types/meal';
import { HydrationEntry } from '@/types/hydration';
import { DailyStats, WeeklyStats } from '@/types/stats';
import { UserGoals, DEFAULT_USER_GOALS, UserStats } from '@/types/user';

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

/**
 * Calculer le streak actuel (jours consécutifs avec au moins 1 repas)
 * Optimisé: une seule requête Firestore au lieu de 365
 */
export const calculateStreak = async (
  userId: string
): Promise<{ current: number; longest: number }> => {
  // Récupérer tous les repas de l'année dernière en une seule requête
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  const q = query(
    collection(db, 'meals'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(oneYearAgo)),
    orderBy('date', 'desc')
  );

  const snapshot = await getDocs(q);

  if (snapshot.docs.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Créer un Set des dates avec des repas (format YYYY-MM-DD)
  const datesWithMeals = new Set<string>();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const date = data.date?.toDate?.() || new Date();
    datesWithMeals.add(date.toISOString().split('T')[0]);
  });

  // Calculer le streak actuel
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let currentStreak = 0;
  let longestStreak = 0;

  // Le streak actuel commence soit aujourd'hui, soit hier (si pas encore de repas aujourd'hui)
  let startDate = new Date(today);

  // Si pas de repas aujourd'hui, on commence le comptage depuis hier
  // Cela permet de ne pas "casser" le streak si l'utilisateur n'a pas encore mangé
  if (!datesWithMeals.has(todayStr)) {
    startDate = new Date(yesterday);
  }

  // Calculer le streak actuel en remontant dans le temps
  let checkDate = new Date(startDate);
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (datesWithMeals.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculer le plus long streak historique
  // Trier les dates et trouver la plus longue séquence consécutive
  const sortedDates = Array.from(datesWithMeals).sort().reverse();
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const currentDate = new Date(dateStr);

    if (prevDate === null) {
      tempStreak = 1;
    } else {
      // Vérifier si les dates sont consécutives
      const diffDays = Math.round(
        (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    prevDate = currentDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { current: currentStreak, longest: longestStreak };
};

/**
 * Calculer le pourcentage moyen d'objectif (7 derniers jours)
 * Optimisé: une seule requête Firestore au lieu de 7
 */
export const calculateAverageGoalPercentage = async (
  userId: string,
  calorieGoal: number
): Promise<number> => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  // Une seule requête pour les 7 derniers jours
  const q = query(
    collection(db, 'meals'),
    where('userId', '==', userId),
    where('date', '>=', Timestamp.fromDate(sevenDaysAgo)),
    where('date', '<=', Timestamp.fromDate(endOfToday))
  );

  const snapshot = await getDocs(q);

  if (snapshot.docs.length === 0) {
    return 0;
  }

  // Grouper les calories par jour
  const caloriesByDay = new Map<string, number>();

  snapshot.docs.forEach((doc) => {
    const meal = doc.data();
    const date = meal.date?.toDate?.() || new Date();
    const dateStr = date.toISOString().split('T')[0];
    const mealCalories = meal.nutrition?.calories || meal.calories || 0;

    caloriesByDay.set(dateStr, (caloriesByDay.get(dateStr) || 0) + mealCalories);
  });

  // Calculer le pourcentage moyen
  let totalPercentage = 0;
  caloriesByDay.forEach((dayCalories) => {
    const dayPercentage = Math.min(100, Math.round((dayCalories / calorieGoal) * 100));
    totalPercentage += dayPercentage;
  });

  return caloriesByDay.size > 0 ? Math.round(totalPercentage / caloriesByDay.size) : 0;
};

/**
 * Obtenir toutes les stats utilisateur
 */
export const getUserStats = async (
  userId: string,
  calorieGoal: number
): Promise<{ data: UserStats | null; error: string | null }> => {
  try {
    const [streak, averageGoal] = await Promise.all([
      calculateStreak(userId),
      calculateAverageGoalPercentage(userId, calorieGoal),
    ]);

    // Compter total repas
    const mealsQuery = query(
      collection(db, 'meals'),
      where('userId', '==', userId)
    );
    const mealsSnapshot = await getDocs(mealsQuery);

    // Compter jours uniques
    const uniqueDays = new Set(
      mealsSnapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.date?.toDate?.() || new Date();
        return date.toISOString().split('T')[0];
      })
    );

    return {
      data: {
        currentStreak: streak.current,
        longestStreak: streak.longest,
        averageGoalPercentage: averageGoal,
        totalMealsLogged: mealsSnapshot.docs.length,
        totalDaysLogged: uniqueDays.size,
        lastActiveDate: new Date().toISOString().split('T')[0],
      },
      error: null,
    };
  } catch (error) {
    console.error('Erreur stats utilisateur:', error);
    return { data: null, error: 'Erreur lors de la récupération des statistiques' };
  }
};
