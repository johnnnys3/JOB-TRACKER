import { IsString, MaxLength } from 'class-validator';
import { IsTrimmedNotEmpty } from '../../../common/decorators/is-trimmed-not-empty.decorator';

export class CreateTagDto {
  @IsString()
  @IsTrimmedNotEmpty()
  @MaxLength(40)
  name!: string;
}
