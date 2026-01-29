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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  genderOption: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  genderOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  genderLabelSelected: {
    color: colors.white,
  },
});
