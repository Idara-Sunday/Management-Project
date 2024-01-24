import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PROJECT_PORT ||7800;
  app.enableCors({
    origin:'http://localhost:6000'
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }))
  app.setGlobalPrefix('api/v1')
  const options = new DocumentBuilder()
  .setTitle('Management System API')
  .setDescription('Management system api')
  .setVersion('1.0.0')
  .build();
  const document = SwaggerModule.createDocument(app,options);
  SwaggerModule.setup('api/v1',app,document)
  await app.listen(port, ()=>console.log(`server is listening on port ${port}`)
  ); 
} 
bootstrap();
 