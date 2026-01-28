import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  User,
} from "firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { createUserProfile, getUserProfile } from "./userService";

// Import conditionnel pour Google Sign-In (non disponible dans Expo Go)
let GoogleSignin: any = null;
let isGoogleSignInAvailable = false;

try {
  // Cet import échouera dans Expo Go car le module natif n'est pas disponible
  const googleModule = require("@react-native-google-signin/google-signin");
  GoogleSignin = googleModule.GoogleSignin;
  isGoogleSignInAvailable = true;
} catch {
  console.log("Google Sign-In non disponible (Expo Go). Utilisez un development build.");
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: getErrorMessage(error.code) };
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Créer le profil utilisateur dans Firestore
    await createUserProfile(user.uid, user.email || email);

    return { user, error: null };
  } catch (error: any) {
    console.log(error);
    return { user: null, error: getErrorMessage(error.code) };
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: getErrorMessage(error.code) };
  }
};

/**
 * Configuration de Google Sign-In
 * Doit être appelé au démarrage de l'app (dans _layout.tsx)
 */
export const configureGoogleSignIn = (webClientId: string) => {
  if (!isGoogleSignInAvailable || !GoogleSignin) {
    console.log("Google Sign-In non configuré (module natif non disponible)");
    return;
  }
  GoogleSignin.configure({
    webClientId,
    offlineAccess: true,
  });
};

/**
 * Connexion avec Google
 */
export const signInWithGoogle = async () => {
  // Vérifier si le module est disponible (pas dans Expo Go)
  if (!isGoogleSignInAvailable || !GoogleSignin) {
    return {
      user: null,
      error: "Google Sign-In nécessite un development build. Utilisez 'npx expo run:ios' ou EAS Build.",
    };
  }

  try {
    // Vérifier que Google Play Services est disponible (Android)
    await GoogleSignin.hasPlayServices();

    // Lancer le flow de connexion Google
    const signInResult = await GoogleSignin.signIn();

    // Récupérer l'ID token
    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      return { user: null, error: "Impossible de récupérer le token Google" };
    }

    // Créer les credentials Firebase avec le token Google
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // Connecter à Firebase avec les credentials
    const userCredential = await signInWithCredential(auth, googleCredential);
    const user = userCredential.user;

    // Créer le profil si c'est un nouvel utilisateur
    const { profile } = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, user.email || "");
    }

    return { user, error: null };
  } catch (error: any) {
    console.error("Erreur Google Sign-In:", error);

    // Gérer les erreurs spécifiques
    if (error.code === "SIGN_IN_CANCELLED") {
      return { user: null, error: null }; // L'utilisateur a annulé
    }
    if (error.code === "IN_PROGRESS") {
      return { user: null, error: "Connexion déjà en cours" };
    }
    if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
      return { user: null, error: "Google Play Services non disponible" };
    }

    return { user: null, error: "Erreur lors de la connexion Google" };
  }
};

/**
 * Connexion avec Apple
 */
export const signInWithApple = async () => {
  try {
    // Générer un nonce aléatoire pour la sécurité
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );

    // Lancer le flow de connexion Apple
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    const { identityToken } = appleCredential;
    if (!identityToken) {
      return { user: null, error: "Impossible de récupérer le token Apple" };
    }

    // Créer les credentials Firebase avec le token Apple
    const provider = new OAuthProvider("apple.com");
    const oauthCredential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });

    // Connecter à Firebase avec les credentials
    const userCredential = await signInWithCredential(auth, oauthCredential);
    const user = userCredential.user;

    // Créer le profil si c'est un nouvel utilisateur
    const { profile } = await getUserProfile(user.uid);
    if (!profile) {
      await createUserProfile(user.uid, user.email || appleCredential.email || "");
    }

    return { user, error: null };
  } catch (error: any) {
    console.error("Erreur Apple Sign-In:", error);

    // L'utilisateur a annulé
    if (error.code === "ERR_REQUEST_CANCELED") {
      return { user: null, error: null };
    }

    return { user: null, error: "Erreur lors de la connexion Apple" };
  }
};

/**
 * Vérifier si Apple Sign-In est disponible sur cet appareil
 */
export const isAppleSignInAvailable = async (): Promise<boolean> => {
  return await AppleAuthentication.isAvailableAsync();
};

/**
 * Vérifier si Google Sign-In est disponible (module natif présent)
 */
export const isGoogleSignInAvailableCheck = (): boolean => {
  return isGoogleSignInAvailable;
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: "Erreur lors de la déconnexion" };
  }
};

const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    "auth/invalid-email": "L'adresse email n'est pas valide",
    "auth/user-disabled": "Ce compte a été désactivé",
    "auth/user-not-found": "Aucun compte trouvé avec cet email",
    "auth/wrong-password": "Mot de passe incorrect",
    "auth/email-already-in-use": "Un compte existe déjà avec cet email",
    "auth/weak-password": "Le mot de passe doit contenir au moins 6 caractères",
    "auth/network-request-failed": "Erreur de connexion. Vérifiez votre internet",
    "auth/too-many-requests": "Trop de tentatives. Réessayez plus tard",
    "auth/invalid-credential": "Email ou mot de passe incorrect",
  };

  return errorMessages[errorCode] || "Une erreur est survenue. Réessayez";
};


export const getCurrentUser = () => auth.currentUser;

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseOnAuthStateChanged(auth, callback);
};