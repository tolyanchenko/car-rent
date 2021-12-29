import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSessionResponseDto } from './dto/add-resp.dto';
import { CreateSessionDto } from './dto/add-session.dto';
import {
  GetSessionPriceRequestDto,
  GetSessionPriceResponseDto,
} from './dto/get-session-price.dto';
import { SessionsService } from './session.service';

@ApiTags('Session')
@Controller('session')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @ApiOperation({
    summary: "Create Car's Rent Session",
    description: 'Create New Session. ( rateId - base_rate )',
  })
  @ApiResponse({ status: 201, type: CreateSessionResponseDto })
  @Post()
  async createSession(@Query() createSessionDto: CreateSessionDto) {
    return this.sessionsService.createSession(createSessionDto);
  }

  @ApiOperation({
    summary: 'Calculate Price By Period',
    description: 'Calculation Of The Price Of Renting',
  })
  @ApiResponse({ status: 201, type: GetSessionPriceResponseDto })
  @Get('/price')
  async calculatePrice(
    @Query() getSessionPriceDto: GetSessionPriceRequestDto,
  ): Promise<GetSessionPriceResponseDto> {
    try {
      return this.sessionsService.calculatePrice(getSessionPriceDto);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }
  }
}
