import 'reflect-metadata';
import GetIngredientsUseCase from '../../../../../src/context/kitchen/application/query/GetIngredientUseCase';
import { QueryError } from '../../../../../src/context/shared/domain/errors/DomainError';
import { InMemoryIngredientRepository } from '../../infrastructure/repository/InMemoryIngredientRepository';
import Ingredient from '../../../../../src/context/kitchen/domain/entity/Ingredient';

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GetIngredientsUseCase', () => {
  describe('execute', () => {
    it('should return the list of ingredients from the repository', async () => {
      // Arrange
      const ingredients: Ingredient[] = [
        { id: '1', name: 'tomate', quantity: 10 },
        { id: '2', name: 'cebolla', quantity: 5 },
      ];
      const repo = new InMemoryIngredientRepository(ingredients);
      const useCase = new GetIngredientsUseCase(repo);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(ingredients);
    });

    it('should return an empty list when there are no ingredients', async () => {
      // Arrange
      const repo = new InMemoryIngredientRepository([]);
      const useCase = new GetIngredientsUseCase(repo);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });

    it('should return all ingredients without filtering', async () => {
      // Arrange
      const ingredients: Ingredient[] = [
        { id: '1', name: 'tomate', quantity: 10 },
        { id: '2', name: 'cebolla', quantity: 5 },
        { id: '3', name: 'ajo', quantity: 0 },
      ];
      const repo = new InMemoryIngredientRepository(ingredients);
      const useCase = new GetIngredientsUseCase(repo);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toHaveLength(3);
    });

    it('should propagate the error if the repository fails', async () => {
      // Arrange
      const repo = new InMemoryIngredientRepository().simulateFailure();
      const useCase = new GetIngredientsUseCase(repo);

      // Act & Assert
      await expect(useCase.execute()).rejects.toThrow(QueryError);
    });
  });
});
