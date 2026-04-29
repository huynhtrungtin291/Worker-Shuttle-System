import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../../users/schema/user.schema';

export type WorkerDocument = HydratedDocument<Worker>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Worker {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, trim: true, unique: true })
  employee_code: string;

  @Prop({ trim: true })
  department?: string;

  @Prop({ required: true, trim: true })
  pickup_address: string;

  @Prop({ required: true, min: -90, max: 90 })
  pickup_lat: number;

  @Prop({ required: true, min: -180, max: 180 })
  pickup_lng: number;

  @Prop({ trim: true })
  default_shift_id?: string;

  created_at: Date;
  updated_at: Date;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
