import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { InterviewType, InterviewStatus } from '@prisma/client';

export class CreateInterviewDto {
  @IsEnum(InterviewType)
  type: InterviewType;

  @IsString()
  stage: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

  @IsString()
  applicationId: string;
}
