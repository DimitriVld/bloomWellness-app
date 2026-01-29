import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { updateUserGoals, updateUserProfile } from '@/services/userService';
import { calculateGoals, calculateAge } from '@/utils/calorieCalculator';
import { WeightGoal, UserGoals } from '@/types/user';

import ScreenHeader from '@/components/ScreenHeader';

import styles from './styles';
import { colors } from '@/style/colors';

const WEIGHT_GOALS: { value: WeightGoal; emoji: string; label: string }[] = [
  { value: 'lose', emoji: '📉', label: 'Perdre' },
  { value: 'maintain', emoji: '⚖️', label: 'Maintenir' },
  { value: 'gain', emoji: '📈', label: 'Prendre' },
];

const DEFAULT_GOALS: UserGoals = {
  calories: 2200,
  protein: 130,
  carbs: 280,
  fat: 75,
  water: 2500,
};

const EditGoalsScreen = () => {
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>('maintain');
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);

  // Synchroniser le state avec le profil quand il se charge
  useEffect(() => {
    if (profile) {
      setWeightGoal(profile.weightGoal || 'maintain');
      if (profile.goals) {
        setGoals(profile.goals);
      }
    }
  }, [profile]);

  const canAutoCalculate =
    profile?.weight &&
    profile?.height &&
    profile?.birthDate &&
    profile?.gender &&
    profile?.gender !== 'other';

  // Recalculer automatiquement
  useEffect(() => {
    if (
      autoCalculate &&
      canAutoCalculate &&
      profile?.weight &&
      profile?.height &&
      profile?.birthDate &&
      profile?.gender
    ) {
      const calculated = calculateGoals({
        weight: profile.weight,
        height: profile.height,
        age: calculateAge(profile.birthDate),
        gender: profile.gender as 'male' | 'female',
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
  }, [autoCalculate, weightGoal, profile, canAutoCalculate]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Sauvegarder weightGoal dans le profil
      await updateUserProfile(user.uid, { weightGoal });

      // Sauvegarder les goals
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
      <ScreenHeader
        title="Objectifs"
        showSave
        onSave={handleSave}
        isSaving={isLoading}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Auto-calculate toggle */}
        {canAutoCalculate && (
          <View style={styles.autoCalculateCard}>
            <Text style={styles.autoCalculateEmoji}>🧮</Text>
            <View style={styles.autoCalculateInfo}>
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
            onPress={() => router.push('/(tabs)/account/edit-profile')}
            style={styles.warningCard}
          >
            <Text style={styles.warningTitle}>Complète ton profil</Text>
            <Text style={styles.warningDesc}>
              Ajoute ton poids, taille, date de naissance et genre pour activer
              le calcul automatique
            </Text>
          </TouchableOpacity>
        )}

        {/* Weight goal selector */}
        <Text style={styles.sectionLabel}>Mon objectif</Text>
        <View style={styles.goalRow}>
          {WEIGHT_GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.value}
              onPress={() => setWeightGoal(goal.value)}
              style={[
                styles.goalOption,
                weightGoal === goal.value && styles.goalOptionSelected,
              ]}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <Text
                style={[
                  styles.goalLabel,
                  weightGoal === goal.value && styles.goalLabelSelected,
                ]}
              >
                {goal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calories */}
        <View style={styles.caloriesCard}>
          <Text style={styles.caloriesLabel}>Calories</Text>
          <View style={styles.caloriesRow}>
            <TextInput
              value={goals.calories.toString()}
              onChangeText={(v) => updateGoal('calories', v)}
              keyboardType="numeric"
              editable={!autoCalculate}
              style={[
                styles.caloriesInput,
                autoCalculate && styles.inputDisabled,
              ]}
            />
            <Text style={styles.caloriesUnit}>kcal</Text>
          </View>
        </View>

        {/* Macros */}
        <Text style={styles.sectionLabel}>Répartition des macros</Text>

        {[
          { key: 'protein' as keyof UserGoals, emoji: '🥩', label: 'Protéines', color: '#EF4444' },
          { key: 'carbs' as keyof UserGoals, emoji: '🍞', label: 'Glucides', color: '#F59E0B' },
          { key: 'fat' as keyof UserGoals, emoji: '🥑', label: 'Lipides', color: '#3B82F6' },
        ].map((macro) => (
          <View key={macro.key} style={styles.macroRow}>
            <Text style={styles.macroEmoji}>{macro.emoji}</Text>
            <Text style={styles.macroLabel}>{macro.label}</Text>
            <TextInput
              value={goals[macro.key].toString()}
              onChangeText={(v) => updateGoal(macro.key, v)}
              keyboardType="numeric"
              editable={!autoCalculate}
              style={[
                styles.macroInput,
                { color: macro.color },
                autoCalculate && styles.inputDisabled,
              ]}
            />
            <Text style={styles.macroUnit}>g</Text>
          </View>
        ))}

        {/* Water */}
        <View style={styles.macroRow}>
          <Text style={styles.macroEmoji}>💧</Text>
          <Text style={styles.macroLabel}>Hydratation</Text>
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
};

export default EditGoalsScreen;
