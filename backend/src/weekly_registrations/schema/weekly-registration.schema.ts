import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WeeklyRegistrationDocument = HydratedDocument<WeeklyRegistration>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class WeeklyRegistration {
  @Prop({ required: true })
  worker_id: string;

  @Prop({ required: true })
  shift_id: string;

  @Prop({ required: true, type: String })
  trip_date: string; // YYYY-MM-DD

  @Prop({
    type: String,
    enum: ['registered', 'cancelled', 'missed'],
    default: 'registered',
  })
  status: 'registered' | 'cancelled' | 'missed';

  @Prop({ type: String })
  cancel_reason?: string | null;

  @Prop({ type: Date })
  cancelled_at?: Date | null;

  @Prop({ type: Number })
  iso_week: number;

  @Prop({ type: Number })
  iso_year: number;

  created_at: Date;
  updated_at: Date;
}

export const WeeklyRegistrationSchema = SchemaFactory.createForClass(WeeklyRegistration);

WeeklyRegistrationSchema.index({ worker_id: 1, trip_date: 1, shift_id: 1 }, { unique: true });
WeeklyRegistrationSchema.index({ iso_year: 1, iso_week: 1 });
WeeklyRegistrationSchema.index({ status: 1 });
