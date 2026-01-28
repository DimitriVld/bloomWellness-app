import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import useNotificationSettings from '@/hooks/useNotificationSettings';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';

const NOTIFICATION_TYPES = [
  {
    key: 'hydration',
    emoji: '💧',
    title: 'Hydratation',
    desc: "Rappels pour boire de l'eau",
    time: 'Toutes les 2h',
  },
  {
    key: 'meals',
    emoji: '🍽️',
    title: 'Repas',
    desc: 'Rappels pour logger tes repas',
    time: '8h, 12h, 19h',
  },
  {
    key: 'dailySummary',
    emoji: '📊',
    title: 'Résumé quotidien',
    desc: 'Bilan de ta journée',
    time: '21h',
  },
  {
    key: 'streak',
    emoji: '🔥',
    title: 'Streak',
    desc: 'Rappel pour maintenir ton streak',
    time: '20h',
  },
  {
    key: 'goals',
    emoji: '🎯',
    title: 'Objectifs atteints',
    desc: 'Quand tu atteins un objectif',
    time: '',
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useNotificationSettings();

  const toggleNotification = (key: string, value: boolean) => {
    const currentSetting = settings[key as keyof typeof settings];
    if (typeof currentSetting === 'object' && currentSetting !== null) {
      updateSettings({
        [key]: { ...currentSetting, enabled: value },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={colors.primaryDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main toggle */}
        <View style={styles.mainToggleCard}>
          <View style={styles.mainToggleIcon}>
            <Text style={styles.mainToggleEmoji}>🔔</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.mainToggleTitle}>Activer les notifications</Text>
            <Text style={styles.mainToggleDesc}>
              Reçois des rappels personnalisés
            </Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={(value) => updateSettings({ enabled: value })}
            trackColor={{ false: colors.lightGray, true: colors.lightPrimary }}
            thumbColor={settings.enabled ? colors.primary : colors.gray}
          />
        </View>

        {/* Notification types */}
        <Text style={styles.sectionTitle}>TYPES DE RAPPELS</Text>

        {NOTIFICATION_TYPES.map((notif) => {
          const notifSettings = settings[notif.key as keyof typeof settings];
          const isEnabled =
            typeof notifSettings === 'object' &&
            notifSettings !== null &&
            'enabled' in notifSettings
              ? notifSettings.enabled
              : false;

          return (
            <View
              key={notif.key}
              style={[
                styles.notificationRow,
                !settings.enabled && styles.notificationRowDisabled,
              ]}
            >
              <Text style={styles.notificationEmoji}>{notif.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notificationTitle}>{notif.title}</Text>
                <Text style={styles.notificationDesc}>{notif.desc}</Text>
                {notif.time && (
                  <Text style={styles.notificationTime}>{notif.time}</Text>
                )}
              </View>
              <Switch
                value={isEnabled}
                onValueChange={(value) => toggleNotification(notif.key, value)}
                disabled={!settings.enabled}
                trackColor={{ false: colors.lightGray, true: colors.lightPrimary }}
                thumbColor={isEnabled ? colors.primary : colors.gray}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  mainToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  mainToggleIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  mainToggleEmoji: {
    fontSize: 26,
  },
  mainToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  mainToggleDesc: {
    fontSize: 12,
    color: colors.gray,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  notificationRowDisabled: {
    opacity: 0.5,
  },
  notificationEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
  notificationDesc: {
    fontSize: 11,
    color: colors.gray,
  },
  notificationTime: {
    fontSize: 10,
    color: colors.primary,
    marginTop: 2,
  },
});
