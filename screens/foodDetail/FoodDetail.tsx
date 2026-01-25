import MealTypeSelector from '@/components/MealTypeSelector';
import NutritionLabel from '@/components/NutritionLabel';
import PortionSlider from '@/components/PortionSlider';
import { useAuth } from '@/hooks/useAuth';
import { calculateNutrition, saveMeal } from '@/services/mealService';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { FoodItem, MealType, NutritionInfo } from '@/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FoodDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ mealType: MealType; foodData: string }>();

  const food: FoodItem = useMemo(() => {
    try {
      return JSON.parse(params.foodData || '{}');
    } catch {
      return null;
    }
  }, [params.foodData]);

  const [mealType, setMealType] = useState<MealType>(params.mealType || 'lunch');
  const [portionSize, setPortionSize] = useState(food?.defaultPortionSize || 100);
  const [isSaving, setIsSaving] = useState(false);

  const calculatedNutrition: NutritionInfo = useMemo(() => {
    if (!food) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return calculateNutrition(food.nutritionPer100g, portionSize);
  }, [food, portionSize]);

  const handleSave = async () => {
    if (!user || !food) {
      Alert.alert('Erreur', 'Impossible de sauvegarder le repas');
      return;
    }

    setIsSaving(true);
    const { data, error } = await saveMeal(
      user.uid,
      food,
      portionSize,
      mealType,
      new Date()
    );
    setIsSaving(false);

    if (error) {
      Alert.alert('Erreur', error);
      return;
    }

    router.replace('/(tabs)/home');
  };

  if (!food) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Aliment non trouvé</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
            {food.imageUrl ? (
              <Image source={{ uri: food.imageUrl }} style={styles.image} />
            ) : (
              <Text style={styles.emoji}>{food.emoji}</Text>
            )}
          </View>
          <Text style={styles.foodName}>{food.name}</Text>
          {food.brand && <Text style={styles.foodBrand}>{food.brand}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type de repas</Text>
          <MealTypeSelector selected={mealType} onSelect={setMealType} />
        </View>

        <View style={styles.section}>
          <PortionSlider
            value={portionSize}
            onChange={setPortionSize}
            min={10}
            max={500}
            step={10}
          />
        </View>

        <View style={styles.section}>
          <NutritionLabel
            nutrition={calculatedNutrition}
            portionSize={portionSize}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="add-circle" size={24} color={colors.white} />
              <Text style={styles.saveButtonText}>Ajouter au journal</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 60,
  },
  foodName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
  },
  foodBrand: {
    fontSize: 14,
    color: colors.gray,
    marginTop: spacing.xxxs,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.beige,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    gap: spacing.xxs,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  errorText: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: spacing.md,
  },
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});

export default FoodDetailScreen;
