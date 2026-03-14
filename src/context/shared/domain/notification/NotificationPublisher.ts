export interface NotificationPublisher {
    publish(topicArn: string, message: unknown): Promise<void>;
}
