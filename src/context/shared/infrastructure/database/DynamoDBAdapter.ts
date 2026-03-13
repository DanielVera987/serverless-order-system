import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
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

  async update<T extends Record<string, unknown>>(tableName: string, item: T): Promise<void> {
    await this.client.send(new PutCommand({
      TableName: tableName,
      Item: item,
    }));
  }

  async delete(tableName: string, key: Record<string, unknown>): Promise<void> {
    await this.client.send(new DeleteCommand({
      TableName: tableName,
      Key: key,
    }));
  }

  async scan<T>(tableName: string): Promise<T[]> {
    const result = await this.client.send(new ScanCommand({
      TableName: tableName,
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
}
