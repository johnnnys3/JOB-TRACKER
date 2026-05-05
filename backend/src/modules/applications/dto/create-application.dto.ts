import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApplicationStatus } from '@prisma/client';
import { IsTrimmedNotEmpty } from '../../../common/decorators/is-trimmed-not-empty.decorator';

export class CreateApplicationDto {
  @IsString()
  @IsTrimmedNotEmpty()
  company!: string;

  @IsString()
  @IsTrimmedNotEmpty()
  jobTitle!: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
  location?: string;

  
  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
  jobLink?: string;

  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
  salaryRange?: string;

  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
  notes?: string;

  @IsOptional()
  @IsDateString()
  applicationDate?: string;
}
