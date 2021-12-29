import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/modules/consts/consts';
import { ICreateSession } from 'src/interfaces/session.interface';
import { IGetSessions } from 'src/interfaces/session.interface';
import { CreateSessionResponseDto } from '../dto/add-resp.dto';

@Injectable()
export class SessionRepository {
  constructor(@Inject(DATABASE_POOL) private readonly connection: Pool) {}

  async createSession(
    sessionData: ICreateSession,
  ): Promise<Array<CreateSessionResponseDto>> {
    const { rentPrice, dateFromString, dateToString, carId, rateId } =
      sessionData;

    return (
      await this.connection.query(
        `INSERT INTO rent_sessions (rent_price, rent_date_from, rent_date_to, car_id, rate_name) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
        [rentPrice, dateFromString, dateToString, carId, rateId],
      )
    ).rows;
  }

  async getSessionsByDate(
    carId: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<CreateSessionResponseDto[]> {
    
    return (
      await this.connection.query(
        `
    SELECT * FROM rent_sessions WHERE 
    car_id = $1 
    AND ((rent_date_from >= $2
    AND rent_date_to <= $3) OR (rent_date_from < $2 AND rent_date_to > $2) OR (rent_date_from < $3 AND rent_date_to > $3))`,
        [carId, dateFrom, dateTo],
      )
    ).rows;
  }

  async getSessionsSliceByTimePeroiod(
    yearFrom: number,
    monthFrom: number,
    yearTo: number,
    monthTo: number,
  ): Promise<Array<IGetSessions>> {
    return (
      await this.connection.query(
        `
        SELECT json_build_object(
          'car_number', cars.state_number, 'date_from', sessions.rent_date_from, 'date_to', sessions.rent_date_to) as session_data
          FROM rent_sessions sessions LEFT JOIN cars ON cars.state_number = sessions.car_id
          WHERE
          ((EXTRACT(YEAR FROM sessions.rent_date_from) = $1) OR (EXTRACT(YEAR FROM sessions.rent_date_to) = $3)) AND 
          ((EXTRACT(MONTH FROM sessions.rent_date_from) >= $2) OR (EXTRACT(MONTH FROM sessions.rent_date_from) <= $4)) OR
          ((EXTRACT(YEAR FROM sessions.rent_date_from) > $1) OR (EXTRACT(YEAR FROM sessions.rent_date_to) < $3))
          `,
        [yearFrom, monthFrom, yearTo, monthTo],
      )
    ).rows;
  }
}
