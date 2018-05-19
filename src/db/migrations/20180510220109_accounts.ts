import * as Knex from "knex";

exports.up = function (db: Knex): Promise<any> {
    return Promise.resolve(
        db.schema.createTable('accounts', (table) => {        
            table.integer('id').notNullable().primary();
            table.string('owner').notNullable();
            table.string('address').notNullable();
        })
    );    
};

exports.down = function (db: Knex): Promise<any> {
    return Promise.resolve(
        db.schema.dropTableIfExists('accounts')
    );        
};
