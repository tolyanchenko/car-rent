import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/modules/consts/consts';

@Injectable()
export class SeedService {
  constructor(@Inject(DATABASE_POOL) private readonly connection: Pool) {}

  async seed() {
    await this.createTables();
    await this.seedCars();
    await this.seedRates();
  }

  private async createTables() {
    await this.connection.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await this.connection.query(
      `CREATE TABLE IF NOT EXISTS cars (state_number VARCHAR(10) NOT NULL PRIMARY KEY, brand VARCHAR(255));`,
    );

    await this.connection.query(`CREATE TABLE IF NOT EXISTS rates
            (name VARCHAR(255) NOT NULL PRIMARY KEY, price NUMERIC)`);

    await this.connection.query(`CREATE TABLE IF NOT EXISTS rent_sessions
            (id UUID NOT NULL DEFAULT uuid_generate_v1() NOT NULL PRIMARY KEY,
            rent_price numeric DEFAULT 1000,
            rent_date_from DATE NOT NULL,
            rent_date_to DATE NOT NULL,
            car_id VARCHAR(10) NOT NULL REFERENCES cars(state_number),
            rate_name VARCHAR(255) NOT NULL REFERENCES rates(name));`);
  }

  private async seedCars() {
    this.connection.query(
      `INSERT INTO cars (brand, state_number ) VALUES ( 'BMW', 'a001aa' ) ON CONFLICT DO NOTHING`,
    );
    this.connection.query(
      `INSERT INTO cars ( brand, state_number ) VALUES ( 'LADA', 'a777ye' ) ON CONFLICT DO NOTHING`,
    );
    this.connection.query(
      `INSERT INTO cars ( brand, state_number ) VALUES ( 'TOYOTA', 'c003cc' ) ON CONFLICT DO NOTHING`,
    );
    this.connection.query(
      `INSERT INTO cars ( brand, state_number ) VALUES ( 'JEEP', 'd004dd' ) ON CONFLICT DO NOTHING`,
    );
  }

  private async seedRates() {
    this.connection.query(
      `INSERT INTO rates (price, name) VALUES (1000, 'base_rate') ON CONFLICT DO NOTHING`,
    );
  }
}
