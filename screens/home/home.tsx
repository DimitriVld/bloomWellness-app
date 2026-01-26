import useHomeData from '@/hooks/useHomeData';
import useUserProfile from '@/hooks/useUserProfile';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import homeStyles from './styles';

import CircularProgress from '@/components/CircularProgress';
import ComingSoon from '@/components/ComingSoon';
import MacroCard from '@/components/MacroCard';
import MealItem from '@/components/MealItem';
import MiniCalendar from '@/components/MiniCalendar';
import PeriodSelector from '@/components/PeriodSelector';
import HydrationWidget from '@/components/HydrationWidget';
import WeeklyBarChart from '@/components/WeeklyBarChart';

const getFormattedDate = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  return new Date().toLocaleDateString('fr-FR', options);
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { profile } = useUserProfile();
  const {
    calorieData,
    macrosData,
    weeklyData,
    meals,
    selectedDate,
    period,
    isLoading,
    hydrationMl,
    hydrationGoalMl,
    hydrationPercentage,
    drinkOptions,
    addDrink,
    setSelectedDate,
    setPeriod,
  } = useHomeData();

  const greeting = profile?.displayName
    ? `Bonjour ${profile.displayName}`
    : 'Bonjour';

  const remainingCalories = calorieData.goal - calorieData.consumed;

  return (
    <View style={homeStyles.container}>
      <View style={[homeStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={homeStyles.greeting}>{greeting}</Text>
        <Text style={homeStyles.date}>{getFormattedDate()}</Text>
      </View>

      <ScrollView
        style={homeStyles.scrollView}
        contentContainerStyle={homeStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Calories Card */}
        <View style={homeStyles.caloriesCard}>
          <View style={homeStyles.caloriesInfo}>
            <View style={homeStyles.caloriesBadge}>
              <Text style={homeStyles.caloriesBadgeText}>
                🔥 {calorieData.percentage}% de l'objectif
              </Text>
            </View>
            <Text style={homeStyles.caloriesLabel}>Calories aujourd'hui</Text>
            <Text style={homeStyles.caloriesRemaining}>
              ⚡ Reste: {remainingCalories} kcal
            </Text>
          </View>
          <CircularProgress
            percentage={calorieData.percentage}
            calories={calorieData.consumed}
            goal={calorieData.goal}
          />
        </View>

        {/* Macro Cards */}
        <View style={homeStyles.macroRow}>
          <MacroCard
            icon="🥩"
            label="Protéines"
            value={macrosData.protein.value}
            goal={macrosData.protein.goal}
            unit="g"
            color={colors.red}
          />
          <MacroCard
            icon="🍞"
            label="Glucides"
            value={macrosData.carbs.value}
            goal={macrosData.carbs.goal}
            unit="g"
            color={colors.orange}
          />
          <MacroCard
            icon="🥑"
            label="Lipides"
            value={macrosData.fat.value}
            goal={macrosData.fat.goal}
            unit="g"
            color={colors.blue}
          />
        </View>

        {/* Hydration Widget */}
        <HydrationWidget
          current={hydrationMl}
          goal={hydrationGoalMl}
          percentage={hydrationPercentage}
          onAddDrink={addDrink}
          drinkOptions={drinkOptions}
        />

        {/* Calendar */}
        <MiniCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Period Selector */}
        <PeriodSelector selected={period} onSelect={setPeriod} />

        {/* Weekly Chart */}
        <WeeklyBarChart data={weeklyData} />

        {/* Meals Section */}
        <View style={homeStyles.mealsSection}>
          <View style={homeStyles.mealsSectionHeader}>
            <Text style={homeStyles.mealsSectionTitle}>Repas du jour</Text>
            <TouchableOpacity>
              <Text style={homeStyles.mealsSectionLink}>Voir tout →</Text>
            </TouchableOpacity>
          </View>
          <View style={homeStyles.mealsList}>
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ padding: spacing.md }}
              />
            ) : meals.length === 0 ? (
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.gray,
                  padding: spacing.md,
                }}
              >
                Aucun repas ajouté aujourd'hui
              </Text>
            ) : (
              meals.map((meal) => (
                <MealItem
                  key={meal.id}
                  emoji={meal.emoji || '🍽️'}
                  name={meal.name}
                  calories={meal.calories || meal.nutrition?.calories || 0}
                  time={meal.time}
                />
              ))
            )}
          </View>
        </View>

        {/* Coming Soon */}
        <ComingSoon
          emoji="👨‍🍳"
          title="Recettes healthy"
          description="Des idées de repas équilibrés adaptées à tes objectifs arrivent bientôt !"
        />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
