import { Injectable, NotFoundException } from '@nestjs/common';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from 'src/news/dto/create-comment.dto';
import { Comment } from 'src/news/entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class NewsService {
  private news: News[] = [];
  create(createNewsDto: CreateNewsDto) {
    const news: News = {
      id: this.news.length + 1,
      author: 'Filip',
      title: createNewsDto.title,
      text: createNewsDto.title,
      comments: [],
      date: new Date().toUTCString(),
      thumb: createNewsDto.thumb,
    };
    this.news.push(news);
  }
  createComment(createCommentDto: CreateCommentDto) {
    const newsId = createCommentDto.newsId;
    const news = this.findOne(newsId);

    const comment: Comment = {
      id: news.comments.length + 1,
      author: 'Mifort',
      text: createCommentDto.text,
      date: new Date().toUTCString(),
    };

    this.news[newsId - 1].comments.push(comment);
  }

  commentReply(id: number, commentReplyDto: CreateCommentDto) {
    const news = this.findOne(id);
    const comment = news.comments[commentReplyDto.newsId - 1];
    const reply: Comment = {
      id: news.comments[commentReplyDto.newsId - 1].id + 1,
      author: 'Mifort',
      text: commentReplyDto.text,
      date: new Date().toUTCString(),
    };
    comment.replys.push(reply);
  }

  findAll() {
    return this.news;
  }

  findOne(id: number) {
    const news = this.news.find((news) => news.id === id);
    if (!news) {
      throw new NotFoundException();
    }
    return news;
  }

  update(id: number, updateNewsDto: UpdateNewsDto) {
    const news = this.findOne(id);
    const updatedNews = { ...news, ...updateNewsDto };
    this.news[id - 1] = updatedNews;
  }
  updateComment(id: number, updateCommentDto: UpdateCommentDto) {
    this.news[id - 1].comments[updateCommentDto.id - 1].text =
      updateCommentDto.text;
  }

  remove(id: number) {
    return `This action removes a #${id} news`;
  }
  status(id: number) {
    return `This action return a #${id}`;
  }
}
