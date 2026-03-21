import 'reflect-metadata';
import InMemoryRecipeRepository from "../../infrastructure/repository/InMemoryRecipeRepository";
import GenerateRecipieUseCase from "../../../../../src/context/kitchen/application/create/GenerateRecipieUseCase";
import InMemoryOrderRepository from "../../../orders/infrastructure/repository/InMemoryOrderRepository";
import InMemoryNotificationPublisher from "../../../shared/infrastructure/InMemoryNotificationPublisher";
import { OrderStatus } from "../../../../../src/context/shared/domain/enums/OrderEnums";

const makeOrder = (id: string, orderNumber: number) => ({
  id,
  orderNumber,
  status: OrderStatus.PENDING,
  createdAt: '2026-01-01T00:00:00.000Z',
});

const makeRecipe = (id: string, name: string) => ({
  id,
  name,
  ingredients: [],
});

describe('GenerateRecipesUseCase', () => {
  describe('execute', () => {
    it('should return empty when no orders are provided', async () => {
      const useCase = new GenerateRecipieUseCase(
        new InMemoryOrderRepository(),
        new InMemoryNotificationPublisher(),
        new InMemoryRecipeRepository([makeRecipe('r1', 'Pasta')]),
      );

      const result = await useCase.execute({ Orders: [] });

      expect(result).toEqual([]);
    });

    it('should assign a recipe to each order', async () => {
      const orders = [makeOrder('o1', 1), makeOrder('o2', 2), makeOrder('o3', 3)];
      const recipes = [makeRecipe('r1', 'Pasta'), makeRecipe('r2', 'Pizza')];
      const orderRepo = new InMemoryOrderRepository(orders);
      const useCase = new GenerateRecipieUseCase(
        orderRepo,
        new InMemoryNotificationPublisher(),
        new InMemoryRecipeRepository(recipes),
      );

      const result = await useCase.execute({ Orders: orders });

      expect(result).toHaveLength(3);
      result.forEach(({ orderId, recipe }) => {
        expect(orderId).toBeDefined();
        expect(recipe.id).toBeDefined();
        expect(recipe.name).toBeDefined();
      });
    });

    it('should update each order status to PREPARING', async () => {
      const orders = [makeOrder('o1', 1), makeOrder('o2', 2)];
      const orderRepo = new InMemoryOrderRepository(orders);
      const useCase = new GenerateRecipieUseCase(
        orderRepo,
        new InMemoryNotificationPublisher(),
        new InMemoryRecipeRepository([makeRecipe('r1', 'Pasta')]),
      );

      await useCase.execute({ Orders: orders });

      const updated1 = await orderRepo.get('o1');
      const updated2 = await orderRepo.get('o2');
      expect(updated1?.status).toBe(OrderStatus.PREPARING);
      expect(updated2?.status).toBe(OrderStatus.PREPARING);
    });

    it('should publish assignments to SNS', async () => {
      const orders = [makeOrder('o1', 1)];
      const publisher = new InMemoryNotificationPublisher();
      const useCase = new GenerateRecipieUseCase(
        new InMemoryOrderRepository(orders),
        publisher,
        new InMemoryRecipeRepository([makeRecipe('r1', 'Pasta')]),
      );

      await useCase.execute({ Orders: orders });

      expect(publisher.publications).toHaveLength(1);
      const publication = publisher.publications[0];
      expect(publication.message).toEqual(
        expect.objectContaining({ assignments: expect.any(Array) }),
      );
    });

    it('should throw if recipe repository fails', async () => {
      const orders = [makeOrder('o1', 1)];
      const useCase = new GenerateRecipieUseCase(
        new InMemoryOrderRepository(orders),
        new InMemoryNotificationPublisher(),
        new InMemoryRecipeRepository().simulateFailure(),
      );

      await expect(useCase.execute({ Orders: orders })).rejects.toThrow();
    });

    it('should throw if order repository fails', async () => {
      const orders = [makeOrder('o1', 1)];
      const useCase = new GenerateRecipieUseCase(
        new InMemoryOrderRepository().simulateFailure(),
        new InMemoryNotificationPublisher(),
        new InMemoryRecipeRepository([makeRecipe('r1', 'Pasta')]),
      );

      await expect(useCase.execute({ Orders: orders })).rejects.toThrow();
    });
  });
});
