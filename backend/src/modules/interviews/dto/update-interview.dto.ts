import { IsString, IsOptional, IsDateString } from 'class-validator';
import { IsTrimmedNotEmpty } from '../../../common/decorators/is-trimmed-not-empty.decorator';

export class UpdateInterviewDto {
  @IsOptional()
  @IsString()
  @IsTrimmedNotEmpty()
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
  @IsTrimmedNotEmpty()
  notes?: string;
}
