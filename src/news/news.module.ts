import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { newsSchema } from './schema/news.schema';
import { AuthModule } from 'src/auth/auth.module';
import { newsdataSchema } from './schema/newsData.schema';
import { likeSchema } from './schema/like.schema';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: 'News', schema: newsSchema }]),MongooseModule.forFeature([{ name: 'Newsdata', schema: newsdataSchema }]),MongooseModule.forFeature([{ name: 'Like', schema: likeSchema }]),],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
