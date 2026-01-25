import { FoodItem, FoodSearchResult, NutritionInfo } from '@/types/meal';

const API_BASE = 'https://world.openfoodfacts.org';

export const searchFoods = async (
  query: string,
  page: number = 1
): Promise<{ data: FoodSearchResult | null; error: string | null }> => {
  try {
    const response = await fetch(
      `${API_BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=20&fields=code,product_name,product_name_fr,brands,image_front_small_url,nutriments,categories_tags,serving_quantity`
    );

    if (!response.ok) {
      return { data: null, error: 'Erreur de connexion au serveur' };
    }

    const json = await response.json();

    const products = (json.products || [])
      .filter((p: any) => p.product_name || p.product_name_fr)
      .map(mapProductToFoodItem);

    return {
      data: {
        products,
        total: json.count || 0,
        page,
        hasMore: page * 20 < (json.count || 0),
      },
      error: null,
    };
  } catch (error) {
    console.error('Erreur recherche Open Food Facts:', error);
    return { data: null, error: 'Erreur lors de la recherche' };
  }
};

export const getFoodByBarcode = async (
  barcode: string
): Promise<{ data: FoodItem | null; error: string | null }> => {
  try {
    const response = await fetch(`${API_BASE}/api/v0/product/${barcode}.json`);

    if (!response.ok) {
      return { data: null, error: 'Erreur de connexion au serveur' };
    }

    const json = await response.json();

    if (json.status !== 1 || !json.product) {
      return { data: null, error: 'Produit non trouvé' };
    }

    return { data: mapProductToFoodItem(json.product), error: null };
  } catch (error) {
    console.error('Erreur barcode Open Food Facts:', error);
    return { data: null, error: 'Erreur lors de la récupération du produit' };
  }
};

const mapProductToFoodItem = (product: any): FoodItem => {
  const nutriments = product.nutriments || {};

  const nutrition: NutritionInfo = {
    calories: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
    protein: Math.round((nutriments.proteins_100g || nutriments.proteins || 0) * 10) / 10,
    carbs: Math.round((nutriments.carbohydrates_100g || nutriments.carbohydrates || 0) * 10) / 10,
    fat: Math.round((nutriments.fat_100g || nutriments.fat || 0) * 10) / 10,
    fiber: nutriments.fiber_100g ? Math.round(nutriments.fiber_100g * 10) / 10 : undefined,
    sugar: nutriments.sugars_100g ? Math.round(nutriments.sugars_100g * 10) / 10 : undefined,
    sodium: nutriments.sodium_100g ? Math.round(nutriments.sodium_100g * 1000) : undefined,
  };

  return {
    id: product.code || product._id || String(Date.now()),
    name: product.product_name_fr || product.product_name || 'Produit inconnu',
    brand: product.brands || undefined,
    emoji: getFoodEmoji(product.product_name_fr || product.product_name, product.categories_tags),
    barcode: product.code,
    imageUrl: product.image_front_small_url || product.image_url,
    nutritionPer100g: nutrition,
    defaultPortionSize: product.serving_quantity || 100,
    category: product.categories_tags?.[0],
    source: 'openFoodFacts',
  };
};

export const getFoodEmoji = (name?: string, categories?: string[]): string => {
  const nameLower = (name || '').toLowerCase();
  const categoryStr = (categories || []).join(' ').toLowerCase();

  if (nameLower.includes('pomme') || categoryStr.includes('apple')) return '🍎';
  if (nameLower.includes('banane') || categoryStr.includes('banana')) return '🍌';
  if (nameLower.includes('orange')) return '🍊';
  if (nameLower.includes('fraise') || categoryStr.includes('strawberr')) return '🍓';
  if (nameLower.includes('raisin') || categoryStr.includes('grape')) return '🍇';
  if (nameLower.includes('citron') || categoryStr.includes('lemon')) return '🍋';
  if (nameLower.includes('pêche') || categoryStr.includes('peach')) return '🍑';
  if (nameLower.includes('cerise') || categoryStr.includes('cherr')) return '🍒';
  if (nameLower.includes('pastèque') || categoryStr.includes('watermelon')) return '🍉';
  if (nameLower.includes('ananas') || categoryStr.includes('pineapple')) return '🍍';
  if (nameLower.includes('avocat') || categoryStr.includes('avocado')) return '🥑';
  if (nameLower.includes('carotte') || categoryStr.includes('carrot')) return '🥕';
  if (nameLower.includes('brocoli') || categoryStr.includes('broccoli')) return '🥦';
  if (nameLower.includes('salade') || categoryStr.includes('salad')) return '🥗';
  if (nameLower.includes('tomate') || categoryStr.includes('tomato')) return '🍅';
  if (nameLower.includes('maïs') || categoryStr.includes('corn')) return '🌽';
  if (nameLower.includes('pomme de terre') || categoryStr.includes('potato')) return '🥔';
  if (nameLower.includes('oignon') || categoryStr.includes('onion')) return '🧅';
  if (nameLower.includes('ail') || categoryStr.includes('garlic')) return '🧄';
  if (nameLower.includes('champignon') || categoryStr.includes('mushroom')) return '🍄';
  if (nameLower.includes('pâtes') || nameLower.includes('spaghetti') || categoryStr.includes('pasta')) return '🍝';
  if (nameLower.includes('pizza')) return '🍕';
  if (nameLower.includes('hamburger') || nameLower.includes('burger')) return '🍔';
  if (nameLower.includes('sandwich')) return '🥪';
  if (nameLower.includes('taco')) return '🌮';
  if (nameLower.includes('sushi')) return '🍣';
  if (nameLower.includes('poulet') || categoryStr.includes('chicken')) return '🍗';
  if (nameLower.includes('viande') || categoryStr.includes('meat') || categoryStr.includes('beef')) return '🥩';
  if (nameLower.includes('poisson') || categoryStr.includes('fish')) return '🐟';
  if (nameLower.includes('crevette') || categoryStr.includes('shrimp')) return '🦐';
  if (nameLower.includes('oeuf') || nameLower.includes('œuf') || categoryStr.includes('egg')) return '🥚';
  if (nameLower.includes('pain') || categoryStr.includes('bread')) return '🍞';
  if (nameLower.includes('croissant')) return '🥐';
  if (nameLower.includes('baguette')) return '🥖';
  if (nameLower.includes('riz') || categoryStr.includes('rice')) return '🍚';
  if (nameLower.includes('céréale') || categoryStr.includes('cereal')) return '🥣';
  if (nameLower.includes('fromage') || categoryStr.includes('cheese')) return '🧀';
  if (nameLower.includes('lait') || categoryStr.includes('milk')) return '🥛';
  if (nameLower.includes('yaourt') || nameLower.includes('yogourt') || categoryStr.includes('yogurt')) return '🥛';
  if (nameLower.includes('beurre') || categoryStr.includes('butter')) return '🧈';
  if (nameLower.includes('café') || categoryStr.includes('coffee')) return '☕';
  if (nameLower.includes('thé') || categoryStr.includes('tea')) return '🍵';
  if (nameLower.includes('jus') || categoryStr.includes('juice')) return '🧃';
  if (nameLower.includes('eau') || categoryStr.includes('water')) return '💧';
  if (nameLower.includes('soda') || categoryStr.includes('soda') || categoryStr.includes('soft drink')) return '🥤';
  if (nameLower.includes('bière') || categoryStr.includes('beer')) return '🍺';
  if (nameLower.includes('vin') || categoryStr.includes('wine')) return '🍷';
  if (nameLower.includes('chocolat') || categoryStr.includes('chocolate')) return '🍫';
  if (nameLower.includes('bonbon') || categoryStr.includes('candy')) return '🍬';
  if (nameLower.includes('gâteau') || categoryStr.includes('cake')) return '🍰';
  if (nameLower.includes('biscuit') || categoryStr.includes('cookie') || categoryStr.includes('biscuit')) return '🍪';
  if (nameLower.includes('glace') || categoryStr.includes('ice cream')) return '🍨';
  if (nameLower.includes('miel') || categoryStr.includes('honey')) return '🍯';
  if (nameLower.includes('noix') || categoryStr.includes('nut')) return '🥜';
  if (categoryStr.includes('dairy') || categoryStr.includes('lait')) return '🥛';
  if (categoryStr.includes('fruit')) return '🍎';
  if (categoryStr.includes('vegetable') || categoryStr.includes('légume')) return '🥬';
  if (categoryStr.includes('snack')) return '🍿';
  if (categoryStr.includes('beverage') || categoryStr.includes('boisson')) return '🥤';

  return '🍽️';
};
