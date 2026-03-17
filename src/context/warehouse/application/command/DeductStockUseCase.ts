import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import TypesShared from '../../../shared/SharedTypes';
import IngredientRepository from '../../infrastructure/repository/IngredientRepository';
import { InventoryReadyRequest, OrderRecipeAssignment } from '../../domain/ports/InventoryCheckRequest';
import Env from '../../../../services/warehouse/config/Environment';
import types from '../../../../services/warehouse/functions/deductStock/types';

@Injectable()
export class DeductStockUseCase implements UseCase<InventoryReadyRequest, void> {
  constructor(
    @Inject(types.IngredientRepository) private readonly ingredientRepository: IngredientRepository,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async execute(request: InventoryReadyRequest): Promise<void> {
    const batchId = Date.now();
    console.log(`🚀 DeductStockUseCase: processing batch ${batchId} with ${request.assignments.length} orders`);

    const allIngredients = await this.ingredientRepository.getAll();
    const stockMap = new Map(allIngredients.map(i => [i.name, i]));

    const successfulOrders: OrderRecipeAssignment[] = [];
    const failedOrders: OrderRecipeAssignment[] = [];

    for (const assignment of request.assignments) {
      const deducted = await this.tryAtomicDeduction(assignment, stockMap);

      if (deducted) {
        for (const ingredient of assignment.recipe.ingredients) {
          const record = stockMap.get(ingredient.name)!;
          stockMap.set(ingredient.name, { ...record, quantity: record.quantity - ingredient.quantity });
        }
        successfulOrders.push(assignment);
        console.log(`✅ Order ${assignment.orderId}: stock deducted for ${assignment.recipe.name}`);
      } else {
        failedOrders.push(assignment);
        console.log(`⚠️ Order ${assignment.orderId}: atomic deduction failed (race condition) for ${assignment.recipe.name}`);
      }
    }

    await this.publishReadyOrders(successfulOrders, batchId);
    await this.publishFailedOrders(failedOrders, batchId);
  }

  private async tryAtomicDeduction(
    assignment: OrderRecipeAssignment,
    stockMap: Map<string, { id: string; quantity: number }>,
  ): Promise<boolean> {
    for (const ingredient of assignment.recipe.ingredients) {
      const record = stockMap.get(ingredient.name);
      if (!record) return false;

      const success = await this.ingredientRepository.updateStockAtomic(record.id, ingredient.quantity);
      if (!success) return false;
    }
    return true;
  }

  private async publishReadyOrders(assignments: OrderRecipeAssignment[], batchId: number) {
    if (assignments.length === 0) return;

    await this.notificationPublisher.publish(
      Env.SNS_ORDER_READY_ARN,
      `order-ready-${batchId}`,
      { assignments },
    );

    console.log(`📢 SNS: ${assignments.length} orders published to order-ready (batch ${batchId})`);
  }

  private async publishFailedOrders(assignments: OrderRecipeAssignment[], batchId: number) {
    if (assignments.length === 0) return;

    await this.notificationPublisher.publish(
      Env.SNS_INVENTORY_SHORTAGE_ARN,
      `shortage-retry-${batchId}`,
      { assignments },
    );

    console.log(`📢 SNS: ${assignments.length} orders re-routed to inventory-shortage due to race condition (batch ${batchId})`);
  }
}
