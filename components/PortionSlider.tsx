import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface PortionSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const PortionSlider = ({
  value,
  onChange,
  min = 10,
  max = 500,
  step = 10,
  unit = 'g',
}: PortionSliderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Portion</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.lightGray}
        thumbTintColor={colors.primary}
      />
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{min}{unit}</Text>
        <Text style={styles.rangeLabel}>{max}{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: spacing.xxxs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeLabel: {
    fontSize: 12,
    color: colors.gray,
  },
});

export default PortionSlider;
