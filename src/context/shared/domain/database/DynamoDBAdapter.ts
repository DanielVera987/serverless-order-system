export interface DynamoDBAdapter {
    get<T>(tableName: string, key: Record<string, unknown>): Promise<T | null>;
    update<T extends Record<string, unknown>>(tableName: string, item: T): Promise<void>;
    delete(tableName: string, key: Record<string, unknown>): Promise<void>;
    scan<T>(tableName: string): Promise<T[]>;
    query<T>(tableName: string, keyCondition: string, expressionValues: Record<string, unknown>): Promise<T[]>;
}