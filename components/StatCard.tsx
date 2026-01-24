import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatCard = ({ icon, value, label, trend }: StatCardProps) => {
  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return colors.green;
    if (trend === 'down') return colors.red;
    return colors.gray;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {trend && trend !== 'neutral' && (
          <Text style={[styles.trend, { color: getTrendColor() }]}>{getTrendIcon()}</Text>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
  },
  icon: {
    fontSize: 24,
    marginBottom: spacing.xxs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  trend: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xxxs,
  },
  label: {
    fontSize: 11,
    color: colors.gray,
    marginTop: spacing.xxxs,
  },
});

export default StatCard;
