import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.black,
    marginBottom: spacing.xxxs,
  },
  date: {
    fontSize: 15,
    color: colors.gray,
    textTransform: "capitalize",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
});

export default homeStyles;
