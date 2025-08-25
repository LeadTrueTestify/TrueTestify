import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SignUploadDto {
  @IsString()
  type: string; // "video" or "audio"

  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  @IsNumber()
  expiresIn?: number;
}
