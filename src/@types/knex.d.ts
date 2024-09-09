// biome-ignore lint:
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      uuid: string;
      name: string;
      email: string;
      password: string;
      created_at: Date;
      updated_at: Date;
    };
  }
}
