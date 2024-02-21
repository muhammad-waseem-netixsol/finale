import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './news/news.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [AuthModule, MongooseModule.forRoot("mongodb+srv://infowaseem1234:nestjs@cluster0.xkb1xah.mongodb.net/news"), NewsModule, LikeModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
