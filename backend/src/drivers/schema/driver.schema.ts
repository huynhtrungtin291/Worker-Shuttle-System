import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Driver {
  @Prop({ required: true, unique: true })
  user_id: string;

  @Prop({ required: true, unique: true, trim: true })
  license_number: string;

  @Prop({ type: Date, default: null })
  license_expires_at?: Date | null;

  @Prop({ type: String, default: null })
  default_vehicle_id?: string | null;

  created_at: Date;
  updated_at: Date;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);

DriverSchema.index({ user_id: 1 }, { unique: true });
DriverSchema.index({ license_number: 1 }, { unique: true });
DriverSchema.index({ default_vehicle_id: 1 });
