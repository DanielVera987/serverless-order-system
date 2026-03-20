import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { IngredientRequest } from '../../domain/ports/IngredientRequest';
import IngredientRepositoryDomain from '../../domain/repository/IngredientRepository';
import Ingredient from '../../domain/entity/Ingredient';
import { v4 as uuidv4 } from 'uuid';
import types from '../../../kitchen/Types';
import Logger from '../../../shared/domain/logger/Logger';

@Injectable()
export class CreateIngredientUseCase implements UseCase<IngredientRequest, Ingredient> {
  constructor(
    @Inject(types.IngredientRepository) private readonly ingredientRepository: IngredientRepositoryDomain,
  ) {}

  async execute(request: IngredientRequest): Promise<Ingredient> {
    Logger.init(`CreateIngredientUseCase execute request: ${request}`);

    try {
      const ingredient: Ingredient = {
        id: uuidv4(),
        name: request.name,
        quantity: request.quantity,
        createdAt: new Date().toISOString(),
      };

      await this.ingredientRepository.create(ingredient);

      Logger.log(`CreateIngredientUseCase ingredient created: ${ingredient}`);

      return ingredient;
    } catch (error) {
      console.error(`❌ CreateIngredientUseCase: Error creating ingredient`, error);
      throw new Error(`❌ CreateIngredientUseCase: Error creating ingredient`);
    }
  }
}
