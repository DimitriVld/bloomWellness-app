import { colors } from '@/style/colors';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  percentage: number;
  calories: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
}

const CircularProgress = ({
  percentage,
  calories,
  goal,
  size = 140,
  strokeWidth = 12,
}: CircularProgressProps) => {
  const safePercentage = isNaN(percentage) || !isFinite(percentage) ? 0 : Math.min(percentage, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (safePercentage / 100) * circumference;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.whiteOpacity15}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.lightPrimary}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.caloriesText}>{calories}</Text>
        <Text style={styles.goalText}>/ {goal} kcal</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  goalText: {
    fontSize: 11,
    color: colors.whiteOpacity60,
  },
});

export default CircularProgress;
