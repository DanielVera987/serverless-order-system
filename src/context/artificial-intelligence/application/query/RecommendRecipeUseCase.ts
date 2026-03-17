import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import AI, { AIMessage } from '../../../shared/domain/artificial-intelligence/ai';
import TypesShared from '../../../shared/SharedTypes';
import types from '../../../../services/artificial-intelligence/functions/recommendRecipe/types';
import IngredientsRepositoryDomain from '../../domain/repository/IngredientsRepository';
import Recipe from '../../../kitchen/domain/entity/Recipe';
import RecipeRepositoryDomain from '../../domain/repository/RecipeRepository';

@Injectable()
export default class RecommendRecipeUseCase implements UseCase<string, string> {
  constructor(
    @Inject(TypesShared.AI) private readonly ai: AI,
    @Inject(types.IngredientsRepository) private readonly ingredientsRepository: IngredientsRepositoryDomain,
    @Inject(types.RecipeRepository) private readonly recipeRepository: RecipeRepositoryDomain
  ) {}

  async execute(request: string): Promise<string> {
    const systemPrompt = await this.getSystemPrompt();
    const ingredients = await this.ingredientsRepository.getAll();
    const userPrompt = `Available ingredients: ${ingredients.join(', ')}`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const response = await this.ai.chat(messages, {
      temperature: 0.5
    });

    const responseData = JSON.parse(response);

    console.log('🚀 RecommendRecipeUseCase response', responseData);

    await this.saveRecipes(responseData.recipes);

    return responseData;
  }

  private async getSystemPrompt(): Promise<string> {
    return `
    You’re a helpful assistant who recommends recipes based on available ingredients.
    You will be given a list of ingredients and you will have to recommend a recipe based on the available ingredients.
    You will need to return the recipe name and ingredients.
    Do not invent or add ingredients to the list, those provided are the ones you should use
    Don’t leave your role, just recommend ingredient-based recipes
    You must return only 6 recipes
    Answers only in valid JSON. Don’t include extra text outside of the JSON.
    You must return the recipes in the following format:
    {
      "recipes": [
        {
          "name": "Recipe Name",
          "ingredients": [
            {
              "name": "Ingredient Name",
              "quantity": number
            }
          ]
        }
      ]
    }
    `;
  }

  private async saveRecipes(recipes: Recipe[]): Promise<void> {
    try {
      const recipesToSave = [];

      for (let i = 0; i < recipes.length; i++) {
        recipesToSave.push({
          id: `recipe-${i + 1}`,
          name: recipes[i].name,
          ingredients: recipes[i].ingredients.map(ingredient => ({
            name: ingredient.name,
            quantity: ingredient.quantity
          })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      console.log('🔵 RecommendRecipeUseCase: recipesToSave', recipesToSave);

      await this.recipeRepository.createBulk(recipesToSave);
    } catch (error) {
      console.error(`❌ ${this.constructor.name}: Error saving recipes`, error);
      throw new Error(`❌ ${this.constructor.name}: Error saving recipes`);
    }
  }
}