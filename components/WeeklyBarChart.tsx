import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyCalories } from '@/types/home';

interface WeeklyBarChartProps {
  data: DailyCalories[];
  average?: number;
}

const BAR_HEIGHT = 100;

const WeeklyBarChart = ({ data, average }: WeeklyBarChartProps) => {
  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 1;
  const calculatedAverage = average ?? (data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length) : 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cette semaine</Text>
        <Text style={styles.average}>Moy: {calculatedAverage} kcal</Text>
      </View>
      <View style={styles.barsContainer}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * BAR_HEIGHT;

          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barWrapper}>
                {item.isToday ? (
                  <LinearGradient
                    colors={[colors.lightPrimary, colors.primary]}
                    style={[styles.bar, { height: barHeight }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                ) : (
                  <View style={[styles.bar, styles.inactiveBar, { height: barHeight }]} />
                )}
              </View>
              <Text style={[styles.dayLabel, item.isToday && styles.todayLabel]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  average: {
    fontSize: 13,
    color: colors.gray,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_HEIGHT + 24,
    gap: spacing.xxs,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: BAR_HEIGHT,
    justifyContent: 'flex-end',
    width: '100%',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
  },
  inactiveBar: {
    backgroundColor: colors.lightGray,
  },
  dayLabel: {
    fontSize: 11,
    color: colors.gray,
    marginTop: spacing.xxs,
  },
  todayLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default WeeklyBarChart;
