import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetReportResponseDto } from './dto/get-report.dto';
import { GetReportDto } from './dto/get-report.dto';
import { ReportService } from './report.service';

@ApiTags('Report')
@Controller('report')
export class CarController {
  constructor(private readonly reportService: ReportService) {}

  @ApiOperation({
    summary: 'Get Report Period',
    description: 'Get Average Values',
  })
  @Get('/report-by-period')
  async getDaysReportByPeriod(@Query() getReportDto: GetReportDto) {
    return this.reportService.createNewReport(getReportDto);
  }
}
