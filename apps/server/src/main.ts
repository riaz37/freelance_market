import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}/graphql`);
}
bootstrap();
