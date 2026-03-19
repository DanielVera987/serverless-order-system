import { NotificationPublisher } from "../../../../src/context/shared/domain/notification/NotificationPublisher";

export default class InMemoryNotificationPublisher implements NotificationPublisher {
  async publish(topicArn: string, messageGroupId: string, message: unknown): Promise<void> {
    console.log(`📢 InMemory: Publishing message to topic ${topicArn} with message group ${messageGroupId} and message ${JSON.stringify(message)}`);
  }
}