import {  Controller, Get, NotFoundException, Param, Put, Query, Req, ServiceUnavailableException, UseGuards} from '@nestjs/common';
import { NewsService } from './news.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}
  @Get("/author")
   @UseGuards(AuthGuard())
   async conversion (){
    return await this.newsService.getAuthorAnalytics()
   }
  // api for dashboard analytics
  @Get("/analytics")
  @UseGuards(AuthGuard())
  async analytics (){
    try{
      const analytics = await this.newsService.getAnalytics();
      const counts = await this.newsService.getDocsCount();
      console.log(counts)
      return {analytics, counts}
    }catch(err){
      throw new ServiceUnavailableException("Server error occured!")
    }
   
  }
  // returns paginated news
  @Get("/")
  @UseGuards(AuthGuard())
  async getNews(@Query('page') page = 1, @Query('pageSize') pageSize = 10){
    const totalNews = await this.newsService.getDocCount();
    const paginated = await this.newsService.paginatedNews(page, pageSize);
    const totalPages = Math.ceil(totalNews / pageSize);
    return {totalNews, page,pageSize, paginated, totalPages}
  }
  // get single news
  @Get(":id")
  @UseGuards(AuthGuard())
  // @UseGuards(AuthGuard())
  async getNewsDetails(@Param() id:string){
    if(!id){
      throw new NotFoundException("Id not found");
    }
    const objId = this.newsService.objectIdConversion(id);
    const news = await this.newsService.singleNews(objId);
    if(!news){
      throw new NotFoundException("Invalid id sent. News with this id does not exist!")
    }
    return {success : true, news};
  }
  
  // like controller
  @Put("/like/:id")
  @UseGuards(AuthGuard())
  async likeNews (@Req() req:any, @Param() id: string){
  //  const objId = this.newsService.objectIdConversion(id);
  //  find like service 
  const record = await this.newsService.handleLike(id, req);
  return {record}
 
  }
   // 
   
  
}
