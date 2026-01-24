import GoalCard from '@/components/GoalCard';
import MenuItem from '@/components/MenuItem';
import ProfileHeader from '@/components/ProfileHeader';
import StatCard from '@/components/StatCard';
import useUserProfile from '@/hooks/useUserProfile';
import { signOut } from '@/services/authService';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';

const AccountScreen = () => {
  const insets = useSafeAreaInsets();
  const { profile, isLoading } = useUserProfile();

  // Données mock (à remplacer plus tard)
  const stats = {
    streak: 12,
    averageGoal: 84,
  };

  const goals = {
    calories: 2200,
    protein: 130,
    carbs: 280,
    fat: 75,
  };

  const handleEditProfile = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  const handleEditGoals = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Déconnexion',
      'Es-tu sûr de vouloir te déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleComingSoon = () => {
    Alert.alert('Bientôt', 'Cette fonctionnalité arrive bientôt !');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const displayName = profile?.displayName || profile?.email?.split('@')[0] || 'Utilisateur';
  const email = profile?.email || '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingBottom: 150,
        paddingHorizontal: spacing.md,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <ProfileHeader
        name={displayName}
        email={email}
        avatarUrl={profile?.photoURL || undefined}
        onEditPress={handleEditProfile}
      />

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <StatCard icon="🔥" value={String(stats.streak)} label="Jours de streak" />
        <View style={styles.statsSpacer} />
        <StatCard icon="📊" value={`${stats.averageGoal}%`} label="Objectif moyen" />
      </View>

      {/* Goal Card */}
      <View style={styles.goalCardContainer}>
        <GoalCard
          title="Objectif quotidien"
          calories={goals.calories}
          protein={goals.protein}
          carbs={goals.carbs}
          fat={goals.fat}
          onEditPress={handleEditGoals}
        />
      </View>

      {/* Section Préférences */}
      <Text style={styles.sectionTitle}>PRÉFÉRENCES</Text>
      <MenuItem icon="person-outline" label="Modifier le profil" onPress={handleEditProfile} />
      <MenuItem icon="flag-outline" label="Objectifs" value={`${goals.calories} kcal`} onPress={handleEditGoals} />
      <MenuItem icon="notifications-outline" label="Notifications" onPress={handleComingSoon} />
      <MenuItem icon="moon-outline" label="Apparence" value="Auto" onPress={handleComingSoon} />

      {/* Section Autres */}
      <Text style={styles.sectionTitle}>AUTRES</Text>
      <MenuItem icon="help-circle-outline" label="Aide & Support" onPress={handleComingSoon} />
      <MenuItem icon="document-text-outline" label="Conditions d'utilisation" onPress={handleComingSoon} />
      <MenuItem icon="shield-checkmark-outline" label="Politique de confidentialité" onPress={handleComingSoon} />

      {/* Déconnexion */}
      <View style={styles.logoutContainer}>
        <MenuItem
          icon="log-out-outline"
          label="Déconnexion"
          onPress={handleSignOut}
          danger
          showChevron={false}
        />
      </View>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

export default AccountScreen;
