import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Import GraphQL enum registrations BEFORE any other imports that use them
import './common/graphql-enums';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { OrdersModule } from './orders/orders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { KafkaModule } from './kafka/kafka.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, connection }) => {
        if (connection) {
          // For subscriptions (WebSocket)
          return { req: connection.context };
        }
        // For queries and mutations (HTTP)
        return { req };
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      debug: true,
      introspection: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    OrdersModule,
    NotificationsModule,
    KafkaModule,
    AdminModule,
    HealthModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
