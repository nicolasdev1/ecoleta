import Knex from 'knex';

// cria a tabela
export async function up(knex: Knex) {
    return knex.schema.createTable('collectionPoints_items', table => {
        // increments() vai incrementando um número a cada tabela, assim, cada tabela tem seu nome único
        // primary = chave primária da tabela
        table.increments('id').primary();

        table.integer('collectionPoint_id')
            .notNullable()
            // estou dizendo que o collectionPoint_id vai criar uma chave estrangeira na tabela collectionPoints, no campo id
            .references('id')
            .inTable('collectionPoints');

        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('items');
    });
}

// é utilizado para deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('collectionPoints_items');
}
