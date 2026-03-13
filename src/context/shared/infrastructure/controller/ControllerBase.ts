import type { APIGatewayProxyEvent, APIGatewayProxyResult, SQSEvent, SQSRecord } from 'aws-lambda';

export interface ApiGatewayHandler {
  handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult>;
}

export interface SqsHandler {
  handleRecord(record: SQSRecord, body: unknown): Promise<void>;
}

export interface Controllers {
  api?: ApiGatewayHandler;
  sqs?: SqsHandler;
}

export class ControllerBase {
  private controllers: Controllers;

  constructor(controllers: Controllers) {
    this.controllers = controllers;
  }

  private isApiGateway(event: unknown): event is APIGatewayProxyEvent {
    return typeof event === 'object' && event !== null && 'httpMethod' in event;
  }

  private isSqs(event: unknown): event is SQSEvent {
    return typeof event === 'object' && event !== null && 'Records' in event
      && Array.isArray((event as SQSEvent).Records)
      && (event as SQSEvent).Records[0]?.eventSource === 'aws:sqs';
  }

  async execute(event: unknown): Promise<unknown> {
    console.log('🚀 Init ControllerBase execute event', event);

    if (this.isApiGateway(event) && this.controllers.api) {
      console.log('🔵 ApiGatewayController Started', this.controllers.api.constructor.name);
      const result = await this.controllers.api.handle(event);
      console.log('✅ ApiGatewayController Finished');
      return result;
    }

    if (this.isSqs(event) && this.controllers.sqs) {
      console.log('🔵 SQSController Started', this.controllers.sqs.constructor.name);
      for (const record of (event as SQSEvent).Records) {
        const body = JSON.parse(record.body);
        await this.controllers.sqs.handleRecord(record, body);
      }
      console.log('✅ SQSController Finished');
      return;
    }

    throw new Error(`❌ No controller registered for this event type`);
  }
}
