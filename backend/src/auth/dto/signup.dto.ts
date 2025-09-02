import { IsEmail, IsString, IsOptional, IsHexColor } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  // @IsString()
  // name!: string;  // IF NEED TO CUSTOME NAME

  @IsString()
  businessName!: string;

  @IsString()
  slug!: string; // Must be unique, validated in service

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsHexColor()
  brandColor?: string;
}
