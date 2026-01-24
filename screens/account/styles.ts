import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { StyleSheet } from "react-native";

const accountStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.beige,
    justifyContent: "center",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  statsSpacer: {
    width: spacing.sm,
  },
  goalCardContainer: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.gray,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
    letterSpacing: 0.5,
  },
  logoutContainer: {
    marginTop: spacing.lg,
  },
  version: {
    fontSize: 12,
    color: colors.gray,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});

export default accountStyles;
