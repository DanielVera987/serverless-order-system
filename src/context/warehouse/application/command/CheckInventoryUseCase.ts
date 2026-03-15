import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import TypesShared from '../../../shared/SharedTypes';
import IngredientRepository from '../../infrastructure/repository/IngredientRepository';
import { InventoryCheckRequest, OrderRecipeAssignment } from '../../domain/ports/InventoryCheckRequest';
import Env from '../../../../services/warehouse/config/Environment';
import types from '../../../../services/warehouse/functions/checkInventory/types';

@Injectable()
export class CheckInventoryUseCase implements UseCase<InventoryCheckRequest, void> {
  constructor(
    @Inject(types.IngredientRepository) private readonly ingredientRepository: IngredientRepository,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async execute(request: InventoryCheckRequest): Promise<void> {
    console.log('🚀 CheckInventoryUseCase execute request', request);
    console.log(`🔍 CheckInventoryUseCase: checking stock for ${request.assignments.length} orders`);

    const allIngredients = await this.ingredientRepository.getAll();
    const stockMap = new Map(allIngredients.map(i => [i.name, i]));

    const readyAssignments: OrderRecipeAssignment[] = [];
    const pendingAssignments: OrderRecipeAssignment[] = [];

    for (const assignment of request.assignments) {
      const hasStock = assignment.recipe.ingredients.every(ingredient => {
        const available = stockMap.get(ingredient.name)?.quantity ?? 0;
        return available >= ingredient.quantity;
      });

      if (!hasStock) {
        pendingAssignments.push(assignment);
        console.log(`⚠️ Order ${assignment.orderId}: missing ingredients for ${assignment.recipe.name}`);
        continue;
      }

      for (const ingredient of assignment.recipe.ingredients) {
        const record = stockMap.get(ingredient.name)!;
        const updated = { ...record, quantity: record.quantity - ingredient.quantity, updatedAt: new Date().toISOString() };
        await this.ingredientRepository.update(updated);
        stockMap.set(ingredient.name, updated);
      }

      console.log(`✅ Order ${assignment.orderId}: stock deducted for ${assignment.recipe.name}`);
      readyAssignments.push(assignment);
    }

    await this.isReadyAssignmentPublish(readyAssignments);

    const totalDeficit = this.calculateTotalDeficit(pendingAssignments, stockMap);
    await this.isPendingAssignmentPublish(pendingAssignments, totalDeficit);
  }

  private async isReadyAssignmentPublish(readyAssignments: OrderRecipeAssignment[]): Promise<void> {
    if (readyAssignments.length > 0) {
      await this.notificationPublisher.publish(
        Env.SNS_ORDER_READY_ARN,
        'order-ready-' + Date.now(),
        { assignments: readyAssignments }
      );
    }

    console.log(`📢 SNS: ${readyAssignments.length} orders published to order-ready`);
  }

  private async isPendingAssignmentPublish(pendingAssignments: OrderRecipeAssignment[], deficit: Map<string, number>): Promise<void> {
    if (pendingAssignments.length > 0) {
      const ingredients = Array.from(deficit.entries()).map(([name, quantity]) => ({ name, quantity }));

      await this.notificationPublisher.publish(
        Env.SNS_INGREDIENTS_NEEDED_ARN,
        'ingredients-needed-' + Date.now(),
        { ingredients, assignments: pendingAssignments }
      );

      console.log(`📢 SNS: ${pendingAssignments.length} orders need ingredients, published to ingredients-needed`);
    }
  }

  private calculateTotalDeficit(
    pendingAssignments: OrderRecipeAssignment[],
    stockMap: Map<string, { quantity: number }>,
  ): Map<string, number> {
    const totalNeeded = new Map<string, number>();

    for (const assignment of pendingAssignments) {
      for (const ingredient of assignment.recipe.ingredients) {
        const current = totalNeeded.get(ingredient.name) ?? 0;
        totalNeeded.set(ingredient.name, current + ingredient.quantity);
      }
    }

    const deficit = new Map<string, number>();
    for (const [name, needed] of totalNeeded) {
      const available = stockMap.get(name)?.quantity ?? 0;
      const missing = Math.max(0, needed - available);
      if (missing > 0) {
        deficit.set(name, missing);
      }
    }

    return deficit;
  }
}
