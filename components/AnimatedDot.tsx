import { colors } from "@/style/colors";
import { useEffect } from "react";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedDotProps = {
  isActive: boolean;
  activeColor?: string;
  inactiveColor?: string;
};

const AnimatedDot = ({
  isActive,
  activeColor = colors.primary,
  inactiveColor = "rgba(255, 255, 255, 0.3)",
}: AnimatedDotProps) => {
  const width = useSharedValue(isActive ? 24 : 8);
  const scale = useSharedValue(isActive ? 1 : 0.9);
  const opacity = useSharedValue(isActive ? 1 : 0.5);
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    width.value = withSpring(isActive ? 24 : 8, {
      damping: 15,
      stiffness: 150,
      mass: 0.8,
    });
    scale.value = withSpring(isActive ? 1 : 0.9, {
      damping: 12,
      stiffness: 200,
    });
    opacity.value = withTiming(isActive ? 1 : 0.5, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: 300,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor]
    );

    return {
      width: width.value,
      opacity: opacity.value,
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 8,
          borderRadius: 4,
        },
        animatedStyle,
      ]}
    />
  );
};

export default AnimatedDot;