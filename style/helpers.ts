import { StyleSheet } from 'react-native';
import { spacing } from './spacing';
import { colors } from './colors';

const helpersStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F2EDE6',
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
  backgroundContainer : {
    backgroundColor: '#F2EDE6',
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
});

export default helpersStyles;