import useUserProfile from "@/hooks/useUserProfile";
import { signOut } from "@/services/authService";
import { updateUserProfile } from "@/services/userService";
import { colors } from "@/style/colors";
import { spacing } from "@/style/spacing";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import accountStyles from "./styles";

const getInitials = (name: string | null, email: string | null): string => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return "?";
};

const AccountScreen = () => {
  const insets = useSafeAreaInsets();
  const { profile, isLoading, refetch } = useUserProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const hasChanges = displayName !== (profile?.displayName || "");

  const handleSave = async () => {
    if (!profile?.uid || !hasChanges) return;

    setIsSaving(true);
    const { error } = await updateUserProfile(profile.uid, {
      displayName: displayName.trim() || null,
    });
    setIsSaving(false);

    if (error) {
      Alert.alert("Erreur", error);
      return;
    }

    await refetch();
    Alert.alert("Succès", "Profil mis à jour");
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            setIsLoggingOut(true);
            await signOut();
          },
        },
      ]
    );
  };

  // Sync local state when profile loads
  useEffect(() => {
    if (profile?.displayName && displayName === "") {
      setDisplayName(profile.displayName);
    }
  }, [profile?.displayName]);

  if (isLoading) {
    return (
      <View style={[accountStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={accountStyles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}
    >
      <View style={[accountStyles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={accountStyles.title}>Mon profil</Text>

        <View style={accountStyles.avatarContainer}>
          {profile?.photoURL ? (
            <Image
              source={{ uri: profile.photoURL }}
              style={accountStyles.avatarImage}
            />
          ) : (
            <View style={accountStyles.avatar}>
              <Text style={accountStyles.avatarText}>
                {getInitials(profile?.displayName || null, profile?.email || null)}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={accountStyles.editAvatarButton}
            onPress={() => Alert.alert("Info", "Changement de photo bientôt disponible")}
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <Text style={accountStyles.userName}>
          {profile?.displayName || "Utilisateur"}
        </Text>
        <Text style={accountStyles.userEmail}>{profile?.email}</Text>
      </View>

      <View style={accountStyles.content}>
        <View style={accountStyles.section}>
          <Text style={accountStyles.sectionTitle}>Informations</Text>

          <View style={accountStyles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color={colors.gray}
              style={accountStyles.inputIcon}
            />
            <TextInput
              style={accountStyles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Votre nom"
              placeholderTextColor={colors.lightGray}
              autoCapitalize="words"
            />
            {hasChanges && (
              <TouchableOpacity
                style={accountStyles.saveButton}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={accountStyles.saveButtonText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={accountStyles.section}>
          <Text style={accountStyles.sectionTitle}>Email</Text>
          <View style={accountStyles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={colors.gray} />
            <Text style={accountStyles.infoText}>{profile?.email}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={accountStyles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={accountStyles.logoutButtonText}>Se déconnecter</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AccountScreen;
