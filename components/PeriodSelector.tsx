import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Period } from '@/types/home';

interface PeriodSelectorProps {
  selected: Period;
  onSelect: (period: Period) => void;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'day', label: 'Jour' },
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
];

const PeriodSelector = ({ selected, onSelect }: PeriodSelectorProps) => {
  return (
    <View style={styles.container}>
      {PERIODS.map((period) => {
        const isActive = selected === period.value;
        return (
          <TouchableOpacity
            key={period.value}
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => onSelect(period.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.xxxs,
    gap: spacing.xxxs,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  activeButtonText: {
    color: colors.white,
  },
});

export default PeriodSelector;
