import { db } from "@/config/firebase";
import { UserProfile, UserGoals, DEFAULT_USER_GOALS } from "@/types/user";
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
        photoURL: data.photoURL,
        goals: data.goals || DEFAULT_USER_GOALS,
        weight: data.weight,
        height: data.height,
        activityLevel: data.activityLevel,
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
  updates: Partial<Pick<UserProfile, "displayName" | "photoURL" | "weight" | "height" | "activityLevel">>
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...updates,
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
  goals: Partial<UserGoals>
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);

    // Récupérer les goals actuels pour merger
    const userSnap = await getDoc(userRef);
    const currentGoals = userSnap.exists()
      ? userSnap.data().goals || DEFAULT_USER_GOALS
      : DEFAULT_USER_GOALS;

    await updateDoc(userRef, {
      goals: { ...currentGoals, ...goals },
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Erreur mise à jour objectifs:", error);
    return { success: false, error: "Erreur lors de la mise à jour des objectifs" };
  }
};
