import { AIAnalysisResult, FoodItem } from '@/types/meal';
import OpenAI from 'openai';

const getOpenAIClient = () => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Clé API OpenAI non configurée');
  }
  return new OpenAI({ apiKey });
};

export const analyzeFoodImage = async (
  imageBase64: string
): Promise<{ data: AIAnalysisResult | null; error: string | null }> => {
  try {
    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyse cette photo de nourriture et identifie chaque aliment visible.
Pour chaque aliment, estime les valeurs nutritionnelles.

Réponds UNIQUEMENT avec un JSON valide (pas de texte avant/après) avec ce format exact:
{
  "foods": [
    {
      "name": "nom en français",
      "emoji": "emoji représentatif",
      "portionEstimate": nombre en grammes,
      "caloriesPer100g": nombre,
      "proteinPer100g": nombre,
      "carbsPer100g": nombre,
      "fatPer100g": nombre
    }
  ],
  "confidence": nombre entre 0 et 1
}

Si aucun aliment n'est détecté, réponds: {"foods": [], "confidence": 0, "error": "Aucun aliment détecté"}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { data: null, error: "Pas de réponse de l'IA" };
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { data: null, error: 'Format de réponse invalide' };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.error) {
      return { data: null, error: parsed.error };
    }

    if (!parsed.foods || !Array.isArray(parsed.foods) || parsed.foods.length === 0) {
      return { data: null, error: 'Aucun aliment détecté sur cette image' };
    }

    const foods: FoodItem[] = parsed.foods.map((food: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      name: food.name || 'Aliment inconnu',
      emoji: food.emoji || '🍽️',
      nutritionPer100g: {
        calories: Math.round(food.caloriesPer100g || 0),
        protein: Math.round((food.proteinPer100g || 0) * 10) / 10,
        carbs: Math.round((food.carbsPer100g || 0) * 10) / 10,
        fat: Math.round((food.fatPer100g || 0) * 10) / 10,
      },
      defaultPortionSize: Math.round(food.portionEstimate || 100),
      source: 'ai' as const,
    }));

    return {
      data: {
        foods,
        confidence: parsed.confidence || 0.8,
        rawResponse: content,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Erreur analyse IA:', error);

    if (error.message?.includes('API')) {
      return { data: null, error: 'Erreur de connexion à OpenAI' };
    }
    if (error.message?.includes('JSON')) {
      return { data: null, error: "Erreur d'analyse de la réponse" };
    }

    return { data: null, error: "Erreur lors de l'analyse de l'image" };
  }
};
