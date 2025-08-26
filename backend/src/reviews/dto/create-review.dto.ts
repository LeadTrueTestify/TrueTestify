import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  title: string;

  @IsString()
  authorName: string;
  
  @IsString()
  authorEmail: string;

  @IsBoolean()
  consent: boolean;

  @IsOptional()
  @IsNumber()
  durationSec?: number;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  previewUrl?: string;

  // Instead of pre-providing keys, let’s allow actual file uploads
  @IsOptional()
  videoFile?: Express.Multer.File;

  @IsOptional()
  audioFile?: Express.Multer.File;
}
