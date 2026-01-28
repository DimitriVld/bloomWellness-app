import { Ionicons } from '@expo/vector-icons';
import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import useUserProfile from '@/hooks/useUserProfile';
import { updateUserGoals, updateUserProfile } from '@/services/userService';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { UserGoals, WeightGoal } from '@/types/user';
import { calculateAge, calculateGoals } from '@/utils/calorieCalculator';

const WEIGHT_GOALS: { value: WeightGoal; emoji: string; label: string }[] = [
  { value: 'lose', emoji: '📉', label: 'Perdre' },
  { value: 'maintain', emoji: '⚖️', label: 'Maintenir' },
  { value: 'gain', emoji: '📈', label: 'Prendre' },
];

export default function EditGoalsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>(
    profile?.weightGoal || 'maintain'
  );

  const [goals, setGoals] = useState<UserGoals>(
    profile?.goals || {
      calories: 2200,
      protein: 130,
      carbs: 280,
      fat: 75,
      water: 2500,
    }
  );

  const canAutoCalculate =
    profile?.weight &&
    profile?.height &&
    profile?.birthDate &&
    profile?.gender &&
    profile?.gender !== 'other';

  // Recalculer quand autoCalculate ou weightGoal change
  useEffect(() => {
    // Validation explicite du genre pour le calcul TDEE
    const isValidGender = (g: string | undefined): g is 'male' | 'female' => {
      return g === 'male' || g === 'female';
    };

    if (
      autoCalculate &&
      canAutoCalculate &&
      profile?.weight &&
      profile?.height &&
      profile?.birthDate &&
      isValidGender(profile?.gender)
    ) {
      const calculated = calculateGoals({
        weight: profile.weight,
        height: profile.height,
        age: calculateAge(profile.birthDate),
        gender: profile.gender,
        activityLevel: profile.activityLevel || 'moderate',
        weightGoal,
      });

      setGoals({
        calories: calculated.calories,
        protein: calculated.protein,
        carbs: calculated.carbs,
        fat: calculated.fat,
        water: calculated.water,
      });
    }
  }, [autoCalculate, weightGoal, canAutoCalculate, profile]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Sauvegarder le weightGoal dans le profil
      await updateUserProfile(user.uid, { weightGoal });

      // Sauvegarder les objectifs
      const { success, error } = await updateUserGoals(user.uid, goals);

      if (success) {
        await refetch();
        Alert.alert('Succès', 'Objectifs mis à jour !');
        router.back();
      } else {
        Alert.alert('Erreur', error || 'Une erreur est survenue');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoal = (key: keyof UserGoals, value: string) => {
    const numValue = parseInt(value) || 0;
    setGoals((prev) => ({ ...prev, [key]: numValue }));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Objectifs</Text>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Sauver</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Auto-calculate toggle */}
        {canAutoCalculate && (
          <View style={styles.autoCalculateCard}>
            <Text style={styles.autoCalculateEmoji}>🧮</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.autoCalculateTitle}>Calcul automatique</Text>
              <Text style={styles.autoCalculateDesc}>
                Basé sur ton profil et objectif
              </Text>
            </View>
            <Switch
              value={autoCalculate}
              onValueChange={setAutoCalculate}
              trackColor={{ false: colors.lightGray, true: colors.lightPrimary }}
              thumbColor={autoCalculate ? colors.primary : colors.gray}
            />
          </View>
        )}

        {!canAutoCalculate && (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/account/edit-profile' as Href)}
            style={styles.warningCard}
          >
            <Text style={styles.warningTitle}>⚠️ Complète ton profil</Text>
            <Text style={styles.warningDesc}>
              Ajoute ton poids, taille, date de naissance et genre pour activer
              le calcul automatique
            </Text>
          </TouchableOpacity>
        )}

        {/* Weight goal selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Mon objectif</Text>
          <View style={styles.weightGoalRow}>
            {WEIGHT_GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.value}
                onPress={() => setWeightGoal(goal.value)}
                style={[
                  styles.weightGoalOption,
                  weightGoal === goal.value && styles.weightGoalOptionSelected,
                ]}
              >
                <Text style={styles.weightGoalEmoji}>{goal.emoji}</Text>
                <Text
                  style={[
                    styles.weightGoalLabel,
                    weightGoal === goal.value && styles.weightGoalLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Calories */}
        <View style={styles.caloriesCard}>
          <Text style={styles.caloriesLabel}>🔥 Calories</Text>
          <View style={styles.caloriesInputRow}>
            <TextInput
              value={goals.calories.toString()}
              onChangeText={(v) => updateGoal('calories', v)}
              keyboardType="numeric"
              editable={!autoCalculate}
              style={styles.caloriesInput}
            />
            <Text style={styles.caloriesUnit}>kcal</Text>
          </View>
        </View>

        {/* Macros */}
        <Text style={styles.sectionLabel}>Répartition des macros</Text>

        {[
          { key: 'protein' as keyof UserGoals, emoji: '🥩', label: 'Protéines', color: colors.red },
          { key: 'carbs' as keyof UserGoals, emoji: '🍞', label: 'Glucides', color: colors.orange },
          { key: 'fat' as keyof UserGoals, emoji: '🥑', label: 'Lipides', color: colors.blue },
        ].map((macro) => (
          <View key={macro.key} style={styles.macroRow}>
            <Text style={styles.macroEmoji}>{macro.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.macroLabel}>{macro.label}</Text>
            </View>
            <TextInput
              value={goals[macro.key].toString()}
              onChangeText={(v) => updateGoal(macro.key, v)}
              keyboardType="numeric"
              editable={!autoCalculate}
              style={[
                styles.macroInput,
                { color: macro.color },
                autoCalculate && styles.macroInputDisabled,
              ]}
            />
            <Text style={styles.macroUnit}>g</Text>
          </View>
        ))}

        {/* Water */}
        <View style={[styles.macroRow, { marginTop: spacing.sm }]}>
          <Text style={styles.macroEmoji}>💧</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.macroLabel}>Hydratation</Text>
          </View>
          <TextInput
            value={goals.water.toString()}
            onChangeText={(v) => updateGoal('water', v)}
            keyboardType="numeric"
            style={[styles.macroInput, { color: '#06B6D4' }]}
          />
          <Text style={styles.macroUnit}>ml</Text>
        </View>
      </ScrollView>
    </View>
  );
}

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
    paddingBottom: spacing.sm,
  },
  backButton: {
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
    color: colors.primaryDark,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 150,
  },
  autoCalculateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  autoCalculateEmoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  autoCalculateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  autoCalculateDesc: {
    fontSize: 12,
    color: colors.gray,
  },
  warningCard: {
    backgroundColor: `${colors.orange}15`,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.orange,
  },
  warningDesc: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  weightGoalRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  weightGoalOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  weightGoalOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weightGoalEmoji: {
    fontSize: 24,
  },
  weightGoalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
    marginTop: 4,
  },
  weightGoalLabelSelected: {
    color: colors.white,
  },
  caloriesCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  caloriesLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.sm,
  },
  caloriesInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.primaryDark,
  },
  caloriesUnit: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  macroEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  macroInput: {
    width: 70,
    backgroundColor: colors.beige,
    borderRadius: 10,
    padding: spacing.sm,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  macroInputDisabled: {
    backgroundColor: colors.lightGray,
  },
  macroUnit: {
    fontSize: 13,
    color: colors.gray,
    marginLeft: 6,
  },
});
