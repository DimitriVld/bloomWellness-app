import React from 'react';
import { View, Text, ScrollView } from 'react-native';

import ScreenHeader from '@/components/ScreenHeader';

import styles from './styles';

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Conditions d'utilisation" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Dernière mise à jour : Janvier 2025</Text>

        <Text style={styles.sectionTitle}>1. Acceptation des conditions</Text>
        <Text style={styles.paragraph}>
          En utilisant l'application Bloom Wellness, vous acceptez d'être lié par
          ces conditions d'utilisation. Si vous n'acceptez pas ces conditions,
          veuillez ne pas utiliser l'application.
        </Text>

        <Text style={styles.sectionTitle}>2. Description du service</Text>
        <Text style={styles.paragraph}>
          Bloom Wellness est une application de suivi nutritionnel qui vous permet
          de :
        </Text>
        <Text style={styles.bulletPoint}>• Enregistrer vos repas quotidiens</Text>
        <Text style={styles.bulletPoint}>• Suivre votre consommation d'eau</Text>
        <Text style={styles.bulletPoint}>
          • Visualiser vos apports en macronutriments
        </Text>
        <Text style={styles.bulletPoint}>
          • Définir et suivre vos objectifs nutritionnels
        </Text>

        <Text style={styles.sectionTitle}>3. Compte utilisateur</Text>
        <Text style={styles.paragraph}>
          Pour utiliser Bloom, vous devez créer un compte avec une adresse email
          valide. Vous êtes responsable de la confidentialité de vos identifiants
          de connexion.
        </Text>

        <Text style={styles.sectionTitle}>4. Utilisation acceptable</Text>
        <Text style={styles.paragraph}>Vous vous engagez à :</Text>
        <Text style={styles.bulletPoint}>
          • Fournir des informations exactes lors de l'inscription
        </Text>
        <Text style={styles.bulletPoint}>
          • Utiliser l'application uniquement à des fins personnelles
        </Text>
        <Text style={styles.bulletPoint}>
          • Ne pas tenter de compromettre la sécurité de l'application
        </Text>

        <Text style={styles.sectionTitle}>5. Données de santé</Text>
        <Text style={styles.paragraph}>
          Les informations fournies par Bloom sont à titre informatif uniquement et
          ne constituent pas des conseils médicaux. Consultez un professionnel de
          santé pour tout conseil personnalisé.
        </Text>

        <Text style={styles.sectionTitle}>6. Propriété intellectuelle</Text>
        <Text style={styles.paragraph}>
          L'application Bloom Wellness et tout son contenu sont protégés par les
          lois sur la propriété intellectuelle. Vous ne pouvez pas copier,
          modifier ou distribuer le contenu sans autorisation.
        </Text>

        <Text style={styles.sectionTitle}>7. Limitation de responsabilité</Text>
        <Text style={styles.paragraph}>
          Bloom Wellness ne peut être tenu responsable des dommages directs ou
          indirects résultant de l'utilisation de l'application. L'utilisation se
          fait à vos propres risques.
        </Text>

        <Text style={styles.sectionTitle}>8. Modifications</Text>
        <Text style={styles.paragraph}>
          Nous nous réservons le droit de modifier ces conditions à tout moment.
          Les modifications entreront en vigueur dès leur publication dans
          l'application.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact</Text>
        <Text style={styles.paragraph}>
          Pour toute question concernant ces conditions, contactez-nous à
          support@bloom-wellness.com
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsScreen;
