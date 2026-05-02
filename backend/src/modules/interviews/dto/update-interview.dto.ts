import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateInterviewDto {
  @IsOptional()
  @IsString()
  stage?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
