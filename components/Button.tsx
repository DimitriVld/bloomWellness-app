import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type ButtonVariant = "primary" | "outline" | "google" | "apple" | "tertiary";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const Button = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      opacity: isDisabled ? 0.6 : 1,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: colors.white,
          borderWidth: 2,
          borderColor: colors.lightGray,
        };
      case "google":
        return {
          ...baseStyle,
          backgroundColor: colors.white,
          borderWidth: 2,
          borderColor: colors.lightGray,
        };
      case "apple":
        return {
          ...baseStyle,
          backgroundColor: colors.black,
        };
      case "tertiary":
        return {
          ...baseStyle,
          backgroundColor: colors.tertiary,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "primary":
        return { color: colors.white };
      case "outline":
      case "google":
        return { color: colors.black };
      case "apple":
        return { color: colors.white };
      case "tertiary":
        return { color: colors.white };
      default:
        return { color: colors.white };
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "apple" || variant === "tertiary" ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
  },
});

export default Button;