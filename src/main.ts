import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PROJECT_PORT;
  app.enableCors({
    origin:'http://127.0.0.1:6000'
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }))
  await app.listen(port || 3000, ()=>console.log(`server is listening on port ${port}`)
  ); 
} 
bootstrap();
