import { Stack } from 'expo-router';

const MealLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="food-search" />
      <Stack.Screen name="food-detail" />
      <Stack.Screen name="manual-entry" />
      <Stack.Screen name="barcode-scanner" />
      <Stack.Screen name="camera" />
      <Stack.Screen name="meal-result" />
    </Stack>
  );
};

export default MealLayout;
