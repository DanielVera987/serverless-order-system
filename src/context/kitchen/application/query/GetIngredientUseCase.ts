import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import IngredientRepositoryDomain from '../../domain/repository/IngredientRepository';
import Ingredient from '../../domain/entity/Ingredient';
import types from '../../../kitchen/Types';
import Logger from '../../../shared/domain/logger/Logger';
import { QueryError } from '../../../shared/domain/errors/DomainError';

@Injectable()
export default class GetIngredientsUseCase implements UseCase<unknown, Ingredient[]> {
  constructor(
    @Inject(types.IngredientRepository) private readonly ingredientRepository: IngredientRepositoryDomain,
  ) {}

  async execute(): Promise<Ingredient[]> {
    try {
      const ingredients = await this.ingredientRepository.getAll();
      Logger.log(`GetIngredientsUseCase ingredients: ${JSON.stringify(ingredients)}`);
      return ingredients;
    } catch (error) {
      Logger.error('GetIngredientsUseCase: Error getting all ingredients', error);
      throw new QueryError('Failed to fetch ingredients', error);
    }
  }
}