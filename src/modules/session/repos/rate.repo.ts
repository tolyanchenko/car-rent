import { Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { DATABASE_POOL } from 'src/modules/consts/consts';

export class RateRepository {
  constructor(@Inject(DATABASE_POOL) private readonly connection: Pool) {}

  async getRateById(rateName: string) {
    const rate = (
      await this.connection.query(
        `SELECT (price) FROM rates WHERE name = '${rateName}'`,
      )
    ).rows;
    console.log(rate);

    return rate[0].price;
  }
}
