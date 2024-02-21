/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schema/news.schema';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { Newsdata } from './schema/newsData.schema';
import { Like } from './schema/like.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: mongoose.Model<News>,
    @InjectModel(Newsdata.name)
    private newsDataSchema: mongoose.Model<Newsdata>,
    @InjectModel(Like.name) private likeModel: mongoose.Model<Like>,
  ) {}
  // returns all numbers of news
  async getDocsCount() {
    const total = await this.newsModel.countDocuments();
    const lang = await this.newsModel.countDocuments({ language: 'english' });
    const us = await this.newsDataSchema.countDocuments({ country: 'US' });
    const spam = await this.newsDataSchema.countDocuments({ spam_score: 0 });
    console.log(lang, us, spam);
    return { total, lang, us, spam };
  }
  async paginatedNews(page: number, pageSize: number) {
    try {
      const result = await this.newsModel
        .find()
        .populate({
          path: 'reference',
          model: 'Newsdata',
          options: { strictPopulate: false },
        })
        .skip((page - 1) * pageSize)
        .limit(Number(pageSize))
        .exec();

      console.log(result?.[0]?.title, 'anas');
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // total num of news
  async getDocCount() {
    return await this.newsModel.countDocuments();
  }
  // return news by id
  async singleNews(id: ObjectId) {
    return await this.newsModel.findById(id);
  }
  // convert string to object id
  objectIdConversion(id: string) {
    const objectId = new ObjectId(id);
    return objectId;
  }

  async handleLike(id: string, req: any) {
    const newsId = new ObjectId(id);
    return await this.newsModel.findByIdAndUpdate(
      { _id: newsId },
      { comments: ['updated'] },
    );

    // Create a new Like document
    // const like = await this.likeModel.create({ user: req?.user?._id, news: newsId });

    // Find the corresponding News document
    // const news = await this.newsModel.findById(newsId);

    // // Check if the News document exists
    // if (!news) {
    //   throw new BadRequestException("Invalid news ID");
    // }

    // // Check if the likes field is an array, if not initialize it
    // if (!Array.isArray(news.likes)) {
    //   news.likes = [];
    // }

    // // Push the ID of the newly created Like document into the News.likes array
    // news.likes.push(like._id);

    // // Save the updated News document
    // return await news.save();

    // const user = req?.user?._id.toString();
    // Retrieve the news article by ID
    //   const news = await this.newsModel.findById(id);
    //   console.log(req?.user?._id);
    //   news?.likes?.push(user);
    // console.log(news);
    //   return await news.save();
    // }

    //   // Check if the user's ID is already in the comments array
    //   const userIndex = newsLikes?.findIndex((commentId) => commentId === req?.user?._id.toString());
    //   console.log(userIndex)
    //   // If the user's ID is not in the comments array, add it (like/comment)
    //   if (userIndex === -1) {
    //     newsLikes.push(req?.user?._id);
    //   } else {
    //     // If the user's ID is in the comments array, remove it (unlike/uncomment)
    //     newsLikes.splice(userIndex, 1);
    //   }

    //   // Update the news article with the modified comments array
    //   const updatedNews = await this.newsModel.findByIdAndUpdate(
    //     { _id: id },
    //     { comments: newsLikes },
    //     { new: true } // To get the updated document
    //   );

    //   // Return the updated news article
    //   return updatedNews;
    // } catch (error) {
    //   // Handle any potential errors here
    //   console.error(error);
    //   return { message: 'Error handling like/comment' };
    // }
  }

  //  find like doc
  async findLikeDoc(id: ObjectId) {
    return await this.likeModel.findOne({ news: id });
  }
  // aggregation for chart
  async getAnalytics() {
    const startDate = new Date('2016-10-26');
    const endDate = new Date('2016-11-26');

    const intervalDays = 4;
    const intervals = [];
    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + intervalDays)
    ) {
      intervals.push(new Date(currentDate));
    }

    const formatDate = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };
      return date.toLocaleDateString('en-US', options);
    };

    const pipelines = intervals.map((intervalStartDate, index) => {
      const intervalEndDate = new Date(intervalStartDate);
      intervalEndDate.setDate(intervalEndDate.getDate() + intervalDays);

      return {
        $match: {
          language: { $in: ['english', 'spanish', 'french', 'turkish'] },
          published: { $gte: intervalStartDate, $lt: intervalEndDate },
        },
      };
    });

    const results = await Promise.all(
      pipelines.map((pipeline) =>
        this.newsModel.aggregate([
          pipeline,
          { $group: { _id: '$language', count: { $sum: 1 } } },
        ]),
      ),
    );

    const dates = intervals.map(formatDate);
    const englishCounts = results.flatMap(
      (result) => result.find((item) => item._id === 'english')?.count || 0,
    );
    const spanishCounts = results.flatMap(
      (result) => result.find((item) => item._id === 'spanish')?.count || 0,
    );
    const frenchCounts = results.flatMap(
      (result) => result.find((item) => item._id === 'french')?.count || 0,
    );
    const turkishCounts = results.flatMap(
      (result) => result.find((item) => item._id === 'french')?.count || 0,
    );

    return { dates, englishCounts, spanishCounts, frenchCounts, turkishCounts };
  }

  // changing english to spanish
  async updateTable1WithReferences(): Promise<void> {
    try {
      const table1Docs = await this.newsModel.find().limit(5); // Limit to the first 100 documents
      // console.log("These are", table1Docs);
      table1Docs.forEach(async (table1Doc: any) => {
        console.log({ test2: table1Doc._doc._id }, 'anas');

        const test = await this.newsModel.findById(table1Doc._doc._id);
        console.log({ test, test2: table1Doc._doc._id }, 'anas');

        // await this.newsModel.findByIdAndUpdate(
        //   table1Doc._id,
        //   { $set: { language: 'news' } },
        //   { new: true }
        // );

        console.log('Document updated:', { table1Doc });
      });
      const id = new ObjectId('65ccfedde956e832af08648a');
      const test = await this.newsModel.findById(id);

      console.log({ test });
      console.log('All documents updated successfully.');
    } catch (error) {
      console.error(
        'An error occurred while updating Table 1 with modified fields:',
        error,
      );
      throw new Error(
        'An error occurred while updating Table 1 with modified fields.',
      );
    }
  }

  // authors

  async getAuthorAnalytics() {
    const startDate = new Date('2016-10-26');
    const endDate = new Date('2016-11-26');
    const intervalDays = 4;
    const intervals = [];
    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + intervalDays)
    ) {
      intervals.push(new Date(currentDate));
    }
    const pipelines = intervals.map((intervalStartDate, index) => {
      const intervalEndDate = new Date(intervalStartDate);
      intervalEndDate.setDate(intervalEndDate.getDate() + intervalDays);
      return {
        $match: {
          author: {
            $in: [
              'Whitney Webb',
              'Brianna Acuesta',
              'True Activist',
              'Amanda Froelich',
              'Anonymous Activist',
            ],
          },
          published: {
            $gte: new Date(intervalStartDate.toISOString()),
            $lt: new Date(intervalEndDate.toISOString()),
          },
        },
      };
    });
    const results = await Promise.all(
      pipelines.map(async (pipeline, index) => {
        console.log(
          `Processing pipeline ${index + 1}:`,
          JSON.stringify(pipeline),
        );

        const result = await this.newsModel.aggregate([
          pipeline,
          { $group: { _id: '$author', count: { $sum: 1 } } },
        ]);

        console.log(
          `Result for pipeline ${index + 1}:`,
          JSON.stringify(result),
        );

        return result;
      }),
    );

    const dates = intervals.map((interval) => interval.toISOString());
    const WhitneyCounts = results.map(
      (result) =>
        result.find((item) => item._id === 'Whitney Webb')?.count || 0,
    );
    const BriannaCounts = results.map(
      (result) =>
        result.find((item) => item._id === 'Brianna Acuesta')?.count || 0,
    );
    const TrueCounts = results.map(
      (result) =>
        result.find((item) => item._id === 'True Activist')?.count || 0,
    );
    const AmandaCounts = results.map(
      (result) =>
        result.find((item) => item._id === 'Amanda Froelich')?.count || 0,
    );
    const AnonymousCounts = results.map(
      (result) =>
        result.find((item) => item._id === 'Anonymous Activist')?.count || 0,
    );
    return {
      dates,
      WhitneyCounts: WhitneyCounts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0),
      AnonymousCounts: AnonymousCounts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0),
      AmandaCounts: WhitneyCounts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0),
      TrueCounts: TrueCounts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0),
      BriannaCounts: BriannaCounts.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0),
    };
  }
}
