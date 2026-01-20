import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

const helpersStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  containerWithoutBackground: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paddingLeft0: {
    paddingLeft: 0,
  },
  paddingRight0: {
    paddingRight: 0,
  },
  paddindTop0: {
    paddingTop: 0,
  },
  paddingBottom0: {
    paddingBottom: 0,
  },
  marginTopSm: {
    marginTop: spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPrimaryText: {
    color: colors.white,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
  },
});

export default helpersStyles;