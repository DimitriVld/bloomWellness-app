import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface WaterTrackerProps {
  current: number;
  goal: number;
  onAdd?: () => void;
}

const WaterTracker = ({ current, goal, onAdd }: WaterTrackerProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onAdd} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.icon}>💧</Text>
          <Text style={styles.title}>Hydratation</Text>
        </View>
        <Text style={styles.count}>
          {current}/{goal} verres
        </Text>
      </View>
      <View style={styles.barsContainer}>
        {Array.from({ length: goal }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              { backgroundColor: index < current ? colors.blue : colors.lightGray },
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: spacing.xxs,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  count: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.blue,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  bar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
});

export default WaterTracker;
