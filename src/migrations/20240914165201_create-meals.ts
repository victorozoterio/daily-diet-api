import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('uuid').primary()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.boolean('is_within_the_diet').notNullable()
        table.uuid('user_uuid').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()

        table.foreign('user_uuid').references('uuid').inTable('users').onDelete('CASCADE');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

