import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { StyleSheet } from 'react-native';

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.beige,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.xxxs,
  },
  date: {
    fontSize: 15,
    color: colors.gray,
    textTransform: 'capitalize',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 150,
    gap: spacing.md,
  },
  caloriesCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 24,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caloriesInfo: {
    flex: 1,
  },
  caloriesBadge: {
    backgroundColor: colors.primaryOpacity20,
    paddingVertical: spacing.xxxs,
    paddingHorizontal: spacing.sm,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  caloriesBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.lightPrimary,
  },
  caloriesLabel: {
    fontSize: 14,
    color: colors.whiteOpacity70,
    marginBottom: spacing.xxs,
  },
  caloriesRemaining: {
    fontSize: 12,
    color: colors.lightPrimary,
  },
  macroRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  mealsSection: {
    gap: spacing.sm,
  },
  mealsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
  },
  mealsSectionLink: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  mealsList: {
    gap: spacing.xs,
  },
});

export default homeStyles;
