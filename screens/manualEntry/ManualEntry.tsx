import MealTypeSelector from '@/components/MealTypeSelector';
import QuickAddChips from '@/components/QuickAddChips';
import { useAuth } from '@/hooks/useAuth';
import { saveMeal } from '@/services/mealService';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { FoodItem, MealType, NutritionInfo } from '@/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ManualEntryScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ mealType: MealType }>();

  const [mealType, setMealType] = useState<MealType>(params.mealType || 'lunch');
  const [name, setName] = useState('');
  const [portionSize, setPortionSize] = useState('100');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleQuickAdd = (food: FoodItem) => {
    setName(food.name);
    setPortionSize(String(food.defaultPortionSize));
    const portion = food.defaultPortionSize;
    const factor = portion / 100;
    setCalories(String(Math.round(food.nutritionPer100g.calories * factor)));
    setProtein(String(Math.round(food.nutritionPer100g.protein * factor)));
    setCarbs(String(Math.round(food.nutritionPer100g.carbs * factor)));
    setFat(String(Math.round(food.nutritionPer100g.fat * factor)));
  };

  const isValid = () => {
    return name.trim().length > 0 && calories.trim().length > 0;
  };

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté');
      return;
    }

    if (!isValid()) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le nom et les calories');
      return;
    }

    const portion = parseInt(portionSize) || 100;
    const cal = parseInt(calories) || 0;
    const prot = parseFloat(protein) || 0;
    const carb = parseFloat(carbs) || 0;
    const lipid = parseFloat(fat) || 0;

    const nutritionPer100g: NutritionInfo = {
      calories: Math.round((cal / portion) * 100),
      protein: Math.round((prot / portion) * 100 * 10) / 10,
      carbs: Math.round((carb / portion) * 100 * 10) / 10,
      fat: Math.round((lipid / portion) * 100 * 10) / 10,
    };

    const foodItem: FoodItem = {
      id: `manual-${Date.now()}`,
      name: name.trim(),
      emoji: '🍽️',
      nutritionPer100g,
      defaultPortionSize: portion,
      source: 'manual',
    };

    setIsSaving(true);
    const { error } = await saveMeal(user.uid, foodItem, portion, mealType, new Date());
    setIsSaving(false);

    if (error) {
      Alert.alert('Erreur', error);
      return;
    }

    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saisie manuelle</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <QuickAddChips onSelect={handleQuickAdd} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type de repas</Text>
          <MealTypeSelector selected={mealType} onSelect={setMealType} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Informations</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nom de l'aliment *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Salade César"
              placeholderTextColor={colors.gray}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Portion (g)</Text>
            <TextInput
              style={styles.input}
              placeholder="100"
              placeholderTextColor={colors.gray}
              value={portionSize}
              onChangeText={setPortionSize}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Valeurs nutritionnelles</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Calories (kcal) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={colors.gray}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.macrosRow}>
            <View style={styles.macroInput}>
              <Text style={styles.inputLabel}>Protéines (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={colors.gray}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.inputLabel}>Glucides (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={colors.gray}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.macroInput}>
              <Text style={styles.inputLabel}>Lipides (g)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={colors.gray}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!isValid() || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!isValid() || isSaving}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.black,
    marginBottom: spacing.xxxs,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.black,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  macroInput: {
    flex: 1,
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

export default ManualEntryScreen;
