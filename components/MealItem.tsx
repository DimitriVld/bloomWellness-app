import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MealItemProps {
  emoji: string;
  name: string;
  calories: number;
  time: string;
  onPress?: () => void;
}

const MealItem = ({ emoji, name, calories, time, onPress }: MealItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Text style={styles.calories}>+{calories} kcal</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.beige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: colors.gray,
  },
  calories: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default MealItem;
