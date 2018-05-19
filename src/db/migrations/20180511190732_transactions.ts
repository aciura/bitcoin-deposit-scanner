import * as Knex from "knex";

exports.up = function (db: Knex): Promise<any> {
    return Promise.resolve(
        db.schema.createTable('transactions', (table) => {
            table.boolean("involvesWatchonly").notNullable()    
            table.string("address", 64).notNullable()
            table.string("category", 20).notNullable().comment("send or receive")
            table.bigInteger("amount").notNullable().comment("amount in satoshis")
            table.string("label").nullable()
            table.integer("confirmations").notNullable()
            table.string("blockhash", 64).notNullable()
            table.integer("blockindex").notNullable()
            table.bigInteger("blocktime").notNullable() //unix timestamp - bigint (8 bytes)  -9223372036854775808 +9223372036854775807
            table.string("txid", 64).notNullable()
            table.integer("vout").notNullable().comment("output vector / output index")
            table.string("walletconflicts").nullable(), //not used in sample transactions files
            table.bigInteger("time").notNullable(),
            table.bigInteger("timereceived").notNullable()
            table.string("bip125-replaceable", 5).nullable()
            table.string("account", 64).nullable().comment("Obsolete")
            
            //An input uses a txid and vout to identify a particular output to be spent
            table.primary(["txid", "vout"]); 
        })
    );
    
};

exports.down = function (db: Knex): Promise<any> {
    return Promise.resolve(
        db.schema.dropTableIfExists('transactions')
    );
};
