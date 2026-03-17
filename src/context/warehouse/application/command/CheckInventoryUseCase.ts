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
    console.log(`🚀 CheckInventoryUseCase: classifying batch ${batchId} with ${request.assignments.length} orders`);

    const allIngredients = await this.ingredientRepository.getAll();
    const stockMap = new Map(allIngredients.map(i => [i.name, i]));

    const readyAssignments: OrderRecipeAssignment[] = [];
    const shortageAssignments: OrderRecipeAssignment[] = [];

    for (const assignment of request.assignments) {
      const hasStock = assignment.recipe.ingredients.every(ingredient => {
        const available = stockMap.get(ingredient.name)?.quantity ?? 0;
        return available >= ingredient.quantity;
      });

      if (hasStock) {
        readyAssignments.push(assignment);
        console.log(`✅ Order ${assignment.orderId}: stock available for ${assignment.recipe.name}`);
      } else {
        shortageAssignments.push(assignment);
        console.log(`⚠️ Order ${assignment.orderId}: stock shortage for ${assignment.recipe.name}`);
      }
    }

    await this.publishReadyAssignments(readyAssignments, batchId);
    await this.publishShortageAssignments(shortageAssignments, batchId);
  }

  private async publishReadyAssignments(assignments: OrderRecipeAssignment[], batchId: number) {
    if (assignments.length === 0) return;

    await this.notificationPublisher.publish(
      Env.SNS_INVENTORY_READY_ARN,
      `inventory-ready-${batchId}`,
      { assignments },
    );

    console.log(`📢 SNS: ${assignments.length} orders published to inventory-ready (batch ${batchId})`);
  }

  private async publishShortageAssignments(assignments: OrderRecipeAssignment[], batchId: number) {
    if (assignments.length === 0) return;

    await this.notificationPublisher.publish(
      Env.SNS_INVENTORY_SHORTAGE_ARN,
      `inventory-shortage-${batchId}`,
      { assignments },
    );

    console.log(`📢 SNS: ${assignments.length} orders published to inventory-shortage (batch ${batchId})`);
  }
}
