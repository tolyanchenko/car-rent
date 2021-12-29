import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GetSessionPriceResponseDto {
  @ApiProperty()
  carRentPrice: number;
}

export class GetSessionPriceRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  fromDate: string;

  @ApiProperty()
  @IsNotEmpty()
  toDate: string;

  @ApiProperty()
  @IsNotEmpty()
  rateId: string;
}
