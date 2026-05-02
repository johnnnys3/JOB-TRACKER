import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  stage!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  applicationId?: string;
}
