import { IsString, IsOptional, IsDateString } from 'class-validator';
import { IsTrimmedNotEmpty } from '../../../common/decorators/is-trimmed-not-empty.decorator';

export class CreateInterviewDto {
  @IsString()
  @IsTrimmedNotEmpty()
  stage!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
  notes?: string;

  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
  applicationId?: string;
}
