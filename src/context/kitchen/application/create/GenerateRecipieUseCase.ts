import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { SQSMessageRequest } from '../../domain/ports/SQSRequest';
import { getRandomRecipe } from '../../domain/catalog/RecipesCatalog';
import Recipe from '../../domain/entity/Recipe';
import OrderRepository from '../../infrastructure/repository/OrderRepository';
import types from '../../../../services/kitchen/functions/generateRecipes/types';

interface OrderWithRecipe {
  orderId: string;
  recipe: Recipe;
}

@Injectable()
export default class GenerateRecipieUseCase implements UseCase<SQSMessageRequest, OrderWithRecipe[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepository
  ) {}

  async execute(request: SQSMessageRequest): Promise<OrderWithRecipe[]> {
    console.log('🚀 GenerateRecipieUseCase execute request', request);

    const assignments: OrderWithRecipe[] = [];

    for (const order of request.Orders) {
      // TODO: Generate recipe with AI (OpenAI)
      const recipe = getRandomRecipe();

      console.log(`🍽️ Order ${order.id} → Recipe: ${recipe.name}`);

      await this.orderRepository.update({
        id: order.id,
        status: 'preparing',
        recipeId: recipe.id,
        recipeName: recipe.name,
        createdAt: order.createdAt,
        updatedAt: new Date().toISOString(),
      });

      assignments.push({
        orderId: order.id,
        recipe,
      });
    }

    console.log('📊 GenerateRecipieUseCase assignments', JSON.stringify(assignments));

    // TODO: Notificar recetas listas a inventario

    return assignments;
  }
}