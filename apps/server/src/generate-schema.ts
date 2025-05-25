import { NestFactory } from '@nestjs/core';
import { GraphQLSchemaFactory } from '@nestjs/graphql';
import { printSchema } from 'graphql';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { UsersResolver } from './users/users.resolver';
import { ProjectsResolver } from './projects/projects.resolver';
import { OrdersResolver } from './orders/orders.resolver';
import { NotificationsResolver } from './notifications/notifications.resolver';
import { AppResolver } from './app.resolver';

async function generateSchema() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([
    UsersResolver,
    ProjectsResolver,
    OrdersResolver,
    NotificationsResolver,
    AppResolver,
  ]);

  const schemaString = printSchema(schema);
  fs.writeFileSync(path.join(process.cwd(), 'src/schema.gql'), schemaString);

  await app.close();
  console.log('Schema generated successfully!');
}

generateSchema();
