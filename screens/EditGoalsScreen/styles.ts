import { StyleSheet } from 'react-native';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  autoCalculateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  autoCalculateEmoji: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  autoCalculateInfo: {
    flex: 1,
  },
  autoCalculateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  autoCalculateDesc: {
    fontSize: 12,
    color: colors.gray,
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
  },
  warningDesc: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  goalRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  goalOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  goalOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  goalEmoji: {
    fontSize: 24,
  },
  goalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
    marginTop: 4,
  },
  goalLabelSelected: {
    color: colors.white,
  },
  caloriesCard: {
    backgroundColor: colors.primaryDark,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  caloriesLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.sm,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  caloriesUnit: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  macroEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  macroLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  macroInput: {
    width: 70,
    backgroundColor: colors.beige,
    borderRadius: 10,
    padding: spacing.sm,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  macroUnit: {
    fontSize: 13,
    color: colors.gray,
    marginLeft: 6,
    width: 20,
  },
  inputDisabled: {
    backgroundColor: colors.lightGray,
  },
});
