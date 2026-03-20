import { UseCase } from "../../../shared/domain/UseCase";
import { BuyMarketRequest } from "../../domain/ports/ByMarketRequest";
import Types from '../../Types';
import { CommandError } from '../../../shared/domain/errors/DomainError';
import TypesShared from '../../../shared/SharedTypes';
import { Inject, Injectable } from "../../../shared/infrastructure/di";
import FarmersMarketRepository from '../../domain/repository/FarmersMarketRepository';
import IngredientRepositoryDomain from '../../domain/repository/IngredientRepository';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import Env from '../../../../services/warehouse/config/Environment';
import PurchaseHistoryRepositoryDomain from "../../domain/repository/PurchaseHistoryRepository";
import { v4 as uuidv4 } from 'uuid';
import PurchaseHistory from "../../domain/entity/PurchaseHistory";
import Logger from '../../../shared/domain/logger/Logger';

@Injectable()
export default class BuyMarketUseCase implements UseCase<BuyMarketRequest, void> {
  constructor(
    @Inject(Types.FarmersMarketRepository) private readonly farmersMarketRepository: FarmersMarketRepository,
    @Inject(Types.IngredientRepository) private readonly ingredientRepository: IngredientRepositoryDomain,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
    @Inject(Types.PurchaseHistoryRepository) private readonly purchaseHistoryRepository: PurchaseHistoryRepositoryDomain,
  ) {}

  async execute(request: BuyMarketRequest): Promise<void> {
    Logger.init(`BuyMarketUseCase execute request: ${request}`);

    try {
      const allIngredients = await this.ingredientRepository.getAll();
      const stockMap = new Map(allIngredients.map(i => [i.name, i]));
      const purchaseHistories: PurchaseHistory[] = [];

      await Promise.all(request.ingredients.map(async (ingredient) => {
        let purchased = 0;

        for (let attempt = 0; purchased < ingredient.quantity && attempt < 20; attempt++) {
          const response = await this.farmersMarketRepository.buy({ name: ingredient.name });

          if (response.quantitySold === 0) {
            Logger.warn(`Market has no ${ingredient.name}, attempt ${attempt + 1}`);
            continue;
          }

          purchased += response.quantitySold;

          const record = stockMap.get(ingredient.name);
          if (record) {
            record.quantity += response.quantitySold;
            await this.ingredientRepository.update({
              ...record,
              updatedAt: new Date().toISOString(),
            });
          }

          const purchaseHistory: PurchaseHistory = {
            id: uuidv4(),
            entityType: 'ORDER',
            purchaseDate: new Date().toISOString(),
            ingredients: [{
              name: ingredient.name,
              quantity: response.quantitySold
            }],
            createdAt: new Date().toISOString(),
          };

          Logger.log(`BuyMarketUseCase: purchaseHistory: ${purchaseHistory}`);

          purchaseHistories.push(purchaseHistory);

          Logger.log(`Bought ${response.quantitySold} of ${ingredient.name} (${purchased}/${ingredient.quantity})`);
        }
      }));

      await this.purchaseHistoryRepository.create(purchaseHistories);

      Logger.log('BuyMarketUseCase: all ingredients purchased and restocked');

      await this.notificationPublisher.publish(
        Env.SNS_INGREDIENTS_PURCHASED_ARN,
        'ingredients-purchased-' + Date.now(),
        { assignments: request.assignments }
      );

      Logger.notify(`SNS: ingredients purchased, ${request.assignments.length} orders re-sent to checkInventory`);
    } catch (error) {
      Logger.error('BuyMarketUseCase: Error buying from farmers market', error);
      throw new CommandError('Failed to buy from farmers market', error);
    }
  }
}