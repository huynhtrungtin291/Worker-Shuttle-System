import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ShiftDocument = HydratedDocument<Shift>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class Shift {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  start_time: string; // HH:mm

  @Prop({ required: true, trim: true })
  factory_arrival_deadline: string; // HH:mm

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  created_at: Date;
  updated_at: Date;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);

ShiftSchema.index({ is_active: 1 });
