import Ingredient from "../../../../../src/context/kitchen/domain/entity/Ingredient";
import { InMemoryIngredientRepository } from "../../infrastructure/repository/InMemoryIngredientRepository";
import { CreateIngredientUseCase } from "../../../../../src/context/kitchen/application/create/CreateIngredientUseCase";

describe('CreateIngredientUseCase', () => {
  describe('execute', () => {
    it('should create an ingredient', async () => {
      // Arrange
      const ingredient: Ingredient = {
        id: '1',    
        name: 'Ingredient 1',
        quantity: 1,
      };
      const repo = new InMemoryIngredientRepository([ingredient]);
      const useCase = new CreateIngredientUseCase(repo);

      // Act
      const result = await useCase.execute({ name: 'Ingredient 1', quantity: 1 });

      // Assert
      expect(result).toEqual(ingredient);
    });
    it('should return error if the repository fails', async () => {
        // Arrange
        const repo = new InMemoryIngredientRepository().simulateFailure();
        const useCase = new CreateIngredientUseCase(repo);

        // Act
        const result = await useCase.execute({ name: 'Ingredient 1', quantity: 1 });

        // Assert
        expect(result).toEqual(null);
    });
  });
});