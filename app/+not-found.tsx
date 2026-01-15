import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Page introuvable</Text>
      <Text>Le lien que tu as ouvert n’existe pas.</Text>

      <Link href="/" style={{ marginTop: 12 }}>
        Retour à l’accueil
      </Link>
    </View>
  );
}
