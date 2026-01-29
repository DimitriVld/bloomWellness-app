import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import ScreenHeader from '@/components/ScreenHeader';

import styles from './styles';
import { colors } from '@/style/colors';

const FAQ_ITEMS = [
  {
    question: 'Comment ajouter un repas ?',
    answer:
      "Appuie sur le bouton \"+\" en bas de l'écran, puis choisis entre prendre une photo, rechercher un aliment, scanner un code-barres ou saisir manuellement.",
  },
  {
    question: "Comment fonctionne le suivi de l'eau ?",
    answer:
      "Appuie sur les boutons de boisson dans le widget Hydratation pour ajouter rapidement un verre d'eau, un café ou un thé. Tu peux aussi personnaliser la quantité.",
  },
  {
    question: 'Comment modifier mes objectifs ?',
    answer:
      'Va dans ton profil (onglet Compte), puis appuie sur "Objectifs". Tu peux activer le calcul automatique basé sur ton profil ou entrer tes valeurs manuellement.',
  },
  {
    question: 'Comment fonctionne le streak ?',
    answer:
      "Ton streak augmente chaque jour où tu enregistres au moins un repas. Si tu oublies un jour, ton streak repart à zéro.",
  },
  {
    question: "L'application est-elle gratuite ?",
    answer:
      'Oui, Bloom est entièrement gratuite ! Nous ajouterons des fonctionnalités premium optionnelles dans le futur.',
  },
];

const HelpScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@bloom-wellness.com');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Aide & Support" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact card */}
        <TouchableOpacity style={styles.contactCard} onPress={handleContact}>
          <View style={styles.contactIcon}>
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Besoin d'aide ?</Text>
            <Text style={styles.contactDesc}>Contacte notre équipe</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.lightGray} />
        </TouchableOpacity>

        {/* FAQ */}
        <Text style={styles.sectionLabel}>QUESTIONS FRÉQUENTES</Text>

        {FAQ_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Ionicons
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.gray}
              />
            </View>
            {expandedIndex === index && (
              <Text style={styles.faqAnswer}>{item.answer}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Bloom Wellness v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with 💚 in France</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpScreen;
