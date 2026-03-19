import Recipe from "../../../../../src/context/kitchen/domain/entity/Recipe";
import InMemoryRecipeRepository from "../../infrastructure/repository/InMemoryRecipeRepository";
import GetRecipesUseCase from "../../../../../src/context/kitchen/application/query/GetRecipesUseCase";

describe('GetRecipesUseCase', () => {
  describe('execute', () => {
    it('should return the list of recipes from the repository', async () => {
      // Arrange
      const recipes: Recipe[] = [
        { id: '1', name: 'Recipe 1', description: 'Description 1', ingredients: [{ name: 'ingredient 1', quantity: 1 }], createdAt: new Date().toISOString() },
      ];
      const repo = new InMemoryRecipeRepository(recipes);
      const useCase = new GetRecipesUseCase(repo);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual(recipes);
    });
    it('should return an empty list when there are no recipes', async () => {
      // Arrange
      const repo = new InMemoryRecipeRepository([]);
      const useCase = new GetRecipesUseCase(repo);

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });
    it('should return error if the repository fails', async () => {
      // Arrange
      const repo = new InMemoryRecipeRepository().simulateFailure();
      const useCase = new GetRecipesUseCase(repo);

      // Act 
      const result = await useCase.execute();

      // Assert
      expect(result).toEqual([]);
    });
  });
});