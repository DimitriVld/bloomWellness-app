import useUserProfile from "@/hooks/useUserProfile";
import { spacing } from "@/style/spacing";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import homeStyles from "./styles";

const getFormattedDate = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return new Date().toLocaleDateString("fr-FR", options);
};

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { profile } = useUserProfile();

  const greeting = profile?.displayName
    ? `Bonjour ${profile.displayName}`
    : "Bonjour";

  return (
    <View style={homeStyles.container}>
      <View style={[homeStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={homeStyles.greeting}>{greeting}</Text>
        <Text style={homeStyles.date}>{getFormattedDate()}</Text>
      </View>
      <View style={homeStyles.content}>
        {/* Contenu futur de l'écran Home */}
      </View>
    </View>
  );
};

export default HomeScreen;
