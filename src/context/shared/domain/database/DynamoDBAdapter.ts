export interface DynamoDBAdapter {
    get<T>(tableName: string, key: Record<string, unknown>): Promise<T | null>;
    createBulk<T extends Record<string, unknown>>(tableName: string, items: T[]): Promise<T[]>;
    update<T extends Record<string, unknown>>(tableName: string, item: T): Promise<T>;
    delete(tableName: string, key: Record<string, unknown>): Promise<void>;
    scan<T>(tableName: string, consistentRead?: boolean): Promise<T[]>;
    query<T>(tableName: string, keyCondition: string, expressionValues: Record<string, unknown>): Promise<T[]>;
}