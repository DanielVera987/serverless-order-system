import { NotificationPublisher } from '../../../../src/context/shared/domain/notification/NotificationPublisher';

export interface Publication {
  topicArn: string;
  messageGroupId: string;
  message: unknown;
}

export default class InMemoryNotificationPublisher implements NotificationPublisher {
  readonly publications: Publication[] = [];

  async publish(topicArn: string, messageGroupId: string, message: unknown): Promise<void> {
    this.publications.push({ topicArn, messageGroupId, message });
  }

  publishedTo(topicArn: string): Publication[] {
    return this.publications.filter(p => p.topicArn === topicArn);
  }

  reset(): void {
    this.publications.length = 0;
  }
}
