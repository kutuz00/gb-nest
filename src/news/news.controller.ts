import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Admin } from 'src/decorators/admin.decorator';
import { RolesGuard } from 'src/guards/access.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post()
  // @Admin('admin')
  // @UseGuards(RolesGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const fileName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${fileName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: /(jpg|png|bpm)$/ })],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
    @Body() createNewsDto: CreateNewsDto,
  ) {
    console.log(file);

    return this.newsService.create({
      ...createNewsDto,
      thumb: file.filename,
      file: file.path,
    });
  }

  @Post('comment')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.newsService.createComment(createCommentDto);
  }
  @Get()
  findAll() {
    return this.newsService.findAll();
  }
  @Get(':id/details')
  status(@Param('id') id: string) {
    return this.newsService.status(+id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }
  @Patch(':id/comment')
  updateComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.newsService.updateComment(+id, updateCommentDto);
  }
  @Post(':id/comment')
  commentReply(
    @Param('id') id: string,
    @Body() commentReplyDto: CreateCommentDto,
  ) {
    return this.newsService.commentReply(+id, commentReplyDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}
