import { Injectable } from '@nestjs/common';
import { ICarsReport } from 'src/interfaces/report.interface';
import { IGetSessions } from 'src/interfaces/session.interface';
import { SessionRepository } from '../session/repos/session.repo';

@Injectable()
export class ReportService {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async createNewReport(getReportDto) {
    const dateFromString = getReportDto.dateFrom;
    const dateToString = getReportDto.dateTo;

    let result = { totalAverage: 0, cars: {} };
    const dateFrom = new Date(dateFromString);
    const dateTo = new Date(dateToString);

    const yearFrom = dateFrom.getFullYear();
    const monthFrom = dateFrom.getMonth() + 1;

    const yearTo = dateTo.getFullYear();
    const monthTo = dateTo.getMonth() + 1;

    if (dateFrom > dateTo) {
      throw new Error('Wrong Dates');
    }

    const sessions: IGetSessions[] =
      await this.sessionRepository.getSessionsSliceByTimePeroiod(
        yearFrom,
        monthFrom,
        yearTo,
        monthTo,
      );

    if (!sessions.length) {
      return {
        hasError: false,
        message: 'No Session Found',
      };
    }

    let totalAverage = 0;

    const numberOfMonths: number = this.calculateNumberOfMonths(
      monthFrom,
      monthTo,
      yearFrom,
      yearTo,
    );

    const carReport: ICarsReport = this.calculateReportDate(
      monthFrom,
      monthTo,
      yearFrom,
      yearTo,
      sessions,
    );

    for (const key in carReport) {
      carReport[key].daysNumber = this.calculateAverageDays(
        carReport[key].daysNumber,
        numberOfMonths,
      );
      totalAverage += +carReport[key].daysNumber;
    }

    result.totalAverage = totalAverage / Object.keys(carReport).length;
    result.cars = carReport;

    return result;
  }

  private calculateNumberOfMonths(
    monthFrom: number,
    monthTo: number,
    yearFrom: number,
    yearTo: number,
  ) {
    if (yearFrom === yearTo) {
      return monthTo - monthFrom;
    }
    return (yearTo - yearFrom - 1) * 12 + (12 - monthFrom + monthTo);
  }

  private calculateReportDate(
    monthFrom,
    monthTo,
    yearFrom,
    yearTo,
    sessions: IGetSessions[],
  ) {
    const result = {};
    const lastDayOfLastMonth = new Date(yearTo, monthTo, 0).getDate();

    for (const session of sessions) {
      let daysNumber = 0;

      const sessionDateFrom = new Date(session.session_data.date_from);
      const sessionDateTo = new Date(session.session_data.date_to);

      const sessionYearFrom = sessionDateFrom.getFullYear();
      const sessionYearTo = sessionDateTo.getFullYear();

      const sessionMonthFrom = sessionDateFrom.getMonth() + 1;
      const sessionMonthTo = sessionDateTo.getMonth() + 1;

      const sessionDayFrom = sessionDateFrom.getDate();
      const sessionDayTo = sessionDateTo.getDate();

      if (yearFrom === sessionYearFrom || yearTo === sessionYearTo) {
        if (sessionMonthFrom < monthFrom) {
          daysNumber = sessionDayTo;
        } else if (sessionMonthTo > monthTo) {
          daysNumber = lastDayOfLastMonth - sessionDayFrom;
        } else {
          daysNumber = sessionDayTo - sessionDayFrom;
        }
      } else if (sessionMonthFrom === sessionMonthTo) {
        daysNumber = sessionDayTo - sessionDayFrom;
      } else {
        const lastDayOfMonth = new Date(
          sessionYearFrom,
          sessionMonthFrom,
          0,
        ).getDate();
        daysNumber = sessionDayTo + (lastDayOfMonth - sessionDayFrom);
      }

      if (!result[session.session_data.car_number]) {
        result[session['session_data'].car_number] = {
          daysNumber: 0,
        };
      }

      result[session.session_data.car_number].daysNumber += daysNumber;
    }
    return result;
  }

  private calculateAverageDays(daysNumber, numberOfMonths) {
    if (numberOfMonths === 0) {
      throw new Error('No Division By Zero Allowed');
    }
    return numberOfMonths ? +(daysNumber / numberOfMonths).toFixed(2) : 0;
  }
}
