import { Inject, Injectable } from "../../../shared/infrastructure/di";
import TypesShared from "../../../shared/SharedTypes";
import { DatabaseAdapter } from "../../../shared/domain/database/DatabaseAdapter";
import PurchaseHistoryRepositoryDomain from "../../domain/repository/PurchaseHistoryRepository";
import PurchaseHistory from "../../domain/entity/PurchaseHistory";
import GetPurchaseHistoryRequest from "../../domain/ports/GetPurchaseHistoryRequest";
import { PaginatedResult } from "../../../shared/domain/database/PaginatedResult";
import { v4 as uuidv4 } from 'uuid';
import Logger from '../../../shared/domain/logger/Logger';

@Injectable()
export default class PurchaseHistoryRepository implements PurchaseHistoryRepositoryDomain {
    private readonly tableName = process.env.TABLE_PURCHASE_HISTORY ?? 'purchase-history';
    private static readonly GSI_NAME = 'entityType-purchaseDate-index';
    private static readonly DEFAULT_LIMIT = 100;
    private static readonly MAX_LIMIT = 500;
    private static readonly ENTITY_TYPE = 'ORDER';

    constructor(
        @Inject(TypesShared.DatabaseAdapter) private readonly databaseAdapter: DatabaseAdapter
    ) {}

    async create(purchaseHistories: PurchaseHistory[]): Promise<PurchaseHistory[]> {
        try {
            Logger.trace(`PurchaseHistoryRepository: purchaseHistories: ${purchaseHistories}`);

            const items = purchaseHistories.map(purchaseHistory => ({
                id: uuidv4(),
                entityType: PurchaseHistoryRepository.ENTITY_TYPE,
                purchaseDate: purchaseHistory.purchaseDate,
                ingredients: purchaseHistory.ingredients,
                createdAt: purchaseHistory.createdAt,
            }));

            return await this.databaseAdapter.insertBatch(this.tableName, items);
        } catch (error) {
            Logger.error(`PurchaseHistoryRepository: Error creating purchase history: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error creating purchase history`);
        }
    }

    async getAll(params?: GetPurchaseHistoryRequest): Promise<PaginatedResult<PurchaseHistory>> {
        try {
            const limit = Math.min(params?.limit ?? PurchaseHistoryRepository.DEFAULT_LIMIT, PurchaseHistoryRepository.MAX_LIMIT);

            return await this.databaseAdapter.findPage<PurchaseHistory>(this.tableName, {
                index: {
                    name: PurchaseHistoryRepository.GSI_NAME,
                    partitionKey: 'entityType',
                    partitionValue: PurchaseHistoryRepository.ENTITY_TYPE,
                    sortAscending: false,
                },
                limit,
                cursor: params?.nextToken ?? null,
            });
        } catch (error) {
            Logger.error(`PurchaseHistoryRepository: Error getting all purchase history: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error getting all purchase history`);
        }
    }

    async count(_params?: GetPurchaseHistoryRequest): Promise<number> {
        try {
            return await this.databaseAdapter.count(this.tableName, {
                index: {
                    name: PurchaseHistoryRepository.GSI_NAME,
                    partitionKey: 'entityType',
                    partitionValue: PurchaseHistoryRepository.ENTITY_TYPE,
                },
            });
        } catch (error) {
            Logger.error(`PurchaseHistoryRepository: Error counting purchase history: ${error}`);
            throw new Error(`❌ ${this.constructor.name}: Error counting purchase history`);
        }
    }
}
