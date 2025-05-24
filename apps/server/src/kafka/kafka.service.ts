import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private topicHandlers: Map<string, (message: any) => Promise<void>> =
    new Map();

  constructor() {
    this.kafka = new Kafka({
      clientId: 'freelance-market',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: 'freelance-market-service',
    });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async subscribeToTopic(
    topic: string,
    handler: (message: any) => Promise<void>,
  ) {
    this.topicHandlers.set(topic, handler);

    // Subscribe to the topic if not already subscribed
    await this.consumer.subscribe({ topic, fromBeginning: true });

    // If this is the first subscription, start the consumer
    if (this.topicHandlers.size === 1) {
      await this.startConsumer();
    }
  }

  private async startConsumer() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const handler = this.topicHandlers.get(topic);
        if (handler) {
          const messageValue = message.value?.toString();
          if (messageValue) {
            try {
              const parsedMessage = JSON.parse(messageValue);
              await handler(parsedMessage);
            } catch (error) {
              console.error(`Error processing Kafka message: ${error.message}`);
            }
          }
        }
      },
    });
  }

  async sendMessage(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
