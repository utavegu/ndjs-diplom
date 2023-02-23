import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Roles } from '../typing/enums/roles.enum';

@Schema()
export class User {
  // @Prop({ required: true, unique: true })
  // _id: ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: false })
  passwordHash: string;

  @Prop({ required: true, unique: false })
  name: string;

  @Prop({ required: false, unique: false })
  contactPhone: string;

  @Prop({ required: true, unique: false, default: Roles.CLIENT })
  role: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
