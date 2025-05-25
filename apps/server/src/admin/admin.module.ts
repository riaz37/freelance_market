import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [PrismaModule],
  providers: [
    AdminService,
    AdminResolver,
    {
      provide: 'PUB_SUB',
      useFactory: () => new PubSub(),
    },
  ],
})
export class AdminModule {}
