import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import {
  HydrationEntry,
  DrinkType,
  DRINK_OPTIONS,
} from '@/types/hydration';

const HYDRATION_COLLECTION = 'hydration';

/**
 * Ajouter une entrée d'hydratation
 */
export const addHydrationEntry = async (
  drinkType: DrinkType,
  amount: number,
  customName?: string
): Promise<{ data: HydrationEntry | null; error: string | null }> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { data: null, error: 'Non authentifié' };
    }

    const drinkOption =
      DRINK_OPTIONS.find((d) => d.type === drinkType) || DRINK_OPTIONS[0];
    const now = new Date();

    const entry = {
      userId: user.uid,
      drinkType,
      name: customName || drinkOption.name,
      emoji: drinkOption.emoji,
      amount,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, HYDRATION_COLLECTION), entry);

    return {
      data: {
        id: docRef.id,
        ...entry,
        createdAt: now,
      } as HydrationEntry,
      error: null,
    };
  } catch (error) {
    console.error("Erreur ajout hydratation:", error);
    return { data: null, error: "Erreur lors de l'ajout de la boisson" };
  }
};

/**
 * Ajouter rapidement avec un preset
 */
export const addQuickDrink = async (
  drinkOptionId: string
): Promise<{ data: HydrationEntry | null; error: string | null }> => {
  const option = DRINK_OPTIONS.find((d) => d.id === drinkOptionId);
  if (!option) {
    return { data: null, error: 'Option non trouvée' };
  }

  return addHydrationEntry(option.type, option.defaultMl, option.name);
};

/**
 * Supprimer une entrée
 */
export const deleteHydrationEntry = async (
  entryId: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    await deleteDoc(doc(db, HYDRATION_COLLECTION, entryId));
    return { success: true, error: null };
  } catch (error) {
    console.error("Erreur suppression hydratation:", error);
    return { success: false, error: 'Erreur lors de la suppression' };
  }
};

/**
 * Listener temps réel pour l'hydratation du jour
 */
export const subscribeToHydration = (
  date: string,
  callback: (entries: HydrationEntry[]) => void
): (() => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, HYDRATION_COLLECTION),
    where('userId', '==', user.uid),
    where('date', '==', date),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const entries = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        } as HydrationEntry;
      });
      callback(entries);
    },
    (error) => {
      console.error('Erreur subscription hydratation:', error);
      callback([]);
    }
  );
};
