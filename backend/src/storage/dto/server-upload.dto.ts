import { IsIn, IsOptional, IsString } from 'class-validator';


export class ServerUploadDto {
@IsIn(['video', 'audio'])
type: 'video' | 'audio';

filename: string;

@IsOptional()
@IsString()
contentType?: string;

}