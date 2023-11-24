import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.DB_PORT;
  app.enableCors({
    origin:'http://127.0.0.1:5000'
  })
  await app.listen(port || 3000, ()=>console.log(`server is listening on port ${port}`)
  );
}
bootstrap();
