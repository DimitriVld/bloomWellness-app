import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

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
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.log(error)
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

export const signInWithGoogle = async () => {
  // TODO: Implémenter quand tu passeras en dev build
  return {
    user: null,
    error: "Google Sign-In nécessite un dev build. Utilise email/password pour l'instant."
  };
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