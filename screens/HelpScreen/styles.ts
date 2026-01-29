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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  contactIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  contactDesc: {
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
  faqItem: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    fontSize: 13,
    color: colors.gray,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
  },
  versionText: {
    fontSize: 13,
    color: colors.gray,
  },
  versionSubtext: {
    fontSize: 12,
    color: colors.lightGray,
    marginTop: 4,
  },
});
