import { IsArray, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  @IsPositive()
  newsId: number;
  @IsString()
  text: string;
  @IsArray()
  comments?: [];
}
