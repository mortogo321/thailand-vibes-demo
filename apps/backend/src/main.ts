import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableShutdownHooks();

  // CORS is env-driven; never enable wildcard + credentials together.
  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
  const origins = corsOrigin
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length === 1 ? origins[0] : origins,
    credentials: true,
  });

  // Strict validation: strip unknown props, reject them, transform payloads.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  // API prefix (health lives under /api/health)
  app.setGlobalPrefix('api');

  const port = Number.parseInt(process.env.PORT ?? '3001', 10);
  await app.listen(port);

  console.log(`Backend server is running on http://localhost:${port}`);
}

void bootstrap();
