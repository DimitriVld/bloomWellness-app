import React from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

interface Props extends TextInputProps {
  label: string;
  disabled?: boolean;
  hint?: string;
}

const FormInput: React.FC<Props> = ({
  label,
  disabled = false,
  hint,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        editable={!disabled}
        style={[
          styles.input,
          disabled && styles.inputDisabled,
          style,
        ]}
        placeholderTextColor={colors.gray}
        {...props}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    fontSize: 15,
    borderWidth: 2,
    borderColor: colors.lightGray,
    color: colors.black,
  },
  inputDisabled: {
    backgroundColor: colors.lightGray,
    color: colors.gray,
  },
  hint: {
    fontSize: 11,
    color: colors.gray,
    marginTop: 4,
  },
});

export default FormInput;
