import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { MealType } from '@/types/meal';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CameraScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType: MealType }>();
  const mealType = params.mealType || 'lunch';

  const [isLoading, setIsLoading] = useState(false);

  const handleImageResult = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.base64) {
        router.push({
          pathname: '/(meal)/meal-result',
          params: {
            mealType,
            imageBase64: asset.base64,
            imageUri: asset.uri,
          },
        });
      } else {
        Alert.alert('Erreur', "Impossible de lire l'image");
      }
    }
  };

  const takePhoto = async () => {
    setIsLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          "Autorise l'accès à la caméra pour prendre une photo de ton repas."
        );
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      handleImageResult(result);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    } finally {
      setIsLoading(false);
    }
  };

  const pickFromGallery = async () => {
    setIsLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Autorise l\'accès à la galerie pour sélectionner une photo.'
        );
        setIsLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      handleImageResult(result);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'accéder à la galerie");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={28} color={colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📸</Text>
        </View>
        <Text style={styles.title}>Ajouter une photo</Text>
        <Text style={styles.subtitle}>
          Prends une photo de ton repas et l'IA analysera automatiquement les
          aliments et leurs valeurs nutritionnelles.
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color={colors.white} />
              <Text style={styles.primaryButtonText}>Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={pickFromGallery}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Choisir depuis la galerie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.infoCard}>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <Text style={styles.infoText}>
            L'IA identifie les aliments et estime les calories avec une précision
            de 85%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.beige,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray,
  },
  buttonsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryOpacity20,
    borderRadius: 12,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    lineHeight: 18,
  },
});

export default CameraScreen;
