import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Worker, WorkerSchema } from './schema/worker.schema';

@Module({
  controllers: [WorkersController],
  providers: [WorkersService],
  imports: [UsersModule, MongooseModule.forFeature([{ name: Worker.name, schema: WorkerSchema }])],
})
export class WorkersModule {}
