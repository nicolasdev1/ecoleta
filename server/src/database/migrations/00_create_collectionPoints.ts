import Knex from 'knex';

// cria a tabela
export async function up(knex: Knex) {
    return knex.schema.createTable('collectionPoints', table => {
        // increments() vai incrementando um número a cada tabela, assim, cada tabela tem seu nome único
        // primary = chave primária da tabela
        table.increments('id').primary();
        
        table.string('name').notNullable();
        table.string('image').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('city').notNullable();
        table.string('uf', 2).notNullable();
    });
}

// é utilizado para deletar a tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('collectionPoints');
}
