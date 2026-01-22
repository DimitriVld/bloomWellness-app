import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.lg }]}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const getIcon = (): keyof typeof Ionicons.glyphMap => {
            switch (route.name) {
              case "home":
                return isFocused ? "home" : "home-outline";
              case "add-meal":
                return "add";
              case "account":
                return isFocused ? "person" : "person-outline";
              default:
                return "ellipse";
            }
          };

          const getLabel = () => {
            switch (route.name) {
              case "home":
                return "Accueil";
              case "account":
                return "Profil";
              default:
                return "";
            }
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === "add-meal") {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.addButton}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={26} color={colors.white} />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.7}
            >
              <Ionicons
                name={getIcon()}
                size={26}
                color={isFocused ? colors.primary : colors.gray}
              />
              <View style={styles.labelContainer}>
                <Text
                  style={[
                    styles.label,
                    { color: isFocused ? colors.primary : colors.gray },
                  ]}
                >
                  {getLabel()}
                  <Ionicons
                    name={getIcon()}
                    size={0}
                    color="transparent"
                  />
                </Text>
                {isFocused && <View style={styles.indicator} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 35,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxs,
  },
  labelContainer: {
    alignItems: "center",
    marginTop: spacing.xxxs,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: spacing.xxxs,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default CustomTabBar;