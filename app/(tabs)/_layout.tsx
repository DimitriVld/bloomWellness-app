import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="add-meal" options={{ title: "Add meal" }} />
      {/* <Tabs.Screen name="account" options={{ title: "Account" }} /> */}
    </Tabs>
  );
}
