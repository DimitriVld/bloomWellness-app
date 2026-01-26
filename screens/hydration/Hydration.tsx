import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHydration } from '@/hooks/useHydration';
import HydrationBottle from '@/components/HydrationBottle';
import { DRINK_OPTIONS } from '@/types/hydration';
import { colors } from '@/style/colors';
import { styles } from './styles';

const HydrationScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const {
    totalMl,
    goalMl,
    percentage,
    entries,
    addDrink,
    addCustomDrink,
    removeDrink,
    isLoading,
  } = useHydration();

  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const handleAddCustom = async () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      await addCustomDrink('water', amount, `Eau (${amount}ml)`);
      setCustomAmount('');
      setShowCustomModal(false);
    }
  };

  const handleRemove = (entryId: string, name: string) => {
    Alert.alert('Supprimer', `Supprimer "${name}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => removeDrink(entryId),
      },
    ]);
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header with gradient */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hydratation</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Big bottle */}
        <View style={styles.bottleSection}>
          <HydrationBottle percentage={percentage} size="large" />

          <View style={styles.statsSection}>
            <Text style={styles.bigAmount}>
              {(totalMl / 1000).toFixed(1)}L
            </Text>
            <Text style={styles.goalText}>
              sur {(goalMl / 1000).toFixed(1)}L
            </Text>
            <View style={styles.percentBadge}>
              <Text style={styles.percentText}>{percentage}% 🎯</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick add grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajouter une boisson</Text>
          <View style={styles.drinksGrid}>
            {DRINK_OPTIONS.map((drink) => (
              <TouchableOpacity
                key={drink.id}
                style={styles.drinkButton}
                onPress={() => addDrink(drink.id)}
              >
                <Text style={styles.drinkEmoji}>{drink.emoji}</Text>
                <Text style={styles.drinkName}>{drink.name}</Text>
                <Text style={styles.drinkMl}>{drink.defaultMl}ml</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom amount */}
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => setShowCustomModal(true)}
          >
            <Text style={styles.customButtonText}>
              ✏️ Quantité personnalisée
            </Text>
          </TouchableOpacity>
        </View>

        {/* Today's history */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          <View style={styles.historyCard}>
            {entries.length === 0 ? (
              <Text style={styles.emptyText}>Aucune boisson ajoutée</Text>
            ) : (
              entries.map((entry, index) => (
                <TouchableOpacity
                  key={entry.id}
                  style={[
                    styles.historyItem,
                    index < entries.length - 1 && styles.historyItemBorder,
                  ]}
                  onLongPress={() => handleRemove(entry.id, entry.name)}
                >
                  <Text style={styles.historyTime}>{entry.time}</Text>
                  <Text style={styles.historyEmoji}>{entry.emoji}</Text>
                  <Text style={styles.historyName}>{entry.name}</Text>
                  <Text style={styles.historyAmount}>+{entry.amount}ml</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
          {entries.length > 0 && (
            <Text style={styles.hint}>Appui long pour supprimer</Text>
          )}
        </View>
      </ScrollView>

      {/* Custom amount modal */}
      <Modal
        visible={showCustomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quantité personnalisée</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="250"
                keyboardType="numeric"
                value={customAmount}
                onChangeText={setCustomAmount}
                autoFocus
              />
              <Text style={styles.inputUnit}>ml</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowCustomModal(false)}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleAddCustom}
              >
                <Text style={styles.modalConfirmText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HydrationScreen;
