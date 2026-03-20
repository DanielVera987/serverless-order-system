import InMemoryRecipeRepository from "../../infrastructure/repository/InMemoryRecipeRepository";
import GenerateRecipieUseCase from "../../../../../src/context/kitchen/application/create/GenerateRecipieUseCase";
import InMemoryOrderRepository from "../../../orders/infrastructure/repository/InMemoryOrderRepository";
import InMemoryNotificationPublisher from "../../../shared/infrastructure/InMemoryNotificationPublisher";

describe('GenerateRecipesUseCase', () => {
  describe('execute', () => {
    it('should generate recipes', async () => {
      // Arrange
      const recipeRepo = new InMemoryRecipeRepository();
      const orderRepo = new InMemoryOrderRepository();
      const notificationPublisher = new InMemoryNotificationPublisher();
      const useCase = new GenerateRecipieUseCase(orderRepo, notificationPublisher, recipeRepo);

      // Act
      const result = await useCase.execute({ Orders: [] });

      // Assert
      expect(result).toEqual([]);
    });
  });
});