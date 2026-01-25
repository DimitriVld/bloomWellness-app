import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { FoodItem } from '@/types/meal';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface QuickAddChipsProps {
  onSelect: (food: FoodItem) => void;
}

const QUICK_ADD_ITEMS: Omit<FoodItem, 'id'>[] = [
  {
    name: 'Café noir',
    emoji: '☕',
    nutritionPer100g: { calories: 2, protein: 0, carbs: 0, fat: 0 },
    defaultPortionSize: 200,
    source: 'manual',
  },
  {
    name: 'Thé',
    emoji: '🍵',
    nutritionPer100g: { calories: 1, protein: 0, carbs: 0, fat: 0 },
    defaultPortionSize: 200,
    source: 'manual',
  },
  {
    name: 'Pomme',
    emoji: '🍎',
    nutritionPer100g: { calories: 52, protein: 0, carbs: 14, fat: 0, fiber: 2.4 },
    defaultPortionSize: 150,
    source: 'manual',
  },
  {
    name: 'Banane',
    emoji: '🍌',
    nutritionPer100g: { calories: 89, protein: 1, carbs: 23, fat: 0, fiber: 2.6 },
    defaultPortionSize: 120,
    source: 'manual',
  },
  {
    name: 'Yaourt nature',
    emoji: '🥛',
    nutritionPer100g: { calories: 59, protein: 4, carbs: 5, fat: 3 },
    defaultPortionSize: 125,
    source: 'manual',
  },
  {
    name: 'Œuf',
    emoji: '🥚',
    nutritionPer100g: { calories: 155, protein: 13, carbs: 1, fat: 11 },
    defaultPortionSize: 60,
    source: 'manual',
  },
  {
    name: 'Pain blanc',
    emoji: '🍞',
    nutritionPer100g: { calories: 265, protein: 9, carbs: 49, fat: 3, fiber: 2.7 },
    defaultPortionSize: 30,
    source: 'manual',
  },
  {
    name: 'Riz cuit',
    emoji: '🍚',
    nutritionPer100g: { calories: 130, protein: 3, carbs: 28, fat: 0, fiber: 0.4 },
    defaultPortionSize: 150,
    source: 'manual',
  },
  {
    name: 'Pâtes cuites',
    emoji: '🍝',
    nutritionPer100g: { calories: 131, protein: 5, carbs: 25, fat: 1, fiber: 1.8 },
    defaultPortionSize: 200,
    source: 'manual',
  },
  {
    name: 'Poulet grillé',
    emoji: '🍗',
    nutritionPer100g: { calories: 165, protein: 31, carbs: 0, fat: 4 },
    defaultPortionSize: 150,
    source: 'manual',
  },
];

const QuickAddChips = ({ onSelect }: QuickAddChipsProps) => {
  const handleSelect = (item: Omit<FoodItem, 'id'>) => {
    const foodItem: FoodItem = {
      ...item,
      id: `quick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    onSelect(foodItem);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajout rapide</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {QUICK_ADD_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chip}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
  },
  scrollContent: {
    gap: spacing.xxs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.beige,
    borderRadius: 20,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
    gap: spacing.xxxs,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.black,
  },
});

export default QuickAddChips;
