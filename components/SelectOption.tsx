import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

interface Props {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

const SelectOption: React.FC<Props> = ({
  label,
  description,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        selected && styles.containerSelected,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.xxs,
    borderWidth: 2,
    borderColor: colors.lightGray,
  },
  containerSelected: {
    borderColor: colors.primary,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  description: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
});

export default SelectOption;
