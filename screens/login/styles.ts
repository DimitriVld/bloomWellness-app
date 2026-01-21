import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 340,
    backgroundColor: colors.primaryDark,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    shadowColor: "#000",
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

  logoContainer: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: -spacing.xxl,
  },
  logo: {
    width: 70,
    height: 70,
  },

  headerTitle: {
    fontSize: 26,
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
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  formCardContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: -spacing.xxs,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.primary,
  },

  loginButton: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: 13,
    color: colors.gray,
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
  footerLink: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
});

export default loginStyles;