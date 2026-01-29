import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { updateUserProfile } from '@/services/userService';
import { ActivityLevel, Gender } from '@/types/user';

import ScreenHeader from '@/components/ScreenHeader';
import FormInput from '@/components/FormInput';
import SelectOption from '@/components/SelectOption';

import styles from './styles';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Sédentaire', desc: "Peu ou pas d'exercice" },
  { value: 'light', label: 'Légèrement actif', desc: 'Exercice 1-3 jours/sem' },
  { value: 'moderate', label: 'Modérément actif', desc: 'Exercice 3-5 jours/sem' },
  { value: 'active', label: 'Très actif', desc: 'Exercice 6-7 jours/sem' },
  { value: 'veryActive', label: 'Extrêmement actif', desc: 'Exercice intense quotidien' },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
  { value: 'other', label: 'Autre' },
];

const EditProfileScreen = () => {
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');

  // Synchroniser le state avec le profil quand il se charge
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '');
      setLastName(profile.lastName || '');
      setWeight(profile.weight?.toString() || '');
      setHeight(profile.height?.toString() || '');
      setBirthDate(profile.birthDate || '');
      setGender(profile.gender || 'male');
      setActivityLevel(profile.activityLevel || 'moderate');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const displayName =
        [firstName, lastName].filter(Boolean).join(' ') || undefined;

      const { success, error } = await updateUserProfile(user.uid, {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        displayName,
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
        birthDate: birthDate || undefined,
        gender,
        activityLevel,
      });

      if (success) {
        await refetch();
        Alert.alert('Succès', 'Profil mis à jour !');
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

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Modifier le profil"
        showSave
        onSave={handleSave}
        isSaving={isLoading}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Initiale avatar (non modifiable) */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(firstName || profile?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Formulaire */}
        <FormInput
          label="Prénom"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ton prénom"
        />

        <FormInput
          label="Nom"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Ton nom"
        />

        <FormInput
          label="Email"
          value={profile?.email || user?.email || ''}
          disabled
          hint="L'email ne peut pas être modifié"
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <FormInput
              label="Poids (kg)"
              value={weight}
              onChangeText={setWeight}
              placeholder="75"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.halfInput}>
            <FormInput
              label="Taille (cm)"
              value={height}
              onChangeText={setHeight}
              placeholder="178"
              keyboardType="numeric"
            />
          </View>
        </View>

        <FormInput
          label="Date de naissance"
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="AAAA-MM-JJ"
          hint="Format: 1990-05-15"
        />

        {/* Genre */}
        <Text style={styles.sectionLabel}>Genre</Text>
        <View style={styles.genderRow}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[
                styles.genderOption,
                gender === g.value && styles.genderOptionSelected,
              ]}
              onPress={() => setGender(g.value)}
            >
              <Text
                style={[
                  styles.genderLabel,
                  gender === g.value && styles.genderLabelSelected,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Niveau d'activité */}
        <Text style={styles.sectionLabel}>Niveau d'activité</Text>
        {ACTIVITY_LEVELS.map((level) => (
          <SelectOption
            key={level.value}
            label={level.label}
            description={level.desc}
            selected={activityLevel === level.value}
            onPress={() => setActivityLevel(level.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;
