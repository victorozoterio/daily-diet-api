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
      session_uuid: string;
    };
    meals: {
      uuid: string;
      name: string;
      description: string;
      is_within_the_diet: boolean;
      user_uuid: string;
      date_and_time: string;
    };
  }
}
