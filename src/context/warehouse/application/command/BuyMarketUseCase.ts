import { UseCase } from "../../../shared/domain/UseCase";
import { BuyMarketRequest } from "../../domain/ports/ByMarketRequest";
import Types from '../../../../services/warehouse/functions/buyMarket/Types';
import TypesShared from '../../../shared/SharedTypes';
import { Inject, Injectable } from "../../../shared/infrastructure/di";
import FarmersMarketRepository from '../../domain/repository/FarmersMarketRepository';
import IngredientRepositoryDomain from '../../domain/repository/IngredientRepository';
import { NotificationPublisher } from '../../../shared/domain/notification/NotificationPublisher';
import Env from '../../../../services/warehouse/config/Environment';
import PurchaseHistoryRepositoryDomain from "../../domain/repository/PurchaseHistoryRepository";
import { v4 as uuidv4 } from 'uuid';
import PurchaseHistory from "../../domain/entity/PurchaseHistory";

@Injectable()
export default class BuyMarketUseCase implements UseCase<BuyMarketRequest, void> {
  constructor(
    @Inject(Types.FarmersMarketRepository) private readonly farmersMarketRepository: FarmersMarketRepository,
    @Inject(Types.IngredientRepository) private readonly ingredientRepository: IngredientRepositoryDomain,
    @Inject(TypesShared.NotificationPublisher) private readonly notificationPublisher: NotificationPublisher,
    @Inject(Types.PurchaseHistoryRepository) private readonly purchaseHistoryRepository: PurchaseHistoryRepositoryDomain,
  ) {}

  async execute(request: BuyMarketRequest): Promise<void> {
    console.log('🚀 BuyMarketUseCase execute request', request);

    try {
      const allIngredients = await this.ingredientRepository.getAll();
      const stockMap = new Map(allIngredients.map(i => [i.name, i]));
      const purchaseHistories: PurchaseHistory[] = [];

      await Promise.all(request.ingredients.map(async (ingredient) => {
        let purchased = 0;

        for (let attempt = 0; purchased < ingredient.quantity && attempt < 20; attempt++) {
          const response = await this.farmersMarketRepository.buy({ name: ingredient.name });

          if (response.quantitySold === 0) {
            console.log(`⚠️ Market has no ${ingredient.name}, attempt ${attempt + 1}`);
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

          console.log('🔵 BuyMarketUseCase: purchaseHistory', purchaseHistory);

          purchaseHistories.push(purchaseHistory);

          console.log(`✅ Bought ${response.quantitySold} of ${ingredient.name} (${purchased}/${ingredient.quantity})`);
        }
      }));

      await this.purchaseHistoryRepository.create(purchaseHistories);

      console.log('📊 BuyMarketUseCase: all ingredients purchased and restocked');

      await this.notificationPublisher.publish(
        Env.SNS_INGREDIENTS_PURCHASED_ARN,
        'ingredients-purchased-' + Date.now(),
        { assignments: request.assignments }
      );

      console.log(`📢 SNS: ingredients purchased, ${request.assignments.length} orders re-sent to checkInventory`);
    } catch (error) {
      console.error(`❌ ${this.constructor.name}: Error buying from farmers market`, error);
      throw new Error(`❌ ${this.constructor.name}: Error buying from farmers market`);
    }
  }
}