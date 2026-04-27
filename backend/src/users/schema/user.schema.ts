import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserActor } from '../../common/enums/actor.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false,
})
export class User {
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxLength: 50,
    unique: true,
  })
  username: string;

  @Prop({ required: true, select: false, minlength: 8 })
  password: string;

  @Prop({ required: true, trim: true, maxLength: 100 })
  fullname: string;

  @Prop({
    required: true,
    trim: true,
    match: /^[0-9+\-\s()]{9,15}$/,
  })
  phone: string;

  @Prop({
    enum: Object.values(UserActor),
    default: UserActor.WORKER,
    required: true,
  })
  role: UserActor;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: null })
  fcm_token?: string;

  @Prop({ default: null })
  last_login_at?: Date;

  @Prop({ default: null, select: false })
  refresh_token_hash?: string | null;

  created_at: Date;
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
