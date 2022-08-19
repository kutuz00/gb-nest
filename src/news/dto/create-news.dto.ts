import { Matches } from 'class-validator';

export class CreateNewsDto {
  @Matches(/^.{3,20}[!?.]?$/, { message: 'Must be at least 3 characters' })
  title: string;
  @Matches(/^.{10,5000}$/, { message: 'Must be at least 10 characters' })
  text: string;
  thumb: string;
}
