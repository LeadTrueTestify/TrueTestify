import { IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';


export class SignDownloadDto {
@IsString()
@IsNotEmpty()
key: string;


@IsOptional()
@IsInt()
@Min(60)
expiresIn?: number;
}