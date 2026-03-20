import { InMemoryIngredientRepository } from "../../infrastructure/repository/InMemoryIngredientRepository";
import { CreateIngredientUseCase } from "../../../../../src/context/kitchen/application/create/CreateIngredientUseCase";

describe('CreateIngredientUseCase', () => {
  describe('execute', () => {
    it('should create an ingredient', async () => {
      // Arrange
      const repo = new InMemoryIngredientRepository();
      const useCase = new CreateIngredientUseCase(repo);

      // Act
      const result = await useCase.execute({ name: 'Ingredient 1', quantity: 1 });

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          name: 'Ingredient 1',
          quantity: 1,
        }),
      );
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
    });
    it('should throw if the repository fails', async () => {
      // Arrange
      const repo = new InMemoryIngredientRepository().simulateFailure();
      const useCase = new CreateIngredientUseCase(repo);

      // Act & Assert
      await expect(
        useCase.execute({ name: 'Ingredient 1', quantity: 1 }),
      ).rejects.toThrow();
    });
  });
});