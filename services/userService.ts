import { db } from "@/config/firebase";
import {
  UserProfile,
  UserGoals,
  DEFAULT_USER_GOALS,
  NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
} from "@/types/user";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const USERS_COLLECTION = "users";

export const createUserProfile = async (
  uid: string,
  email: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
      uid,
      email,
      displayName: null,
      photoURL: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Erreur création profil:", error);
    return { success: false, error: "Erreur lors de la création du profil" };
  }
};

export const getUserProfile = async (
  uid: string
): Promise<{ profile: UserProfile | null; error: string | null }> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { profile: null, error: null };
    }

    const data = userSnap.data();

    if (!data.uid || !data.email) {
      return { profile: null, error: "Données de profil invalides" };
    }

    return {
      profile: {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL: data.photoURL,
        goals: data.goals || DEFAULT_USER_GOALS,
        weight: data.weight,
        height: data.height,
        birthDate: data.birthDate,
        gender: data.gender,
        activityLevel: data.activityLevel,
        weightGoal: data.weightGoal,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      },
      error: null,
    };
  } catch (error: any) {
    console.error("Erreur récupération profil:", error);
    return { profile: null, error: "Erreur lors de la récupération du profil" };
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<
    Pick<
      UserProfile,
      | "displayName"
      | "firstName"
      | "lastName"
      | "photoURL"
      | "weight"
      | "height"
      | "birthDate"
      | "gender"
      | "activityLevel"
      | "weightGoal"
    >
  >
): Promise<{ success: boolean; error: string | null }> => {
  try {
    // Filtrer les valeurs undefined (Firestore ne les accepte pas)
    const filteredUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filteredUpdates[key] = value;
      }
    }

    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...filteredUpdates,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Erreur mise à jour profil:", error);
    return { success: false, error: "Erreur lors de la mise à jour du profil" };
  }
};

export const updateUserGoals = async (
  uid: string,
  goals: UserGoals
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);

    await updateDoc(userRef, {
      goals,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Erreur mise à jour objectifs:", error);
    return { success: false, error: "Erreur lors de la mise à jour des objectifs" };
  }
};

/**
 * Mettre à jour les paramètres de notifications
 * Stocké directement dans le document utilisateur pour éviter les problèmes de permissions
 */
export const updateNotificationSettings = async (
  uid: string,
  settings: NotificationSettings
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      notificationSettings: settings,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Erreur mise à jour notifications:", error);
    return { success: false, error: "Erreur lors de la mise à jour des notifications" };
  }
};

/**
 * Obtenir les paramètres de notifications
 * Récupéré depuis le document utilisateur
 */
export const getNotificationSettings = async (
  uid: string
): Promise<NotificationSettings | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().notificationSettings) {
      return userSnap.data().notificationSettings as NotificationSettings;
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  } catch (error) {
    console.error("Erreur récupération notifications:", error);
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
};
