import React from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';

import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { NotificationSettings } from '@/types/user';

import ScreenHeader from '@/components/ScreenHeader';
import ToggleRow from '@/components/ToggleRow';

import styles from './styles';
import { colors } from '@/style/colors';

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

const NotificationsScreen = () => {
  const { settings, updateSettings } = useNotificationSettings();

  const toggleMainNotifications = (value: boolean) => {
    updateSettings({ enabled: value });
  };

  const toggleNotification = (key: string, value: boolean) => {
    const currentSetting = settings[key as keyof NotificationSettings];
    if (typeof currentSetting === 'object' && 'enabled' in currentSetting) {
      updateSettings({
        [key]: { ...currentSetting, enabled: value },
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main toggle */}
        <View style={styles.mainToggleCard}>
          <View style={styles.mainToggleIcon}>
            <Text style={styles.mainToggleEmoji}>🔔</Text>
          </View>
          <View style={styles.mainToggleInfo}>
            <Text style={styles.mainToggleTitle}>Activer les notifications</Text>
            <Text style={styles.mainToggleDesc}>
              Reçois des rappels personnalisés
            </Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={toggleMainNotifications}
            trackColor={{ false: colors.lightGray, true: colors.lightPrimary }}
            thumbColor={settings.enabled ? colors.primary : colors.gray}
          />
        </View>

        {/* Notification types */}
        <Text style={styles.sectionLabel}>TYPES DE RAPPELS</Text>

        {NOTIFICATION_TYPES.map((notif) => {
          const notifSettings = settings[notif.key as keyof NotificationSettings];
          const isEnabled =
            typeof notifSettings === 'object' && 'enabled' in notifSettings
              ? notifSettings.enabled
              : false;

          return (
            <ToggleRow
              key={notif.key}
              emoji={notif.emoji}
              title={notif.title}
              description={notif.desc}
              subInfo={notif.time}
              value={isEnabled}
              onValueChange={(value) => toggleNotification(notif.key, value)}
              disabled={!settings.enabled}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default NotificationsScreen;
