import useBarcode from '@/hooks/useBarcode';
import { colors } from '@/style/colors';
import { spacing } from '@/style/spacing';
import { MealType } from '@/types/meal';
import { Ionicons } from '@expo/vector-icons';
import { CameraView } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BarcodeScannerScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ mealType: MealType }>();
  const mealType = params.mealType || 'lunch';

  const {
    hasPermission,
    isScanning,
    scannedFood,
    isLoading,
    error,
    handleBarcodeScan,
    startScanning,
    reset,
  } = useBarcode();

  useEffect(() => {
    startScanning();
  }, []);

  useEffect(() => {
    if (scannedFood) {
      router.push({
        pathname: '/(meal)/food-detail',
        params: {
          mealType,
          foodData: JSON.stringify(scannedFood),
        },
      });
    }
  }, [scannedFood, mealType, router]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!isLoading && isScanning) {
      handleBarcodeScan(data);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Vérification des permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View
        style={[
          styles.container,
          styles.centerContent,
          { paddingTop: insets.top },
        ]}
      >
        <View style={styles.permissionCard}>
          <Ionicons name="camera-outline" size={64} color={colors.gray} />
          <Text style={styles.permissionTitle}>Accès caméra requis</Text>
          <Text style={styles.permissionText}>
            Pour scanner les codes-barres, autorise l'accès à la caméra dans les
            paramètres.
          </Text>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Ouvrir les paramètres</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.back()}
          >
            <Text style={styles.backLinkText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={[styles.overlay, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={28} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          {isLoading ? (
            <View style={styles.statusCard}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.statusText}>Recherche du produit...</Text>
            </View>
          ) : error ? (
            <View style={styles.statusCard}>
              <Ionicons name="alert-circle" size={24} color={colors.red} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={reset}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.instructionCard}>
              <Text style={styles.instructionText}>
                Place le code-barres dans le cadre
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.gray,
  },
  permissionCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.xl,
    marginHorizontal: spacing.lg,
    alignItems: 'center',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.black,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  permissionText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  settingsButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  settingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  backLink: {
    marginTop: spacing.md,
  },
  backLinkText: {
    fontSize: 14,
    color: colors.primary,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 280,
    height: 180,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.primary,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  footer: {
    paddingHorizontal: spacing.md,
  },
  statusCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: colors.red,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  instructionCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
  },
});

export default BarcodeScannerScreen;
