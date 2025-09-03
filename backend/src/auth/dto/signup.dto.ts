import { IsEmail, IsString, IsOptional, IsHexColor, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password!: string;

  @IsString({ message: 'Business name must be a string' })
  businessName!: string;

  @IsString({ message: 'Slug must be a string' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase, alphanumeric, and may contain hyphens (e.g., glam-beauty)',
  })
  slug!: string; // Must be unique, validated in service

  @IsOptional()
  @IsString({ message: 'Website must be a string' })
  website?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid contact email format' })
  contactEmail?: string;

  @IsOptional()
  @IsHexColor({ message: 'Brand color must be a valid hex color (e.g., #ff69b4)' })
  brandColor?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string; // Optional user name as per users table
}