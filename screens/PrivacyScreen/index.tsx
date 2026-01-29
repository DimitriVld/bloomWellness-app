import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import ScreenHeader from '@/components/ScreenHeader';

import styles from './styles';

const PrivacyScreen = () => {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Politique de confidentialité" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Dernière mise à jour : Janvier 2025</Text>

        <Text style={styles.intro}>
          Chez Bloom Wellness, nous prenons la protection de vos données très au
          sérieux. Cette politique explique quelles données nous collectons et
          comment nous les utilisons.
        </Text>

        <Text style={styles.sectionTitle}>1. Données collectées</Text>
        <Text style={styles.subTitle}>Informations de compte</Text>
        <Text style={styles.bulletPoint}>• Adresse email</Text>
        <Text style={styles.bulletPoint}>• Nom et prénom (optionnel)</Text>
        <Text style={styles.bulletPoint}>• Données physiques (poids, taille, âge)</Text>

        <Text style={styles.subTitle}>Données de suivi</Text>
        <Text style={styles.bulletPoint}>• Repas enregistrés et photos</Text>
        <Text style={styles.bulletPoint}>• Consommation d'eau</Text>
        <Text style={styles.bulletPoint}>• Objectifs nutritionnels</Text>

        <Text style={styles.sectionTitle}>2. Utilisation des données</Text>
        <Text style={styles.paragraph}>Vos données sont utilisées pour :</Text>
        <Text style={styles.bulletPoint}>
          • Fournir les fonctionnalités de suivi nutritionnel
        </Text>
        <Text style={styles.bulletPoint}>
          • Calculer vos objectifs personnalisés
        </Text>
        <Text style={styles.bulletPoint}>
          • Afficher vos statistiques et progrès
        </Text>
        <Text style={styles.bulletPoint}>
          • Améliorer l'expérience utilisateur
        </Text>

        <Text style={styles.sectionTitle}>3. Stockage et sécurité</Text>
        <Text style={styles.paragraph}>
          Vos données sont stockées de manière sécurisée sur les serveurs Firebase
          de Google, conformes aux normes de sécurité les plus strictes. Les
          transferts de données sont chiffrés via HTTPS.
        </Text>

        <Text style={styles.sectionTitle}>4. Partage des données</Text>
        <Text style={styles.paragraph}>
          Nous ne vendons jamais vos données personnelles. Vos informations peuvent
          être partagées uniquement dans les cas suivants :
        </Text>
        <Text style={styles.bulletPoint}>• Avec votre consentement explicite</Text>
        <Text style={styles.bulletPoint}>• Pour respecter une obligation légale</Text>
        <Text style={styles.bulletPoint}>
          • Avec nos prestataires techniques (Firebase) pour le fonctionnement du
          service
        </Text>

        <Text style={styles.sectionTitle}>5. Vos droits</Text>
        <Text style={styles.paragraph}>
          Conformément au RGPD, vous disposez des droits suivants :
        </Text>
        <Text style={styles.bulletPoint}>• Droit d'accès à vos données</Text>
        <Text style={styles.bulletPoint}>• Droit de rectification</Text>
        <Text style={styles.bulletPoint}>• Droit à l'effacement ("droit à l'oubli")</Text>
        <Text style={styles.bulletPoint}>• Droit à la portabilité</Text>
        <Text style={styles.bulletPoint}>• Droit d'opposition</Text>

        <Text style={styles.sectionTitle}>6. Conservation des données</Text>
        <Text style={styles.paragraph}>
          Vos données sont conservées tant que votre compte est actif. En cas de
          suppression de compte, vos données seront effacées dans un délai de 30
          jours.
        </Text>

        <Text style={styles.sectionTitle}>7. Cookies et analytics</Text>
        <Text style={styles.paragraph}>
          L'application peut utiliser des outils d'analyse anonymes pour améliorer
          le service. Aucune donnée personnelle n'est collectée à cette fin.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.paragraph}>
          Pour exercer vos droits ou poser des questions sur cette politique,
          contactez-nous à privacy@bloom-wellness.com
        </Text>

        <Text style={styles.sectionTitle}>9. Modifications</Text>
        <Text style={styles.paragraph}>
          Cette politique peut être mise à jour. Nous vous informerons de tout
          changement significatif par notification dans l'application.
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrivacyScreen;
