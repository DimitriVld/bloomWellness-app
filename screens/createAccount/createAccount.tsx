import Button from "@/components/Button";
import Input from "@/components/Input";
import { signUpWithEmail } from "@/services/authService";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import createAccountStyles from "./styles";

/**
 * 📝 CreateAccountScreen - Inscription avec design Wave
 */
const CreateAccountScreen = () => {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 caractères";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmez le mot de passe";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const { user, error } = await signUpWithEmail(email, password);

    setLoading(false);

    if (error) {
      if (error.includes("email")) {
        setErrors({ email: error });
      } else {
        Alert.alert("Erreur", error);
      }
      return;
    }

    if (user) {
      console.log("✅ Compte créé:", user.email);
      Alert.alert(
        "Compte créé ! 🎉",
        "Bienvenue sur Bloom Wellness !",
        [{ text: "C'est parti !" }]
      );
    }
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <View style={createAccountStyles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[createAccountStyles.header, { paddingTop: insets.top + 20 }]}>
        <View style={createAccountStyles.decorCircle1} />
        <View style={createAccountStyles.decorCircle2} />

        <Text style={createAccountStyles.headerTitle}>Créer un compte</Text>
        <Text style={createAccountStyles.headerSubtitle}>
          Rejoignez la communauté Bloom Wellness
        </Text>
      </View>

      <KeyboardAvoidingView
        style={createAccountStyles.formWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={createAccountStyles.formCard}
          contentContainerStyle={createAccountStyles.formCardContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            icon="mail"
          />

          <Input
            label="Mot de passe"
            placeholder="Minimum 6 caractères"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoCapitalize="none"
            error={errors.password}
            icon="lock"
          />

          <Input
            label="Confirmer le mot de passe"
            placeholder="Retapez votre mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            autoCapitalize="none"
            error={errors.confirmPassword}
            icon="lock"
          />

          <Button
            title="Créer mon compte"
            onPress={handleCreateAccount}
            loading={loading}
            style={createAccountStyles.createButton}
          />

          <View style={createAccountStyles.footer}>
            <Text style={createAccountStyles.footerText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={createAccountStyles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateAccountScreen;