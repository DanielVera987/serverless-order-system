import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable } from '../../../shared/infrastructure/di';
import { SQSMessageRequest } from '../../domain/ports/SQSRequest';
import { getRandomRecipe } from '../../domain/catalog/RecipesCatalog';
import Recipe from '../../domain/entity/Recipe';

interface OrderWithRecipe {
  orderId: string;
  recipe: Recipe;
}

@Injectable()
export default class GenerateRecipieUseCase implements UseCase<SQSMessageRequest, OrderWithRecipe[]> {
  async execute(request: SQSMessageRequest): Promise<OrderWithRecipe[]> {
    console.log('🚀 GenerateRecipieUseCase execute request', request);

    const assignments: OrderWithRecipe[] = request.Orders.map(order => {
      const recipe = getRandomRecipe();

      console.log(`🍽️ Order ${order.id} → Recipe: ${recipe.name}`);

      return {
        orderId: order.id,
        recipe,
      };
    });

    console.log('📊 GenerateRecipieUseCase assignments', JSON.stringify(assignments));

    // TODO: solicitar ingredientes a la bodega

    return assignments;
  }
}