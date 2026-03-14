import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import TypesShared from '../../../shared/SharedTypes';
import IngredientRepository from '../../infrastructure/repository/IngredientRepository';
import { InventoryCheckRequest } from '../../domain/ports/InventoryCheckRequest';
import Env from '../../../../services/warehouse/config/Environment';
import types from '../../../../services/warehouse/functions/checkInventory/types';

@Injectable()
export class CheckInventoryUseCase implements UseCase<InventoryCheckRequest, void> {
  constructor(
    @Inject(types.IngredientRepository) private readonly ingredientRepository: IngredientRepository,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async execute(request: InventoryCheckRequest): Promise<void> {
    console.log(`🔍 CheckInventoryUseCase: checking stock for ${request.assignments.length} orders`);

    const allIngredients = await this.ingredientRepository.getAll();
    const stockMap = new Map(allIngredients.map(i => [i.name, i]));

    const readyAssignments = [];

    for (const assignment of request.assignments) {
      const hasStock = assignment.recipe.ingredients.every(ingredient => {
        const available = stockMap.get(ingredient.name)?.quantity ?? 0;
        return available >= ingredient.quantity;
      });

      if (!hasStock) {
        // TODO: publicar a SNS (necesitamos más ingredientes)
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

    if (readyAssignments.length === 0) {
      console.log('⚠️ No orders had sufficient stock');
      return;
    }

    await this.notificationPublisher.publish(
      Env.SNS_ORDER_READY_ARN,
      'order-ready-' + Date.now(),
      { assignments: readyAssignments }
    );

    console.log(`📢 SNS: ${readyAssignments.length} orders published to order-ready`);
  }
}
