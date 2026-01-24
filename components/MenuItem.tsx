import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  danger?: boolean;
  value?: string;
}

const MenuItem = ({
  icon,
  label,
  onPress,
  showChevron = true,
  danger = false,
  value,
}: MenuItemProps) => {
  const iconColor = danger ? colors.red : colors.primaryDark;
  const labelColor = danger ? colors.red : colors.black;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      {value && <Text style={styles.value}>{value}</Text>}
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  label: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 15,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: colors.gray,
    marginRight: spacing.xxs,
  },
});

export default MenuItem;
