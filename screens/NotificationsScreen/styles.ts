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
  mainToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  mainToggleIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  mainToggleEmoji: {
    fontSize: 26,
  },
  mainToggleInfo: {
    flex: 1,
  },
  mainToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  mainToggleDesc: {
    fontSize: 12,
    color: colors.gray,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
});
