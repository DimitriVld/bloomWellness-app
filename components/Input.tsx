import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

type IconName = "mail" | "lock" | "person" | "call" | "calendar";

type InputProps = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
  icon?: IconName;
};

const Input = ({
  label,
  error,
  isPassword = false,
  icon,
  style,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const iconMap: Record<IconName, keyof typeof Ionicons.glyphMap> = {
    mail: "mail-outline",
    lock: "lock-closed-outline",
    person: "person-outline",
    call: "call-outline",
    calendar: "calendar-outline",
  };

  const getBorderColor = () => {
    if (error) return colors.red;
    if (isFocused) return colors.primary;
    return "transparent";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          { borderColor: getBorderColor() },
          isFocused && styles.inputContainerFocused,
        ]}
      >
        {icon && (
          <Ionicons
            name={iconMap[icon]}
            size={20}
            color={isFocused ? colors.primary : colors.gray}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, !icon && styles.inputNoIcon, style]}
          placeholderTextColor={colors.lightGray}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={isPassword ? "none" : props.autoCapitalize}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray,
    marginBottom: spacing.xxs,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "transparent",
    paddingHorizontal: spacing.md,
  },
  inputContainerFocused: {
    backgroundColor: colors.white,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.black,
  },
  inputNoIcon: {
    paddingLeft: 0,
  },
  eyeButton: {
    padding: 4,
  },
  error: {
    fontSize: 12,
    color: colors.red,
    marginTop: spacing.xxs,
  },
});

export default Input;