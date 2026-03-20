import { PaginatedResult } from './PaginatedResult';

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'begins_with' | 'in';

export interface WhereCondition {
    field: string;
    operator: FilterOperator;
    value: unknown;
}

/**
 * Hint for querying through an index (GSI in DynamoDB, index in SQL, etc).
 * The adapter translates this into the DB-specific index query syntax.
 */
export interface IndexHint {
    name: string;
    partitionKey: string;
    partitionValue: unknown;
    sortAscending?: boolean;
}

export interface FindOptions {
    index?: IndexHint;
    where?: WhereCondition[];
    consistentRead?: boolean;
}

export interface PageOptions extends FindOptions {
    limit: number;
    cursor?: string | null;
}

export interface DatabaseAdapter {
    findById<T>(collection: string, key: Record<string, unknown>): Promise<T | null>;
    insertBatch<T extends Record<string, unknown>>(collection: string, items: T[]): Promise<T[]>;
    save<T extends Record<string, unknown>>(collection: string, item: T): Promise<T>;
    remove(collection: string, key: Record<string, unknown>): Promise<void>;
    findAll<T>(collection: string, options?: FindOptions): Promise<T[]>;
    findPage<T>(collection: string, options: PageOptions): Promise<PaginatedResult<T>>;
    count(collection: string, options?: FindOptions): Promise<number>;
    atomicDecrement(collection: string, key: Record<string, unknown>, field: string, amount: number): Promise<boolean>;
    atomicIncrement(collection: string, key: Record<string, unknown>, field: string, amount: number): Promise<number>;
}
