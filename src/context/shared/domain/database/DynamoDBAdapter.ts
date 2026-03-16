import { PaginatedResult } from './PaginatedResult';

export interface ScanOptions {
    consistentRead?: boolean;
    filterExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    expressionAttributeValues?: Record<string, unknown>;
}

export interface PaginationOptions {
    limit: number;
    nextToken?: string | null;
}

export interface ScanPageOptions extends ScanOptions, PaginationOptions {}

export interface QueryPageOptions extends PaginationOptions {
    indexName?: string;
    keyConditionExpression: string;
    expressionAttributeValues: Record<string, unknown>;
    expressionAttributeNames?: Record<string, string>;
    filterExpression?: string;
    scanIndexForward?: boolean;
}

export interface DynamoDBAdapter {
    get<T>(tableName: string, key: Record<string, unknown>): Promise<T | null>;
    createBulk<T extends Record<string, unknown>>(tableName: string, items: T[]): Promise<T[]>;
    update<T extends Record<string, unknown>>(tableName: string, item: T): Promise<T>;
    delete(tableName: string, key: Record<string, unknown>): Promise<void>;
    scan<T>(tableName: string, options?: ScanOptions): Promise<T[]>;
    scanPage<T>(tableName: string, options: ScanPageOptions): Promise<PaginatedResult<T>>;
    query<T>(tableName: string, keyCondition: string, expressionValues: Record<string, unknown>): Promise<T[]>;
    queryPage<T>(tableName: string, options: QueryPageOptions): Promise<PaginatedResult<T>>;
    atomicIncrement(tableName: string, key: Record<string, unknown>, counterField: string, incrementBy: number): Promise<number>;
}