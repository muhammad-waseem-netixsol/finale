// article.model.ts
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Newsdata } from './newsData.schema';

export class News extends Document {
  @Prop()
  uuid: string;
  @Prop()
  ord_in_thread: number;
  @Prop()
  author: string;
  @Prop()
  published: Date;
  @Prop()
  title: string;
  @Prop()
  text: string;
  @Prop()
  language: string;
  @Prop()
  crawled: Date;
  @Prop()
  thread_title: string;
  @Prop()
  replies_count: number;
  @Prop()
  participants_count: number
  @Prop()
  shares: number;
  @Prop()
  type: string;
  @Prop({type: mongoose.Types.ObjectId, ref: "Newsdata"})
  reference: Newsdata;
  @Prop()
  comments: [];
  @Prop()
  likes: [];
}

export const newsSchema = SchemaFactory.createForClass(News);
