import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand, QueryCommand, BatchWriteCommand, BatchWriteCommandOutput, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../domain/database/DynamoDBAdapter';
import { Injectable } from '../di';

@Injectable()
export class DynamoDBAdapter implements DynamoDBAdapterDomain {
  private readonly client: DynamoDBDocumentClient;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  }

  async get<T>(tableName: string, key: Record<string, unknown>): Promise<T | null> {
    const result = await this.client.send(new GetCommand({
      TableName: tableName,
      Key: key,
    }));

    return (result.Item as T) ?? null;
  }

  async createBulk<T extends Record<string, unknown>>(tableName: string, items: T[]): Promise<T[]> {
    const MAX_BATCH_SIZE = 25; // AWS DynamoDB limit to 25 items per batch
    const MAX_RETRIES = 5; // Retry 5 times if unprocessed items are detected

    for (let i = 0; i < items.length; i += MAX_BATCH_SIZE) {
      const chunk = items.slice(i, i + MAX_BATCH_SIZE);
      let unprocessed: Record<string, unknown[]> | undefined = {
        [tableName]: chunk.map(item => ({ PutRequest: { Item: item } })),
      };

      for (let attempt = 0; attempt < MAX_RETRIES && unprocessed; attempt++) {
        const result = await this.client.send(new BatchWriteCommand({
          RequestItems: unprocessed,
        }));

        const pending = result.UnprocessedItems;
        if (pending && Object.keys(pending).length > 0) {
          unprocessed = pending;
          const delay = Math.pow(2, attempt) * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          unprocessed = undefined;
        }
      }

      if (unprocessed) {
        throw new Error(`Failed to process all items after ${MAX_RETRIES} retries`);
      }
    }

    return items;
  }

  async update<T extends Record<string, unknown>>(tableName: string, item: T): Promise<T> {
    await this.client.send(new PutCommand({
      TableName: tableName,
      Item: item,
    }));
    return item;
  }

  async delete(tableName: string, key: Record<string, unknown>): Promise<void> {
    await this.client.send(new DeleteCommand({
      TableName: tableName,
      Key: key,
    }));
  }

  async scan<T>(tableName: string, options?: { consistentRead?: boolean; filterExpression?: string; expressionAttributeNames?: Record<string, string>; expressionAttributeValues?: Record<string, unknown> }): Promise<T[]> {
    const result = await this.client.send(new ScanCommand({
      TableName: tableName,
      ConsistentRead: options?.consistentRead,
      FilterExpression: options?.filterExpression,
      ExpressionAttributeNames: options?.expressionAttributeNames,
      ExpressionAttributeValues: options?.expressionAttributeValues,
    }));
    return (result.Items as T[]) ?? [];
  }

  async query<T>(tableName: string, keyCondition: string, expressionValues: Record<string, unknown>): Promise<T[]> {
    const result = await this.client.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionValues,
    }));
    return (result.Items as T[]) ?? [];
  }

  async atomicIncrement(tableName: string, key: Record<string, unknown>, counterField: string, incrementBy: number): Promise<number> {
    const result = await this.client.send(new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: `ADD #counter :inc`,
      ExpressionAttributeNames: { '#counter': counterField },
      ExpressionAttributeValues: { ':inc': incrementBy },
      ReturnValues: 'UPDATED_NEW',
    }));

    return result.Attributes![counterField] as number;
  }
}
