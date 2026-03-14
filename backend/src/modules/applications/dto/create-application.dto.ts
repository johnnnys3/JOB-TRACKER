import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApplicationStatus, JobType } from '@prisma/client';

export class CreateApplicationDto {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsDateString()
  applicationDate?: string;
}
