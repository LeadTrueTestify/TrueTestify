import { IsString, IsInt, IsBoolean, IsEnum, IsOptional, IsDefined, ValidateIf } from 'class-validator';

export class CreateReviewDto {
  @IsEnum(['video', 'audio', 'text'])
  type: string;

  @IsString()
  @IsDefined({ message: 'Title is required' })
  title: string;

  @ValidateIf(o => o.type === 'text')
  @IsString()
  @IsDefined({ message: 'Body text is required for text reviews' })
  bodyText?: string;

  @IsInt()
  @IsDefined({ message: 'Rating is required' })
  rating: number;

  @IsString()
  @IsDefined({ message: 'Reviewer name is required' })
  reviewerName: string;

  @IsBoolean()
  @IsDefined({ message: 'Consent is required' })
  consentChecked: boolean;

  @IsOptional()
  reviewerContactJson?: Record<string, any>;

  @IsString()
  @IsOptional()
  source?: string;
}