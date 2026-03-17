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
    const batchId = Date.now();
    console.log(`🚀 CheckInventoryUseCase: processing batch ${batchId} with ${request.assignments.length} orders`);

    const allIngredients = await this.ingredientRepository.getAll();
    const stockMap = new Map(allIngredients.map(i => [i.name, i]));

    const readyAssignments: OrderRecipeAssignment[] = [];
    const pendingAssignments: OrderRecipeAssignment[] = [];

    for (const assignment of request.assignments) {
      const hasLocalStock = assignment.recipe.ingredients.every(ingredient => {
        const available = stockMap.get(ingredient.name)?.quantity ?? 0;
        return available >= ingredient.quantity;
      });

      if (!hasLocalStock) {
        pendingAssignments.push(assignment);
        console.log(`⚠️ Order ${assignment.orderId}: missing ingredients (pre-check) for ${assignment.recipe.name}`);
        continue;
      }

      let canDeductAll = true;
      for (const ingredient of assignment.recipe.ingredients) {
        const ingredientRecord = stockMap.get(ingredient.name);
        if (!ingredientRecord) {
          canDeductAll = false;
          break;
        }
        const success = await this.ingredientRepository.updateStockAtomic(ingredientRecord.id, ingredient.quantity);
        if (!success) {
          canDeductAll = false;
          break;
        }
      }

      if (canDeductAll) {
        for (const ingredient of assignment.recipe.ingredients) {
          const record = stockMap.get(ingredient.name)!;
          stockMap.set(ingredient.name, { ...record, quantity: record.quantity - ingredient.quantity });
        }

        readyAssignments.push(assignment);
        console.log(`✅ Order ${assignment.orderId}: stock deducted for ${assignment.recipe.name}`);
      } else {
        pendingAssignments.push(assignment);
        console.log(`⚠️ Order ${assignment.orderId}: missing ingredients during atomic deduction for ${assignment.recipe.name}`);
      }
    }

    await this.publishReadyAssignments(readyAssignments, batchId);
    await this.publishPendingAssignments(pendingAssignments, stockMap, batchId);
  }

  private async publishReadyAssignments(readyAssignments: OrderRecipeAssignment[], batchId: number) {
    if (readyAssignments.length === 0) return;

    await this.notificationPublisher.publish(
      Env.SNS_ORDER_READY_ARN,
      `order-ready-${batchId}`,
      { assignments: readyAssignments }
    );

    console.log(`📢 SNS: ${readyAssignments.length} orders published to order-ready (batch ${batchId})`);
  }

  private async publishPendingAssignments(pendingAssignments: OrderRecipeAssignment[], stockMap: Map<string, { quantity: number }>, batchId: number) {
    if (pendingAssignments.length === 0) return;

    const totalDeficit = this.calculateTotalDeficit(pendingAssignments, stockMap);
    const ingredients = Array.from(totalDeficit.entries()).map(([name, quantity]) => ({ name, quantity }));

    await this.notificationPublisher.publish(
      Env.SNS_INGREDIENTS_NEEDED_ARN,
      `ingredients-needed-${batchId}`,
      { ingredients, assignments: pendingAssignments }
    );

    console.log(`📢 SNS: ${pendingAssignments.length} orders need ingredients, published to ingredients-needed (batch ${batchId})`);
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