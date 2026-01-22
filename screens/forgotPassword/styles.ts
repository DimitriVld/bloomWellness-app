import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { StyleSheet } from "react-native";

const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 340,
    backgroundColor: colors.primaryDark,
    borderBottomLeftRadius: spacing.xxl,
    borderBottomRightRadius: spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  decorCircle2: {
    position: "absolute",
    bottom: 20,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  backArrow: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: spacing.xxs,
  },

  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    marginTop: -spacing.xxl,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.xxs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  formWrapper: {
    flex: 1,
    marginTop: -30,
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  formCardContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  instructions: {
    fontSize: 14,
    color: colors.gray,
    lineHeight: 22,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  sendButton: {
    marginTop: spacing.xxs,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: spacing.xxs,
    elevation: 4,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.gray,
  },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    marginTop: -30,
    backgroundColor: colors.white,
    marginHorizontal: 20,
    borderRadius: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  successIcon: {
    width: 100,
    height: 100,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.black,
    marginBottom: spacing.md,
  },
  successText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xxs,
  },
  successEmail: {
    fontWeight: "600",
    color: colors.black,
  },
  successHint: {
    fontSize: 13,
    color: colors.gray,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: "100%",
  },
});

export default forgotPasswordStyles;