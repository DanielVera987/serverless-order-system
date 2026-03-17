import { Inject, Injectable } from "../../../shared/infrastructure/di";
import TypesShared from "../../../shared/SharedTypes";
import { DynamoDBAdapter } from "../../../shared/domain/database/DynamoDBAdapter";
import PurchaseHistoryRepositoryDomain from "../../domain/repository/PurchaseHistoryRepository";
import PurchaseHistory from "../../domain/entity/PurchaseHistory";
import GetPurchaseHistoryRequest from "../../domain/ports/GetPurchaseHistoryRequest";
import { PaginatedResult } from "../../../shared/domain/database/PaginatedResult";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export default class PurchaseHistoryRepository implements PurchaseHistoryRepositoryDomain {
    private readonly tableName = process.env.TABLE_PURCHASE_HISTORY ?? 'purchase-history';
    private static readonly GSI_NAME = 'entityType-purchaseDate-index';
    private static readonly DEFAULT_LIMIT = 100;
    private static readonly MAX_LIMIT = 500;
    private static readonly ENTITY_TYPE = 'ORDER';

    constructor(
        @Inject(TypesShared.DynamoDBAdapter) private readonly dynamoDBAdapter: DynamoDBAdapter
    ) {}

    async create(purchaseHistories: PurchaseHistory[]): Promise<PurchaseHistory[]> {
        try {
            console.log('🔵 PurchaseHistoryRepository: purchaseHistories', purchaseHistories);

            const items = purchaseHistories.map(purchaseHistory => ({
                id: uuidv4(),
                entityType: PurchaseHistoryRepository.ENTITY_TYPE,
                purchaseDate: purchaseHistory.purchaseDate,
                ingredients: purchaseHistory.ingredients,
                createdAt: purchaseHistory.createdAt,
            }));

            return await this.dynamoDBAdapter.createBulk(this.tableName, items);
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error creating purchase history`, error);
            throw new Error(`❌ ${this.constructor.name}: Error creating purchase history`);
        }
    }

    async getAll(params?: GetPurchaseHistoryRequest): Promise<PaginatedResult<PurchaseHistory>> {
        try {
            const limit = Math.min(params?.limit ?? PurchaseHistoryRepository.DEFAULT_LIMIT, PurchaseHistoryRepository.MAX_LIMIT);

            return await this.dynamoDBAdapter.queryPage<PurchaseHistory>(this.tableName, {
                indexName: PurchaseHistoryRepository.GSI_NAME,
                keyConditionExpression: 'entityType = :entityType',
                limit,
                nextToken: params?.nextToken ?? undefined,
                expressionAttributeValues: {
                    ':entityType': PurchaseHistoryRepository.ENTITY_TYPE,
                },
            });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error getting all purchase history`, error);
            throw new Error(`❌ ${this.constructor.name}: Error getting all purchase history`);
        }
    }

    async count(_params?: GetPurchaseHistoryRequest): Promise<number> {
        try {
            return await this.dynamoDBAdapter.count(this.tableName, {
                indexName: PurchaseHistoryRepository.GSI_NAME,
                keyConditionExpression: 'entityType = :entityType',
                expressionAttributeValues: {
                    ':entityType': PurchaseHistoryRepository.ENTITY_TYPE,
                },
            });
        } catch (error) {
            console.error(`❌ ${this.constructor.name}: Error counting purchase history`, error);
            throw new Error(`❌ ${this.constructor.name}: Error counting purchase history`);
        }
    }
}