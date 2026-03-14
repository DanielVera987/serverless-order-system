import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { SQSMessageRequest } from '../../domain/ports/SQSRequest';
import { getRandomRecipe } from '../../domain/catalog/RecipesCatalog';
import Recipe from '../../domain/entity/Recipe';
import OrderRepository from '../../infrastructure/repository/OrderRepository';
import types from '../../../../services/kitchen/functions/generateRecipes/types';
import TypesShared from '../../../shared/SharedTypes';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import Env from '../../../../services/kitchen/config/Environment';

interface OrderWithRecipe {
  orderId: string;
  recipe: Recipe;
}

@Injectable()
export default class GenerateRecipieUseCase implements UseCase<SQSMessageRequest, OrderWithRecipe[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepository,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
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

    await this.notificationPublisher.publish(
      Env.SNS_RECIPE_CREATED_ARN,
      'recipe-created-group-' + Date.now(),
      assignments
    );

    console.log('📢 SNS: Recipes published to topic', Env.SNS_RECIPE_CREATED_ARN);

    return assignments;
  }
}