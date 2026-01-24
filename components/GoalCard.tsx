import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GoalCardProps {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  onEditPress?: () => void;
}

const GoalCard = ({ title, calories, protein, carbs, fat, onEditPress }: GoalCardProps) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onEditPress && (
          <TouchableOpacity onPress={onEditPress}>
            <Text style={styles.editButton}>Modifier</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.caloriesRow}>
        <Text style={styles.fireEmoji}>🔥</Text>
        <Text style={styles.caloriesValue}>{formatNumber(calories)}</Text>
        <Text style={styles.caloriesUnit}>kcal / jour</Text>
      </View>

      <View style={styles.macrosRow}>
        <View style={styles.macroItem}>
          <Text style={styles.macroEmoji}>🥩</Text>
          <Text style={[styles.macroValue, { color: colors.red }]}>{protein}g</Text>
          <Text style={styles.macroLabel}>Protéines</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroEmoji}>🍞</Text>
          <Text style={[styles.macroValue, { color: colors.orange }]}>{carbs}g</Text>
          <Text style={styles.macroLabel}>Glucides</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroEmoji}>🥑</Text>
          <Text style={[styles.macroValue, { color: colors.blue }]}>{fat}g</Text>
          <Text style={styles.macroLabel}>Lipides</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  editButton: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: spacing.md,
  },
  fireEmoji: {
    fontSize: 24,
    marginRight: spacing.xxs,
  },
  caloriesValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  caloriesUnit: {
    fontSize: 14,
    color: colors.gray,
    marginLeft: spacing.xxs,
  },
  macrosRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroEmoji: {
    fontSize: 20,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.xxxs,
  },
  macroLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: spacing.xxxs,
  },
});

export default GoalCard;
