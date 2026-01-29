import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

interface Props {
  title: string;
  showSave?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveLabel?: string;
}

const ScreenHeader: React.FC<Props> = ({
  title,
  showSave = false,
  onSave,
  isSaving = false,
  saveLabel = 'Sauver',
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Save button or spacer */}
      {showSave ? (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveLabel}>{saveLabel}</Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.beige,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  saveButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  saveLabel: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  spacer: {
    width: 40,
  },
});

export default ScreenHeader;
