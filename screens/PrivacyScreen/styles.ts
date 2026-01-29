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
  lastUpdated: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  intro: {
    fontSize: 14,
    color: colors.primaryDark,
    lineHeight: 22,
    marginBottom: spacing.lg,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.sm,
    marginBottom: spacing.xxs,
  },
  paragraph: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 22,
    marginLeft: spacing.md,
    marginBottom: 4,
  },
});
