// article.model.ts
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { News } from './news.schema';

export class Like extends Document {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "User"})
  user: User
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "News"})
  news: News
}

export const likeSchema = SchemaFactory.createForClass(Like);
