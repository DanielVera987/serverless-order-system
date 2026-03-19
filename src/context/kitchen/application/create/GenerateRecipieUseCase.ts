import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { SQSMessageRequest } from '../../domain/ports/SQSRequest';
import { getRandomRecipe } from '../../domain/catalog/RecipesCatalog';
import Recipe from '../../domain/entity/Recipe';
import OrderRepositoryDomain from '../../domain/repository/OrderRepository';
import types from '../../../../services/kitchen/functions/generateRecipes/types';
import TypesShared from '../../../shared/SharedTypes';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import Env from '../../../../services/kitchen/config/Environment';
import { OrderStatus } from '../../../shared/domain/enums/OrderEnums';
import RecipeRepositoryDomain from '../../domain/repository/RecipeRepository';

interface OrderWithRecipe {
  orderId: string;
  recipe: Recipe;
}

const SNS_MAX_BYTES = 256 * 1024;
const SNS_SAFETY_MARGIN = 5 * 1024;
const SNS_MAX_CHUNK_BYTES = SNS_MAX_BYTES - SNS_SAFETY_MARGIN;
const ORDER_UPDATE_CONCURRENCY = Number(process.env.KITCHEN_ORDER_UPDATE_CONCURRENCY ?? 20);

@Injectable()
export default class GenerateRecipieUseCase implements UseCase<SQSMessageRequest, OrderWithRecipe[]> {
  constructor(
    @Inject(types.OrderRepository) private readonly orderRepository: OrderRepositoryDomain,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
    @Inject(types.RecipeRepository) private readonly recipeRepository: RecipeRepositoryDomain,
  ) {}

  async execute(request: SQSMessageRequest): Promise<OrderWithRecipe[]> {
    console.log('🚀 GenerateRecipieUseCase execute request', request);
  
    const batchId = Date.now();
    const recipes = await this.recipeRepository.getAll();

    const assignments = await this.processWithConcurrency(
      request.Orders,
      ORDER_UPDATE_CONCURRENCY,
      async (order) => {
        const recipe = recipes[Math.floor(Math.random() * recipes.length)];
  
        console.log(`🍽️ Order ${order.id} → Recipe: ${recipe.name}`);
  
        await this.orderRepository.update({
          id: order.id,
          orderNumber: order.orderNumber,
          status: OrderStatus.PREPARING,
          recipeId: recipe.id,
          recipeName: recipe.name,
          createdAt: order.createdAt,
          updatedAt: new Date().toISOString(),
        });
  
        return {
          orderId: order.id,
          recipe,
        };
      }
    );
  
    console.log('📊 GenerateRecipieUseCase assignments count', assignments.length);
    const chunks = this.chunkAssignmentsForSNS(assignments);

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      await this.notificationPublisher.publish(
        Env.SNS_RECIPE_CREATED_ARN,
        `recipe-created-group-${batchId}-${index}`,
        { assignments: chunk }
      );
    }
  
    console.log(`📢 SNS: Recipes published to topic ${Env.SNS_RECIPE_CREATED_ARN} in ${chunks.length} chunks`);
  
    return assignments;
  }

  private chunkAssignmentsForSNS(assignments: OrderWithRecipe[]): OrderWithRecipe[][] {
    const chunks: OrderWithRecipe[][] = [];
    let currentChunk: OrderWithRecipe[] = [];
    let currentSize = 0;

    for (const assignment of assignments) {
      const assignmentBytes = Buffer.byteLength(JSON.stringify(assignment), 'utf8');

      if (currentChunk.length > 0 && currentSize + assignmentBytes > SNS_MAX_CHUNK_BYTES) {
        chunks.push(currentChunk);
        currentChunk = [assignment];
        currentSize = assignmentBytes;
      } else {
        currentChunk.push(assignment);
        currentSize += assignmentBytes;
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  private async processWithConcurrency<T, R>(
    items: T[],
    concurrency: number,
    processor: (item: T, index: number) => Promise<R>
  ): Promise<R[]> {
    if (items.length === 0) return [];

    const safeConcurrency = Math.max(1, Math.min(concurrency, items.length));
    const results = new Array<R>(items.length);
    let nextIndex = 0;

    const worker = async () => {
      while (nextIndex < items.length) {
        const current = nextIndex++;
        results[current] = await processor(items[current], current);
      }
    };

    await Promise.all(
      Array.from({ length: safeConcurrency }, () => worker())
    );

    return results;
  }
}