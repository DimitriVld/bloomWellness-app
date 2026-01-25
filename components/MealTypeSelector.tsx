import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { MealType, MEAL_TYPE_EMOJIS, MEAL_TYPE_LABELS } from '@/types/meal';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface MealTypeSelectorProps {
  selected: MealType;
  onSelect: (type: MealType) => void;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'snack', 'dinner'];

const MealTypeSelector = ({ selected, onSelect }: MealTypeSelectorProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {MEAL_TYPES.map((type) => {
        const isSelected = selected === type;
        return (
          <TouchableOpacity
            key={type}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(type)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{MEAL_TYPE_EMOJIS[type]}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {MEAL_TYPE_LABELS[type]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xxs,
    paddingVertical: spacing.xxs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    gap: spacing.xxxs,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
  },
  labelSelected: {
    color: colors.white,
  },
});

export default MealTypeSelector;
