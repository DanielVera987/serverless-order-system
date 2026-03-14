import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import IngredientRepositoryDomain from '../../domain/repository/IngredientRepository';
import Ingredient from '../../domain/entity/Ingredient';
import types from '../../../../services/kitchen/functions/getIngredients/Types';

@Injectable()
export default class GetIngredientsUseCase implements UseCase<unknown, Ingredient[]> {
  constructor(
    @Inject(types.IngredientRepository) private readonly ingredientRepository: IngredientRepositoryDomain,
  ) {}

  async execute(): Promise<Ingredient[]> {
    try {
      const ingredients = await this.ingredientRepository.getAll();
      console.log('📊 GetIngredientsUseCase ingredients', JSON.stringify(ingredients));
      return ingredients;
    } catch (error) {
      console.error(`❌ GetIngredientsUseCase: Error getting all ingredients`, error);
      throw new Error(`❌ GetIngredientsUseCase: Error getting all ingredients`);
    }
  }
}