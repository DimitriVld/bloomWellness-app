import MealTypeSelector from '@/components/MealTypeSelector';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { MealType } from '@/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MethodCardProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  variant?: 'primary' | 'default';
  badge?: string;
}

const MethodCard = ({
  icon,
  title,
  subtitle,
  onPress,
  variant = 'default',
  badge,
}: MethodCardProps) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[styles.methodCard, isPrimary && styles.methodCardPrimary]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.methodCardContent}>
        <View
          style={[
            styles.methodIconContainer,
            isPrimary && styles.methodIconContainerPrimary,
          ]}
        >
          <Text style={styles.methodIcon}>{icon}</Text>
        </View>
        <View style={styles.methodTextContainer}>
          <View style={styles.methodTitleRow}>
            <Text
              style={[styles.methodTitle, isPrimary && styles.methodTitlePrimary]}
            >
              {title}
            </Text>
            {badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.methodSubtitle,
              isPrimary && styles.methodSubtitlePrimary,
            ]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isPrimary ? colors.whiteOpacity70 : colors.gray}
      />
    </TouchableOpacity>
  );
};

const AddMealScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');

  const navigateWithMealType = (path: string) => {
    router.push({
      pathname: path as any,
      params: { mealType: selectedMealType },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajouter un repas</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type de repas</Text>
          <MealTypeSelector
            selected={selectedMealType}
            onSelect={setSelectedMealType}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Comment ajouter ?</Text>

          <View style={styles.methodsContainer}>
            <MethodCard
              icon="📸"
              title="Prendre une photo"
              subtitle="L'IA analyse automatiquement"
              onPress={() => navigateWithMealType('/(meal)/camera')}
              variant="primary"
              badge="✨ IA"
            />

            <MethodCard
              icon="🔍"
              title="Rechercher un aliment"
              subtitle="Base de données 2M+ produits"
              onPress={() => navigateWithMealType('/(meal)/food-search')}
            />

            <MethodCard
              icon="📊"
              title="Scanner un code-barres"
              subtitle="Produits emballés"
              onPress={() => navigateWithMealType('/(meal)/barcode-scanner')}
            />

            <MethodCard
              icon="✏️"
              title="Saisie manuelle"
              subtitle="Entrer les infos manuellement"
              onPress={() => navigateWithMealType('/(meal)/manual-entry')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
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
  methodsContainer: {
    gap: spacing.sm,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
  },
  methodCardPrimary: {
    backgroundColor: colors.primaryDark,
  },
  methodCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  methodIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconContainerPrimary: {
    backgroundColor: colors.whiteOpacity15,
  },
  methodIcon: {
    fontSize: 24,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  methodTitlePrimary: {
    color: colors.white,
  },
  methodSubtitle: {
    fontSize: 13,
    color: colors.gray,
    marginTop: 2,
  },
  methodSubtitlePrimary: {
    color: colors.whiteOpacity70,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
});

export default AddMealScreen;
