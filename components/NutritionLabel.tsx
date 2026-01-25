import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { NutritionInfo } from '@/types/meal';
import { View, Text, StyleSheet } from 'react-native';

interface NutritionLabelProps {
  nutrition: NutritionInfo;
  portionSize: number;
}

interface NutrientRowProps {
  label: string;
  value: number;
  unit: string;
  color: string;
  icon: string;
}

const NutrientRow = ({ label, value, unit, color, icon }: NutrientRowProps) => (
  <View style={styles.nutrientRow}>
    <View style={[styles.nutrientIcon, { backgroundColor: `${color}15` }]}>
      <Text style={styles.nutrientEmoji}>{icon}</Text>
    </View>
    <Text style={styles.nutrientLabel}>{label}</Text>
    <Text style={[styles.nutrientValue, { color }]}>
      {value}
      <Text style={styles.nutrientUnit}>{unit}</Text>
    </Text>
  </View>
);

const NutritionLabel = ({ nutrition, portionSize }: NutritionLabelProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Valeurs nutritionnelles</Text>
        <Text style={styles.portion}>pour {portionSize}g</Text>
      </View>

      <View style={styles.caloriesCard}>
        <Text style={styles.caloriesIcon}>🔥</Text>
        <View style={styles.caloriesInfo}>
          <Text style={styles.caloriesValue}>{nutrition.calories}</Text>
          <Text style={styles.caloriesUnit}>kcal</Text>
        </View>
      </View>

      <View style={styles.macrosGrid}>
        <NutrientRow
          label="Protéines"
          value={nutrition.protein}
          unit="g"
          color={colors.blue}
          icon="🥩"
        />
        <NutrientRow
          label="Glucides"
          value={nutrition.carbs}
          unit="g"
          color={colors.orange}
          icon="🍞"
        />
        <NutrientRow
          label="Lipides"
          value={nutrition.fat}
          unit="g"
          color={colors.purple}
          icon="🥑"
        />
      </View>

      {(nutrition.fiber !== undefined || nutrition.sugar !== undefined) && (
        <View style={styles.extrasContainer}>
          {nutrition.fiber !== undefined && (
            <View style={styles.extraItem}>
              <Text style={styles.extraLabel}>Fibres</Text>
              <Text style={styles.extraValue}>{nutrition.fiber}g</Text>
            </View>
          )}
          {nutrition.sugar !== undefined && (
            <View style={styles.extraItem}>
              <Text style={styles.extraLabel}>Sucres</Text>
              <Text style={styles.extraValue}>{nutrition.sugar}g</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  portion: {
    fontSize: 12,
    color: colors.gray,
  },
  caloriesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  caloriesIcon: {
    fontSize: 28,
  },
  caloriesInfo: {
    flex: 1,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
  },
  caloriesUnit: {
    fontSize: 14,
    color: colors.whiteOpacity70,
  },
  macrosGrid: {
    gap: spacing.sm,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  nutrientIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutrientEmoji: {
    fontSize: 18,
  },
  nutrientLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.gray,
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  nutrientUnit: {
    fontSize: 12,
    fontWeight: '400',
  },
  extrasContainer: {
    flexDirection: 'row',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: spacing.lg,
  },
  extraItem: {
    flex: 1,
  },
  extraLabel: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 2,
  },
  extraValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
});

export default NutritionLabel;
