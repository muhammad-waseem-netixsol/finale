// article.model.ts
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { News } from './news.schema';


export class Newsdata extends Document {
  @Prop({type: mongoose.Schema.Types.String})
  uuid: News;
  @Prop()
  site_url: string;
  @Prop()
  country: string; 
  @Prop()
  spam_score: number; 
}

export const newsdataSchema = SchemaFactory.createForClass(Newsdata);
