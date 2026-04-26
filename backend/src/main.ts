import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  // main.ts
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Bật tính năng "danh sách trắng"
      forbidNonWhitelisted: true, // (Tùy chọn) Sẽ báo lỗi nếu gửi thừa field c
    }),
  );
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log('Server is running on port ' + port);
}
bootstrap();
