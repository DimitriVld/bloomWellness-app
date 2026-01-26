import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface HydrationBottleProps {
  percentage: number;
  size?: 'small' | 'medium' | 'large';
}

const SIZES = {
  small: { width: 50, height: 80, capWidth: 24, capHeight: 10 },
  medium: { width: 70, height: 120, capWidth: 34, capHeight: 12 },
  large: { width: 90, height: 160, capWidth: 44, capHeight: 14 },
};

const HydrationBottle: React.FC<HydrationBottleProps> = ({
  percentage,
  size = 'medium',
}) => {
  const { width, height, capWidth, capHeight } = SIZES[size];
  const cappedPercentage = Math.min(100, Math.max(0, percentage));

  const waterHeight = useSharedValue(0);

  useEffect(() => {
    waterHeight.value = withSpring(cappedPercentage, {
      damping: 15,
      stiffness: 100,
    });
  }, [cappedPercentage]);

  const waterStyle = useAnimatedStyle(() => ({
    height: `${waterHeight.value}%`,
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Bouchon */}
      <View
        style={[
          styles.cap,
          {
            width: capWidth,
            height: capHeight,
            left: (width - capWidth) / 2,
            top: -capHeight + 2,
          },
        ]}
      />

      {/* Corps de la bouteille */}
      <View style={[styles.bottle, { width, height }]}>
        {/* Eau */}
        <Animated.View style={[styles.water, waterStyle]}>
          {/* Vague */}
          <View style={styles.wave} />
        </Animated.View>

        {/* Reflet */}
        <View style={styles.reflection} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  cap: {
    position: 'absolute',
    backgroundColor: '#6B7280',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    zIndex: 10,
  },
  bottle: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  water: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  wave: {
    position: 'absolute',
    top: -6,
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#60A5FA',
    borderRadius: 6,
  },
  reflection: {
    position: 'absolute',
    top: 10,
    left: 6,
    width: 4,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
});

export default HydrationBottle;
