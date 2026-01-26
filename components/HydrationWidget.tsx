import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router, Href } from 'expo-router';
import { HydrationEntry, DrinkOption } from '@/types/hydration';
import HydrationBottle from './HydrationBottle';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

interface HydrationWidgetProps {
  current: number; // ml
  goal: number; // ml
  percentage: number;
  recentDrinks?: HydrationEntry[];
  onAddDrink: (drinkId: string) => void;
  drinkOptions: DrinkOption[];
}

const HydrationWidget: React.FC<HydrationWidgetProps> = ({
  current,
  goal,
  percentage,
  onAddDrink,
  drinkOptions,
}) => {
  // Prendre les 4 premières options pour les boutons rapides
  const quickOptions = drinkOptions.slice(0, 4);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/hydration' as Href)}
      activeOpacity={0.9}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.emoji}>💧</Text>
          <Text style={styles.title}>Hydratation</Text>
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.content}>
        {/* Bottle visualization */}
        <HydrationBottle percentage={percentage} size="small" />

        <View style={styles.info}>
          {/* Amount */}
          <View style={styles.amountRow}>
            <Text style={styles.amount}>{(current / 1000).toFixed(1)}</Text>
            <Text style={styles.unit}>/ {(goal / 1000).toFixed(1)} L</Text>
          </View>

          <Text style={styles.remaining}>
            {goal - current > 0
              ? `Encore ${((goal - current) / 1000).toFixed(1)}L pour ton objectif`
              : 'Objectif atteint !'}
          </Text>

          {/* Quick add buttons */}
          <View style={styles.quickButtons}>
            {quickOptions.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                style={styles.quickButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddDrink(drink.id);
                }}
              >
                <Text style={styles.quickEmoji}>{drink.emoji}</Text>
                <Text style={styles.quickMl}>{drink.defaultMl}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
  },
  emoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 4,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  unit: {
    fontSize: 14,
    color: colors.gray,
  },
  remaining: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  quickButton: {
    flex: 1,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.xxxs,
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    alignItems: 'center',
  },
  quickEmoji: {
    fontSize: 16,
  },
  quickMl: {
    fontSize: 9,
    color: '#3B82F6',
    marginTop: 2,
  },
});

export default HydrationWidget;
