import { getFoodByBarcode } from '@/services/openFoodFactsService';
import { FoodItem } from '@/types/meal';
import { Camera } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';

export const useBarcode = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      if (isLoading || barcode === lastScannedCode) return null;

      setLastScannedCode(barcode);
      setIsScanning(false);
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await getFoodByBarcode(barcode);

      setIsLoading(false);

      if (fetchError) {
        setError(fetchError);
        return null;
      }

      setScannedFood(data);
      return data;
    },
    [isLoading, lastScannedCode]
  );

  const startScanning = useCallback(() => {
    setIsScanning(true);
    setError(null);
    setScannedFood(null);
    setLastScannedCode(null);
  }, []);

  const stopScanning = useCallback(() => {
    setIsScanning(false);
  }, []);

  const reset = useCallback(() => {
    setScannedFood(null);
    setError(null);
    setIsScanning(false);
    setLastScannedCode(null);
  }, []);

  return {
    hasPermission,
    isScanning,
    scannedFood,
    isLoading,
    error,
    handleBarcodeScan,
    startScanning,
    stopScanning,
    reset,
  };
};

export default useBarcode;
