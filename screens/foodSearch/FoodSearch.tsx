import FoodSearchItem from '@/components/FoodSearchItem';
import useFoodSearch from '@/hooks/useFoodSearch';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { FoodItem, MealType } from '@/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FoodSearchScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType: MealType }>();
  const mealType = params.mealType || 'lunch';

  const { query, results, isLoading, error, total, search, loadMore, clear } =
    useFoodSearch();

  const handleFoodPress = (food: FoodItem) => {
    router.push({
      pathname: '/(meal)/food-detail',
      params: {
        mealType,
        foodData: JSON.stringify(food),
      },
    });
  };

  const renderItem = ({ item }: { item: FoodItem }) => (
    <FoodSearchItem food={item} onPress={handleFoodPress} />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    if (query.length < 2) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>
            Tape au moins 2 caractères pour rechercher
          </Text>
        </View>
      );
    }
    if (results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>😕</Text>
          <Text style={styles.emptyText}>Aucun résultat pour "{query}"</Text>
          <Text style={styles.emptySubtext}>
            Essaie avec d'autres mots-clés
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Rechercher</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pâtes carbonara, pomme..."
            placeholderTextColor={colors.gray}
            value={query}
            onChangeText={search}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clear}>
              <Ionicons name="close-circle" size={20} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length >= 2 && total > 0 && (
        <Text style={styles.resultsCount}>
          {total.toLocaleString('fr-FR')} résultats pour "{query}"
        </Text>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color={colors.red} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.xxs,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    paddingVertical: 0,
  },
  resultsCount: {
    fontSize: 13,
    color: colors.gray,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.red}15`,
    marginHorizontal: spacing.md,
    padding: spacing.sm,
    borderRadius: 12,
    gap: spacing.xxs,
    marginBottom: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.red,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: spacing.xxs,
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
});

export default FoodSearchScreen;
