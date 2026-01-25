import MealTypeSelector from '@/components/MealTypeSelector';
import PortionSlider from '@/components/PortionSlider';
import { useAuth } from '@/hooks/useAuth';
import { analyzeFoodImage } from '@/services/foodAnalysisService';
import { calculateNutrition, saveMeal } from '@/services/mealService';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { FoodItem, MealType, NutritionInfo } from '@/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
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

interface FoodSelection {
  food: FoodItem;
  selected: boolean;
  portionSize: number;
}

const MealResultScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{
    mealType: MealType;
    imageBase64: string;
    imageUri: string;
  }>();

  const mealType = params.mealType || 'lunch';
  const [selectedMealType, setSelectedMealType] = useState<MealType>(mealType);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [foodSelections, setFoodSelections] = useState<FoodSelection[]>([]);

  useEffect(() => {
    const analyze = async () => {
      if (!params.imageBase64) {
        setError('Image non disponible');
        setIsAnalyzing(false);
        return;
      }

      const { data, error: analysisError } = await analyzeFoodImage(
        params.imageBase64
      );

      if (analysisError) {
        setError(analysisError);
        setIsAnalyzing(false);
        return;
      }

      if (data) {
        setConfidence(data.confidence);
        setFoodSelections(
          data.foods.map((food) => ({
            food,
            selected: true,
            portionSize: food.defaultPortionSize,
          }))
        );
      }

      setIsAnalyzing(false);
    };

    analyze();
  }, [params.imageBase64]);

  const toggleFoodSelection = (index: number) => {
    setFoodSelections((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updatePortionSize = (index: number, portion: number) => {
    setFoodSelections((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, portionSize: portion } : item
      )
    );
  };

  const totalNutrition: NutritionInfo = useMemo(() => {
    return foodSelections
      .filter((item) => item.selected)
      .reduce(
        (acc, item) => {
          const nutrition = calculateNutrition(
            item.food.nutritionPer100g,
            item.portionSize
          );
          return {
            calories: acc.calories + nutrition.calories,
            protein: acc.protein + nutrition.protein,
            carbs: acc.carbs + nutrition.carbs,
            fat: acc.fat + nutrition.fat,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
  }, [foodSelections]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté');
      return;
    }

    const selectedFoods = foodSelections.filter((item) => item.selected);
    if (selectedFoods.length === 0) {
      Alert.alert('Erreur', 'Sélectionne au moins un aliment');
      return;
    }

    setIsSaving(true);

    for (const item of selectedFoods) {
      const { error: saveError } = await saveMeal(
        user.uid,
        item.food,
        item.portionSize,
        selectedMealType,
        new Date()
      );

      if (saveError) {
        Alert.alert('Erreur', saveError);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    router.replace('/(tabs)/home');
  };

  const handleRetry = () => {
    router.back();
  };

  if (isAnalyzing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Image
          source={{ uri: params.imageUri }}
          style={styles.analyzeImage}
          blurRadius={5}
        />
        <View style={styles.analyzeOverlay}>
          <View style={styles.analyzeCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.analyzeTitle}>Analyse en cours...</Text>
            <View style={styles.analyzeSteps}>
              <View style={styles.analyzeStep}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                <Text style={styles.analyzeStepText}>Détection des aliments</Text>
              </View>
              <View style={styles.analyzeStep}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.analyzeStepText}>Estimation nutritionnelle</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingTop: insets.top },
        ]}
      >
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle" size={64} color={colors.red} />
          <Text style={styles.errorTitle}>Analyse impossible</Text>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.errorButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Reprendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() =>
                router.replace({
                  pathname: '/(meal)/manual-entry',
                  params: { mealType: selectedMealType },
                })
              }
            >
              <Text style={styles.manualButtonText}>Saisie manuelle</Text>
            </TouchableOpacity>
          </View>
        </View>
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
        <Text style={styles.headerTitle}>Résultats</Text>
        <View style={styles.confidenceBadge}>
          <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          <Text style={styles.confidenceText}>
            {Math.round(confidence * 100)}%
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: params.imageUri }} style={styles.resultImage} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type de repas</Text>
          <MealTypeSelector
            selected={selectedMealType}
            onSelect={setSelectedMealType}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Aliments détectés ({foodSelections.filter((f) => f.selected).length})
          </Text>
          {foodSelections.map((item, index) => (
            <View key={item.food.id} style={styles.foodItem}>
              <TouchableOpacity
                style={styles.foodHeader}
                onPress={() => toggleFoodSelection(index)}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.selected && styles.checkboxSelected,
                  ]}
                >
                  {item.selected && (
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  )}
                </View>
                <Text style={styles.foodEmoji}>{item.food.emoji}</Text>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.food.name}</Text>
                  <Text style={styles.foodCalories}>
                    {Math.round(
                      (item.food.nutritionPer100g.calories * item.portionSize) /
                        100
                    )}{' '}
                    kcal
                  </Text>
                </View>
              </TouchableOpacity>
              {item.selected && (
                <View style={styles.portionContainer}>
                  <PortionSlider
                    value={item.portionSize}
                    onChange={(value) => updatePortionSize(index, value)}
                    min={10}
                    max={500}
                    step={10}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total</Text>
          <View style={styles.totalRow}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totalNutrition.calories}</Text>
              <Text style={styles.totalUnit}>kcal</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totalNutrition.protein}g</Text>
              <Text style={styles.totalUnit}>prot</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totalNutrition.carbs}g</Text>
              <Text style={styles.totalUnit}>gluc</Text>
            </View>
            <View style={styles.totalDivider} />
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totalNutrition.fat}g</Text>
              <Text style={styles.totalUnit}>lip</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving || foodSelections.filter((f) => f.selected).length === 0}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Ionicons name="add-circle" size={24} color={colors.white} />
              <Text style={styles.saveButtonText}>Enregistrer</Text>
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
  analyzeImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  analyzeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  analyzeCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  analyzeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  analyzeSteps: {
    gap: spacing.sm,
  },
  analyzeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  analyzeStepText: {
    fontSize: 14,
    color: colors.gray,
  },
  errorCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  errorButtons: {
    width: '100%',
    gap: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  manualButton: {
    borderRadius: 12,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  manualButtonText: {
    fontSize: 14,
    color: colors.primary,
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
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryOpacity20,
    borderRadius: 12,
    paddingVertical: spacing.xxxs,
    paddingHorizontal: spacing.sm,
    gap: spacing.xxxs,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  imageContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  resultImage: {
    width: '100%',
    height: '100%',
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
  foodItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  foodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    gap: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  foodEmoji: {
    fontSize: 28,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
  foodCalories: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  portionContainer: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  totalCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 20,
    padding: spacing.md,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.whiteOpacity70,
    marginBottom: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  totalUnit: {
    fontSize: 12,
    color: colors.whiteOpacity70,
  },
  totalDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.whiteOpacity15,
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
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default MealResultScreen;
