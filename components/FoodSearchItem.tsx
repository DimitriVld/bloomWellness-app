import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { FoodItem } from '@/types/meal';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface FoodSearchItemProps {
  food: FoodItem;
  onPress: (food: FoodItem) => void;
}

const FoodSearchItem = ({ food, onPress }: FoodSearchItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(food)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {food.imageUrl ? (
          <Image source={{ uri: food.imageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.emoji}>{food.emoji}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {food.name}
        </Text>
        {food.brand && (
          <Text style={styles.brand} numberOfLines={1}>
            {food.brand}
          </Text>
        )}
      </View>
      <View style={styles.nutritionContainer}>
        <Text style={styles.calories}>{food.nutritionPer100g.calories}</Text>
        <Text style={styles.caloriesUnit}>kcal/100g</Text>
      </View>
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
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
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
  brand: {
    fontSize: 12,
    color: colors.gray,
  },
  nutritionContainer: {
    alignItems: 'flex-end',
  },
  calories: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  caloriesUnit: {
    fontSize: 10,
    color: colors.gray,
  },
});

export default FoodSearchItem;
