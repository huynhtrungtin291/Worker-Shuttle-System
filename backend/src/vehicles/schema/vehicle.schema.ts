import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Vehicle {
  @Prop({ required: true, trim: true, unique: true })
  plate_number: string;

  @Prop({ required: true, trim: true })
  vehicle_type: string;

  @Prop({ required: true, type: Number, min: 0 })
  capacity: number;

  @Prop({ type: String, trim: true })
  contractor_name?: string | null;

  @Prop({ type: String, trim: true })
  contractor_phone?: string | null;

  @Prop({
    type: String,
    enum: ['available', 'in_use', 'maintenance', 'retired'],
    default: 'available',
    required: true,
  })
  status: 'available' | 'in_use' | 'maintenance' | 'retired';

  @Prop({ type: String })
  notes?: string | null;

  created_at: Date;
  updated_at: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index({ status: 1 });
