export type DrinkType =
  | 'water'
  | 'coffee'
  | 'tea'
  | 'juice'
  | 'milk'
  | 'soda'
  | 'infusion'
  | 'other';

export interface DrinkOption {
  id: string;
  type: DrinkType;
  name: string;
  emoji: string;
  defaultMl: number;
  color: string;
}

export interface HydrationEntry {
  id: string;
  userId: string;
  drinkType: DrinkType;
  name: string;
  emoji: string;
  amount: number; // ml
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  createdAt: Date;
}

export interface DailyHydration {
  date: string;
  totalMl: number;
  goalMl: number;
  entries: HydrationEntry[];
  percentage: number;
}

// Options de boissons prédéfinies
export const DRINK_OPTIONS: DrinkOption[] = [
  {
    id: 'water-glass',
    type: 'water',
    name: "Verre d'eau",
    emoji: '💧',
    defaultMl: 250,
    color: '#3B82F6',
  },
  {
    id: 'water-bottle',
    type: 'water',
    name: 'Bouteille',
    emoji: '🍶',
    defaultMl: 500,
    color: '#06B6D4',
  },
  {
    id: 'water-large',
    type: 'water',
    name: 'Grande bouteille',
    emoji: '🧴',
    defaultMl: 1000,
    color: '#0EA5E9',
  },
  {
    id: 'coffee',
    type: 'coffee',
    name: 'Café',
    emoji: '☕',
    defaultMl: 150,
    color: '#8B4513',
  },
  {
    id: 'espresso',
    type: 'coffee',
    name: 'Espresso',
    emoji: '☕',
    defaultMl: 30,
    color: '#5D3A1A',
  },
  {
    id: 'tea',
    type: 'tea',
    name: 'Thé',
    emoji: '🍵',
    defaultMl: 200,
    color: '#228B22',
  },
  {
    id: 'juice',
    type: 'juice',
    name: 'Jus',
    emoji: '🧃',
    defaultMl: 200,
    color: '#FFA500',
  },
  {
    id: 'milk',
    type: 'milk',
    name: 'Lait',
    emoji: '🥛',
    defaultMl: 250,
    color: '#F5F5DC',
  },
  {
    id: 'infusion',
    type: 'infusion',
    name: 'Infusion',
    emoji: '🫖',
    defaultMl: 250,
    color: '#DEB887',
  },
  {
    id: 'soda',
    type: 'soda',
    name: 'Soda',
    emoji: '🥤',
    defaultMl: 330,
    color: '#DC2626',
  },
];

// Constante pour la taille d'un verre standard
export const GLASS_SIZE_ML = 250;
