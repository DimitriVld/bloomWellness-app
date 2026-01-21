import Button from "@/components/Button";
import Input from "@/components/Input";
import GoogleIcon from "@/icons/GoogleIcon";
import { signInWithEmail } from "@/services/authService";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import loginStyles from "./styles";

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    const { error } = await signInWithEmail(email, password);

    setLoading(false);

    if (error) {
      if (error.includes("email")) {
        setErrors({ email: error });
      } else if (error.includes("mot de passe") || error.includes("password")) {
        setErrors({ password: error });
      } else {
        Alert.alert("Erreur", error);
      }
      return;
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      "Bientôt disponible",
      "La connexion Google sera disponible dans une prochaine version.\n\nUtilise email/mot de passe pour l'instant !",
      [{ text: "OK" }]
    );
  };

  const goToCreateAccount = () => {
    router.push("/(auth)/create-account");
  };

  const goToForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  return (
    <View style={loginStyles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[loginStyles.header, { paddingTop: insets.top + 20 }]}>
        <View style={loginStyles.decorCircle1} />
        <View style={loginStyles.decorCircle2} />
        <View style={loginStyles.logoContainer}>
          <Image
            source={require("@/assets/images/Bw-icon.png")}
            style={loginStyles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={loginStyles.headerTitle}>Bloom Wellness</Text>
        <Text style={loginStyles.headerSubtitle}>
          Votre parcours bien-être commence ici
        </Text>
      </View>

      <KeyboardAvoidingView
        style={loginStyles.formWrapper}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={loginStyles.formCard}
          contentContainerStyle={loginStyles.formCardContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={loginStyles.formTitle}>Connexion</Text>
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
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password}
            icon="lock"
          />

          <TouchableOpacity
            onPress={goToForgotPassword}
            style={loginStyles.forgotPassword}
          >
            <Text style={loginStyles.forgotPasswordText}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>

          <Button
            title="Se connecter"
            onPress={handleEmailLogin}
            loading={loading}
            disabled={googleLoading}
            style={loginStyles.loginButton}
          />

          <View style={loginStyles.divider}>
            <View style={loginStyles.dividerLine} />
            <Text style={loginStyles.dividerText}>ou</Text>
            <View style={loginStyles.dividerLine} />
          </View>

          <Button
            title="Continuer avec Google"
            onPress={handleGoogleLogin}
            variant="google"
            loading={googleLoading}
            disabled={loading}
            icon={<GoogleIcon />}
          />

          <View style={loginStyles.footer}>
            <Text style={loginStyles.footerText}>Pas de compte ? </Text>
            <TouchableOpacity onPress={goToCreateAccount}>
              <Text style={loginStyles.footerLink}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;