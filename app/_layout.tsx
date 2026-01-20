import { ONBOARDING_KEY } from "@/constants/global";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@/style/colors";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function RootLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuthAndOnboarding();
  }, [user, isLoading, segments]);

  const checkAuthAndOnboarding = async () => {
    if (isLoading) return;

    if (await checkOnboardingStatus() === "onboarding") {
      router.replace("/onboarding");
      return;
    }
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";

    if (!user && !inAuthGroup && !inOnboarding) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  };

  const checkOnboardingStatus = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);

      if (hasSeenOnboarding === "true") {
        return "login";
      } else {
        return "onboarding";
      }
    } catch (error) {
      console.error("Erreur vérification onboarding:", error);
      return "onboarding";
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryDark,
  },
});