import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { View, Text, StyleSheet } from 'react-native';

interface MacroCardProps {
  icon: string;
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}

const MacroCard = ({ icon, label, value, goal, unit, color }: MacroCardProps) => {
  const percentage = Math.min((value / goal) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xxs,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 12,
    color: colors.gray,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xxs,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  unit: {
    fontSize: 12,
    color: colors.gray,
    marginLeft: spacing.xxxs,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default MacroCard;
