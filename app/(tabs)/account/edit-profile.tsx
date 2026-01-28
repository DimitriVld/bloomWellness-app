import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/hooks/useAuth';
import useUserProfile from '@/hooks/useUserProfile';
import { updateUserProfile } from '@/services/userService';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { ActivityLevel } from '@/types/user';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: 'sedentary', label: 'Sédentaire', desc: 'Peu ou pas d\'exercice' },
  { value: 'light', label: 'Légèrement actif', desc: 'Exercice 1-3 jours/sem' },
  { value: 'moderate', label: 'Modérément actif', desc: 'Exercice 3-5 jours/sem' },
  { value: 'active', label: 'Très actif', desc: 'Exercice 6-7 jours/sem' },
  { value: 'veryActive', label: 'Extrêmement actif', desc: 'Exercice intense quotidien' },
];

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile, refetch } = useUserProfile();

  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(profile?.firstName || '');
  const [lastName, setLastName] = useState(profile?.lastName || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    profile?.activityLevel || 'moderate'
  );

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

  const handlePickImage = async () => {
    Alert.alert('Bientôt', "L'upload de photo arrive bientôt !");
  };

  const getInitial = () => {
    return (firstName || profile?.email || 'U').charAt(0).toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + spacing.sm },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Modifier le profil</Text>

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
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handlePickImage}>
            <View style={styles.avatar}>
              {profile?.photoURL ? (
                <Image
                  source={{ uri: profile.photoURL }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarInitial}>{getInitial()}</Text>
              )}
            </View>
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color={colors.white} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Changer la photo</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ton prénom"
              style={styles.input}
              placeholderTextColor={colors.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ton nom"
              style={styles.input}
              placeholderTextColor={colors.gray}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={profile?.email || user?.email || ''}
              editable={false}
              style={[styles.input, styles.inputDisabled]}
            />
            <Text style={styles.helperText}>
              {"L'email ne peut pas être modifié"}
            </Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="75"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={colors.gray}
              />
            </View>

            <View style={{ width: spacing.sm }} />

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Taille (cm)</Text>
              <TextInput
                value={height}
                onChangeText={setHeight}
                placeholder="178"
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={colors.gray}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{"Niveau d'activité"}</Text>
            {ACTIVITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                onPress={() => setActivityLevel(level.value)}
                style={[
                  styles.activityOption,
                  activityLevel === level.value && styles.activityOptionSelected,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityLabel}>{level.label}</Text>
                  <Text style={styles.activityDesc}>{level.desc}</Text>
                </View>
                {activityLevel === level.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarInitial: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.beige,
  },
  changePhotoText: {
    fontSize: 13,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    fontSize: 15,
    borderWidth: 2,
    borderColor: colors.lightGray,
    color: colors.black,
  },
  inputDisabled: {
    backgroundColor: colors.lightGray,
    color: colors.gray,
  },
  helperText: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.xxs,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  activityOptionSelected: {
    borderColor: colors.primary,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  activityDesc: {
    fontSize: 12,
    color: colors.gray,
  },
});
