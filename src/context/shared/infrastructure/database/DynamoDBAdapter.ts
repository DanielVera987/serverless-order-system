import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand, QueryCommand, BatchWriteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DatabaseAdapter, FindOptions, PageOptions, FilterOperator } from '../../domain/database/DatabaseAdapter';
import { PaginatedResult } from '../../domain/database/PaginatedResult';
import { Injectable } from '../di';

interface DynamoExpressions {
    keyConditionExpression?: string;
    filterExpression?: string;
    expressionAttributeNames?: Record<string, string>;
    expressionAttributeValues?: Record<string, unknown>;
    indexName?: string;
    scanIndexForward?: boolean;
}

@Injectable()
export class DynamoDBAdapter implements DatabaseAdapter {
    private readonly client: DynamoDBDocumentClient;

    constructor() {
        this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    }

    async findById<T>(collection: string, key: Record<string, unknown>): Promise<T | null> {
        const result = await this.client.send(new GetCommand({
            TableName: collection,
            Key: key,
        }));

        return (result.Item as T) ?? null;
    }

    async insertBatch<T extends Record<string, unknown>>(collection: string, items: T[]): Promise<T[]> {
        const MAX_BATCH_SIZE = 25;
        const MAX_RETRIES = 5;

        for (let i = 0; i < items.length; i += MAX_BATCH_SIZE) {
            const chunk = items.slice(i, i + MAX_BATCH_SIZE);
            let requestItems: Record<string, { PutRequest: { Item: Record<string, unknown> } }[]> = {
                [collection]: chunk.map(item => ({ PutRequest: { Item: item } })),
            };

            for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                const result = await this.client.send(new BatchWriteCommand({ RequestItems: requestItems }));
                const pending = result.UnprocessedItems;

                if (pending && Object.keys(pending).length > 0) {
                    requestItems = pending as typeof requestItems;
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                } else {
                    requestItems = {};
                    break;
                }
            }

            if (Object.keys(requestItems).length > 0) {
                throw new Error(`Failed to process all items after ${MAX_RETRIES} retries`);
            }
        }

        return items;
    }

    async save<T extends Record<string, unknown>>(collection: string, item: T): Promise<T> {
        await this.client.send(new PutCommand({ TableName: collection, Item: item }));
        return item;
    }

    async remove(collection: string, key: Record<string, unknown>): Promise<void> {
        await this.client.send(new DeleteCommand({ TableName: collection, Key: key }));
    }

    async findAll<T>(collection: string, options?: FindOptions): Promise<T[]> {
        const expr = options ? this.buildExpressions(options) : {};
        const allItems: T[] = [];
        let lastEvaluatedKey: Record<string, unknown> | undefined;

        do {
            const result = expr.keyConditionExpression
                ? await this.client.send(new QueryCommand({
                    TableName: collection,
                    IndexName: expr.indexName,
                    KeyConditionExpression: expr.keyConditionExpression,
                    FilterExpression: expr.filterExpression,
                    ExpressionAttributeNames: expr.expressionAttributeNames,
                    ExpressionAttributeValues: expr.expressionAttributeValues,
                    ExclusiveStartKey: lastEvaluatedKey,
                }))
                : await this.client.send(new ScanCommand({
                    TableName: collection,
                    ConsistentRead: options?.consistentRead,
                    FilterExpression: expr.filterExpression,
                    ExpressionAttributeNames: expr.expressionAttributeNames,
                    ExpressionAttributeValues: expr.expressionAttributeValues,
                    ExclusiveStartKey: lastEvaluatedKey,
                }));

            allItems.push(...(result.Items as T[]) ?? []);
            lastEvaluatedKey = result.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        return allItems;
    }

    async findPage<T>(collection: string, options: PageOptions): Promise<PaginatedResult<T>> {
        const expr = this.buildExpressions(options);
        const collectedItems: T[] = [];
        let currentKey: Record<string, unknown> | undefined = options.cursor
            ? JSON.parse(Buffer.from(options.cursor, 'base64url').toString())
            : undefined;

        while (collectedItems.length < options.limit) {
            const remaining = options.limit - collectedItems.length;

            const result = expr.keyConditionExpression
                ? await this.client.send(new QueryCommand({
                    TableName: collection,
                    IndexName: expr.indexName,
                    KeyConditionExpression: expr.keyConditionExpression,
                    FilterExpression: expr.filterExpression,
                    ExpressionAttributeNames: expr.expressionAttributeNames,
                    ExpressionAttributeValues: expr.expressionAttributeValues,
                    ScanIndexForward: expr.scanIndexForward,
                    Limit: remaining,
                    ExclusiveStartKey: currentKey,
                }))
                : await this.client.send(new ScanCommand({
                    TableName: collection,
                    ConsistentRead: options.consistentRead,
                    FilterExpression: expr.filterExpression,
                    ExpressionAttributeNames: expr.expressionAttributeNames,
                    ExpressionAttributeValues: expr.expressionAttributeValues,
                    Limit: remaining,
                    ExclusiveStartKey: currentKey,
                }));

            collectedItems.push(...(result.Items as T[]) ?? []);
            currentKey = result.LastEvaluatedKey;

            if (!currentKey) break;
        }

        const nextCursor = currentKey
            ? Buffer.from(JSON.stringify(currentKey)).toString('base64url')
            : null;

        return {
            items: collectedItems.slice(0, options.limit),
            nextToken: nextCursor,
        };
    }

    async count(collection: string, options?: FindOptions): Promise<number> {
        const expr = options ? this.buildExpressions(options) : {};
        let total = 0;
        let lastEvaluatedKey: Record<string, unknown> | undefined;

        do {
            const result = expr.keyConditionExpression
                ? await this.client.send(new QueryCommand({
                    TableName: collection,
                    IndexName: expr.indexName,
                    Select: 'COUNT',
                    KeyConditionExpression: expr.keyConditionExpression,
                    FilterExpression: expr.filterExpression,
                    ExpressionAttributeNames: expr.expressionAttributeNames,
                    ExpressionAttributeValues: expr.expressionAttributeValues,
                    ExclusiveStartKey: lastEvaluatedKey,
                }))
                : await this.client.send(new ScanCommand({
                    TableName: collection,
                    Select: 'COUNT',
                    FilterExpression: expr.filterExpression,
                    ExpressionAttributeNames: expr.expressionAttributeNames,
                    ExpressionAttributeValues: expr.expressionAttributeValues,
                    ExclusiveStartKey: lastEvaluatedKey,
                }));

            total += result.Count ?? 0;
            lastEvaluatedKey = result.LastEvaluatedKey;
        } while (lastEvaluatedKey);

        return total;
    }

    async atomicDecrement(
        collection: string,
        key: Record<string, unknown>,
        field: string,
        amount: number
    ): Promise<boolean> {
        try {
            await this.client.send(new UpdateCommand({
                TableName: collection,
                Key: key,
                UpdateExpression: `SET ${field} = ${field} - :amount, updatedAt = :updatedAt`,
                ConditionExpression: `${field} >= :amount`,
                ExpressionAttributeValues: {
                    ':amount': amount,
                    ':updatedAt': new Date().toISOString(),
                },
            }));
            return true;
        } catch (error: any) {
            if (error.name === 'ConditionalCheckFailedException') return false;
            throw error;
        }
    }

    async atomicIncrement(
        collection: string,
        key: Record<string, unknown>,
        field: string,
        amount: number
    ): Promise<number> {
        const result = await this.client.send(new UpdateCommand({
            TableName: collection,
            Key: key,
            UpdateExpression: `ADD #counter :inc`,
            ExpressionAttributeNames: { '#counter': field },
            ExpressionAttributeValues: { ':inc': amount },
            ReturnValues: 'UPDATED_NEW',
        }));

        return result.Attributes![field] as number;
    }

    /**
     * Translates generic FindOptions into DynamoDB-specific expression objects.
     * - index → KeyConditionExpression + IndexName
     * - where → FilterExpression with safe attribute name/value placeholders
     */
    private buildExpressions(options: FindOptions): DynamoExpressions {
        const names: Record<string, string> = {};
        const values: Record<string, unknown> = {};
        let keyConditionExpression: string | undefined;
        let filterExpression: string | undefined;
        let indexName: string | undefined;
        let scanIndexForward: boolean | undefined;

        if (options.index) {
            const { name, partitionKey, partitionValue, sortAscending } = options.index;
            names['#pk'] = partitionKey;
            values[':pkVal'] = partitionValue;
            keyConditionExpression = '#pk = :pkVal';
            indexName = name;
            scanIndexForward = sortAscending ?? false;
        }

        if (options.where?.length) {
            const parts: string[] = [];

            options.where.forEach((condition, i) => {
                const nameKey = `#w${i}`;
                names[nameKey] = condition.field;

                if (condition.operator === 'in') {
                    const arr = condition.value as unknown[];
                    const placeholders = arr.map((val, j) => {
                        const valKey = `:w${i}v${j}`;
                        values[valKey] = val;
                        return valKey;
                    });
                    parts.push(`${nameKey} IN (${placeholders.join(', ')})`);
                } else if (condition.operator === 'begins_with') {
                    const valKey = `:w${i}`;
                    values[valKey] = condition.value;
                    parts.push(`begins_with(${nameKey}, ${valKey})`);
                } else {
                    const valKey = `:w${i}`;
                    values[valKey] = condition.value;
                    const op = this.toOperator(condition.operator);
                    parts.push(`${nameKey} ${op} ${valKey}`);
                }
            });

            filterExpression = parts.join(' AND ');
        }

        return {
            keyConditionExpression,
            filterExpression,
            expressionAttributeNames: Object.keys(names).length > 0 ? names : undefined,
            expressionAttributeValues: Object.keys(values).length > 0 ? values : undefined,
            indexName,
            scanIndexForward,
        };
    }

    private toOperator(op: Exclude<FilterOperator, 'in' | 'begins_with'>): string {
        const map: Record<string, string> = {
            eq: '=', ne: '<>', gt: '>', gte: '>=', lt: '<', lte: '<=',
        };
        return map[op];
    }
}
