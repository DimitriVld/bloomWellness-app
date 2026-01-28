import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

const onboardingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.xxs,
  },
  skipText: {
    color: colors.lightPrimary,
    fontSize: 14,
    opacity: 0.8,
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 56,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 16,
    color: colors.beige,
    opacity: 0.9,
    marginBottom: spacing.xxxs,
  },
  highlight: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.white,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 14,
    color: colors.beige,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  bottomContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 50,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.xxs,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonLast: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default onboardingStyles;