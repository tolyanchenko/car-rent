import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/add-session.dto';
import { SessionRepository } from './repos/session.repo';
import { RateRepository } from './repos/rate.repo';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly rateRepository: RateRepository,
  ) {}

  async calculatePrice(getSessionPriceDto) {
    const { rateId } = getSessionPriceDto;
    const dateFromString = getSessionPriceDto.fromDate;
    const dateToString = getSessionPriceDto.toDate;
    const daysNumber = this.getNumberOfDates(dateFromString, dateToString);

    const ratePrice = await this.rateRepository.getRateById(rateId);

    if (!ratePrice) {
      throw new Error('Unknown rate');
    }

    const carRentPrice = this.caclulateRentPrice(daysNumber, ratePrice);
    return {
      carRentPrice,
    };
  }

  async createSession(createSessionData: CreateSessionDto) {
    try {
      const { carId, rateId } = createSessionData;
      const dateFromString = createSessionData.fromDate;
      const dateToString = createSessionData.toDate;

      const fromDate = new Date(dateFromString);
      const toDate = new Date(dateToString);

      await this.checkAvailableStatus(carId, fromDate, toDate);

      const rentPrice = (
        await this.calculatePrice({ fromDate, toDate, rateId })
      ).carRentPrice;

      return this.sessionRepository.createSession({
        rentPrice,
        dateFromString,
        dateToString,
        carId,
        rateId,
      });
    } catch (e: any) {
      return {
        ok: false,
        description: e.message,
      };
    }
  }

  private getNumberOfDates(dateFromString: string, dateToString: string) {
    const dateFrom = new Date(dateFromString);
    const dateTo = new Date(dateToString);
    const daysNumber = this.calculateDaysRange(dateFrom, dateTo);

    if (isNaN(dateFrom.getTime()) || isNaN(dateTo.getTime())) {
      throw new BadRequestException('Invalid date');
    }
    if (!this.isWorkingDay(dateFrom) || !this.isWorkingDay(dateTo)) {
      throw new BadRequestException('You cant start/end rent at weekends'); // вынести наверх
    }

    if (daysNumber > 30) {
      throw new BadRequestException('Max rent period error'); // вынести наверх
    }

    return daysNumber;
  }

  private calculateDaysRange(dateFrom: Date, dateTo: Date) {
    return (dateTo.getTime() - dateFrom.getTime()) / (1000 * 3600 * 24);
  }

  private isWorkingDay(date: Date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }

  caclulateRentPrice(numberOfDays: number, ratePrice: number) {
    let rentPrice = 0;
    let rate = 1;
    for (let daysNumber = 0; daysNumber < numberOfDays; daysNumber++) {
      if (daysNumber < 9 && daysNumber > 4) {
        rate = 0.95;
      } else if (daysNumber < 17) {
        rate = 0.9;
      } else if (daysNumber < 30) {
        rate = 0.85;
      }
      rentPrice += ratePrice * rate;
    }
    return rentPrice;
  }

  private async checkAvailableStatus(
    carId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<void> {
    const valid = this.areDatesValid(dateFrom, dateTo);
    if (!valid) {
      throw new Error('dates are not valid');
    }

    const isAvailable = await this.hasNotSessions(carId, dateFrom, dateTo);

    if (!isAvailable) {
      throw new Error('car is not available');
    }
  }

  private areDatesValid(dateFrom: Date, dateTo: Date) {
    return dateFrom < dateTo;
  }

  private async hasNotSessions(
    carId: string,
    dateFrom: Date,
    dateTo: Date,
  ): Promise<boolean> {
    const restPeriod = 4;
    dateFrom.setDate(dateFrom.getDate() - restPeriod).toLocaleString();
    dateTo.setDate(dateTo.getDate() + restPeriod).toLocaleString();

    const unAvailableDateFrom = `${dateFrom.getFullYear()}-${
      dateFrom.getMonth() + 1
    }-${dateFrom.getDate()}`;
    const unAvailablDateTo = `${dateTo.getFullYear()}-${
      dateTo.getMonth() + 1
    }-${dateTo.getDate()}`;

    const values = await this.sessionRepository.getSessionsByDate(
      carId,
      unAvailableDateFrom,
      unAvailablDateTo,
    );

    if (values.length) {
      return null;
    }

    return !values.length;
  }
}
