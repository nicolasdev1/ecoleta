import Knex from 'knex';

// cria a tabela
export async function up(knex: Knex) {
    return knex.schema.createTable('items', table => {
        // increments() vai incrementando um número a cada tabela, assim, cada tabela tem seu nome único
        // primary = chave primária da tabela
        table.increments('id').primary();

        table.string('title')
            .notNullable();
        table.string('image')
            .notNullable();
    });
}

// é utilizado para deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('items');
}
