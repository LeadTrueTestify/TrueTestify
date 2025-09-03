import { IsString, IsBoolean, IsOptional, IsInt, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  type!: string; // 'video' or 'audio'

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  bodyText?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  reviewerName?: string;

  @IsBoolean()
  @IsNotEmpty()
  consentChecked!: boolean; // Mandatory consent
}