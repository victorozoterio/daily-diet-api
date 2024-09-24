import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.timestamp('date_and_time');
    });

    await knex('meals').update('date_and_time', knex.raw('created_at'));

    await knex.schema.alterTable('meals', (table) => {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) => {
        table.timestamp('created_at');
        table.timestamp('updated_at');
    });

    await knex('meals').update('created_at', knex.raw('date_and_time'));
    await knex('meals').update('updated_at', knex.raw('date_and_time'));

    await knex.schema.alterTable('meals', (table) => {
        table.dropColumn('date_and_time');
    });
}
