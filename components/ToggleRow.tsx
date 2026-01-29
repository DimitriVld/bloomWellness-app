import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

interface Props {
  emoji: string;
  title: string;
  description?: string;
  subInfo?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleRow: React.FC<Props> = ({
  emoji,
  title,
  description,
  subInfo,
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        {subInfo && <Text style={styles.subInfo}>{subInfo}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.lightGray, true: colors.lightPrimary }}
        thumbColor={value ? colors.primary : colors.gray}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  description: {
    fontSize: 11,
    color: colors.gray,
  },
  subInfo: {
    fontSize: 10,
    color: colors.primary,
    marginTop: 2,
  },
});

export default ToggleRow;
