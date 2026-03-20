import { UseCase } from '../../../shared/domain/UseCase';
import { Injectable, Inject } from '../../../shared/infrastructure/di';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import TypesShared from '../../../shared/SharedTypes';
import IngredientRepository from '../../infrastructure/repository/IngredientRepository';
import { InventoryShortageRequest, OrderRecipeAssignment } from '../../domain/ports/InventoryCheckRequest';
import Env from '../../../../services/warehouse/config/Environment';
import types from '../../../../services/warehouse/functions/requestIngredients/types';
import Logger from '../../../shared/domain/logger/Logger';

@Injectable()
export class RequestIngredientsUseCase implements UseCase<InventoryShortageRequest, void> {
  constructor(
    @Inject(types.IngredientRepository) private readonly ingredientRepository: IngredientRepository,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
  ) {}

  async execute(request: InventoryShortageRequest): Promise<void> {
    const batchId = Date.now();
    Logger.init(`RequestIngredientsUseCase: computing deficit for ${request.assignments.length} orders (batch ${batchId})`);

    const allIngredients = await this.ingredientRepository.getAll();
    const stockMap = new Map(allIngredients.map(i => [i.name, i]));

    const deficit = this.calculateDeficit(request.assignments, stockMap);
    const ingredients = Array.from(deficit.entries()).map(([name, quantity]) => ({ name, quantity }));

    await this.notificationPublisher.publish(
      Env.SNS_INGREDIENTS_NEEDED_ARN,
      `ingredients-needed-${batchId}`,
      { ingredients, assignments: request.assignments },
    );

    Logger.notify(`SNS: deficit published — ${ingredients.length} ingredient(s) needed for ${request.assignments.length} orders (batch ${batchId})`);
  }

  private calculateDeficit(
    assignments: OrderRecipeAssignment[],
    stockMap: Map<string, { quantity: number }>,
  ): Map<string, number> {
    const totalNeeded = new Map<string, number>();

    for (const assignment of assignments) {
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
