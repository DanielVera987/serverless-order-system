import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { NotificationPublisher } from '../../domain/notification/NotificationPublisher';
import { Injectable } from '../di';

@Injectable()
export class SNSNotificationPublisher implements NotificationPublisher {
    private readonly client: SNSClient;

    constructor() {
        this.client = new SNSClient({});
    }

    async publish(topicArn: string, message: unknown): Promise<void> {
        await this.client.send(new PublishCommand({
            TopicArn: topicArn,
            Message: JSON.stringify(message),
        }));
    }
}
