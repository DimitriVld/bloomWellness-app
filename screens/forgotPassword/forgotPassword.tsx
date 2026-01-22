import Button from "@/components/Button";
import Input from "@/components/Input";
import { resetPassword } from "@/services/authService";
import { colors } from "@/style/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import forgotPasswordStyles from "./styles";

const ForgotPasswordScreen = () => {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError("L'email est requis");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("L'email n'est pas valide");
      return;
    }

    setLoading(true);
    setError("");

    const { success, error: resetError } = await resetPassword(email);

    setLoading(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    if (success) {
      setSent(true);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (sent) {
    return (
      <View style={forgotPasswordStyles.container}>
        <StatusBar barStyle="light-content" />

        <View style={[forgotPasswordStyles.header, { paddingTop: insets.top + 20 }]}>
          <View style={forgotPasswordStyles.decorCircle1} />
          <View style={forgotPasswordStyles.decorCircle2} />
        </View>

        <View style={forgotPasswordStyles.successContainer}>
          <View style={forgotPasswordStyles.successIcon}>
            <Ionicons name="mail-open-outline" size={48} color={colors.primary} />
          </View>
          <Text style={forgotPasswordStyles.successTitle}>Email envoyé ! 📬</Text>
          <Text style={forgotPasswordStyles.successText}>
            Nous avons envoyé un lien de réinitialisation à{"\n"}
            <Text style={forgotPasswordStyles.successEmail}>{email}</Text>
          </Text>
          <Text style={forgotPasswordStyles.successHint}>
            Vérifie aussi tes spams si tu ne le vois pas.
          </Text>

          <Button
            title="Retour à la connexion"
            onPress={goBack}
            style={forgotPasswordStyles.backButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={forgotPasswordStyles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[forgotPasswordStyles.header, { paddingTop: insets.top + 20 }]}>
        <View style={forgotPasswordStyles.decorCircle1} />
        <View style={forgotPasswordStyles.decorCircle2} />
        <TouchableOpacity style={forgotPasswordStyles.backArrow} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>

        <View style={forgotPasswordStyles.iconContainer}>
          <Ionicons name="key-outline" size={36} color={colors.white} />
        </View>
        <Text style={forgotPasswordStyles.headerTitle}>Mot de passe oublié</Text>
        <Text style={forgotPasswordStyles.headerSubtitle}>
          Pas de panique, ça arrive à tout le monde !
        </Text>
      </View>

      <KeyboardAvoidingView
        style={forgotPasswordStyles.formWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={forgotPasswordStyles.formCard}
          contentContainerStyle={forgotPasswordStyles.formCardContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={forgotPasswordStyles.instructions}>
            Entre ton adresse email et nous t'enverrons un lien pour réinitialiser ton mot de passe.
          </Text>

          <Input
            label="Email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={error}
            icon="mail"
          />

          <Button
            title="Envoyer le lien"
            onPress={handleResetPassword}
            loading={loading}
            style={forgotPasswordStyles.sendButton}
          />

          <TouchableOpacity style={forgotPasswordStyles.footer} onPress={goBack}>
            <Ionicons name="arrow-back" size={16} color={colors.gray} />
            <Text style={forgotPasswordStyles.footerText}> Retour à la connexion</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;