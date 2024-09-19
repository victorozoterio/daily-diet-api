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
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
        table.dropColumn('date_and_time');
    });
}
