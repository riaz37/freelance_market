import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [PrismaModule],
  providers: [
    NotificationsService,
    NotificationsResolver,
    {
      provide: 'PUB_SUB',
      useFactory: () => new PubSub(),
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
