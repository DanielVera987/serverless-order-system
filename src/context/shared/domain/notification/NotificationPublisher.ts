export interface NotificationPublisher {
    publish(topicArn: string, messageGroupId: string, message: unknown): Promise<void>;
}
