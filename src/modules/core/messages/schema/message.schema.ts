import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<Message>;
@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, required: true })
  sender: string;

  @Prop({ type: String, required: true })
  receiver: string;

  @Prop({ type: String, required: true })
  pointer: string;

  @Prop({ type: String, required: true })
  role: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Date, required: true })
  send_time: Date;

  @Prop({ type: Buffer, required: true })
  audio: Buffer;

  @Prop({ type: Buffer, required: true })
  file: Buffer;
}

export const messageSchema = SchemaFactory.createForClass(Message);
messageSchema.index({ receiver: 1, sender: 1 });
