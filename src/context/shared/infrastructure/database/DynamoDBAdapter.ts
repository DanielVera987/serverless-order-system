import { DynamoDBAdapter as DynamoDBAdapterDomain } from '../../domain/database/DynamoDBAdapter';
import { AttributeValue, DeleteItemCommand, DynamoDBClient, GetItemCommand, PutItemCommand, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { Injectable } from '../di';

@Injectable()
export class DynamoDBAdapter implements DynamoDBAdapterDomain {
  constructor(private readonly dynamoDBClient: DynamoDBClient) {
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
    });
  }

  async get<T>(tableName: string, key: Record<string, unknown>): Promise<T | null> {
    const result = await this.dynamoDBClient.send(new GetItemCommand({
        TableName: tableName,
        Key: key as Record<string, AttributeValue>,
      }),
    );

    return result.Item as T | null;
  }

  async update<T extends Record<string, unknown>>(tableName: string, item: T): Promise<void> {
    await this.dynamoDBClient.send(new PutItemCommand({
      TableName: tableName,
      Item: item as Record<string, AttributeValue>,
    }));
  }

  async delete(tableName: string, key: Record<string, unknown>): Promise<void> {
    await this.dynamoDBClient.send(new DeleteItemCommand({
      TableName: tableName,
      Key: key as Record<string, AttributeValue>,
    }));
  }

  async scan<T>(tableName: string): Promise<T[]> {
    const result = await this.dynamoDBClient.send(new ScanCommand({
      TableName: tableName,
    }));
    return result.Items?.map((item) => item as T) ?? [];
  }

  async query<T>(tableName: string, keyCondition: string, expressionValues: Record<string, unknown>): Promise<T[]> {
    const result = await this.dynamoDBClient.send(new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeValues: expressionValues as Record<string, AttributeValue>,
    }));
    return result.Items?.map((item) => item as T) ?? [];
  }
}