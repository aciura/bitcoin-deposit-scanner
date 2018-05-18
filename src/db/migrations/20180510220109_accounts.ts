import * as Knex from "knex";

exports.up = function (db: Knex): Promise<any> {
    return Promise.resolve(
        db.schema.createTable('accounts', (table) => {        
            table.integer('id').notNullable().primary();
            table.string('owner').notNullable();
            table.string('address').notNullable();
        })
    );
    
    /*.createTable('transactions', (table) => {
        "involvesWatchonly" boolean NOT NULL,    
        address varchar(64) NOT NULL, --"miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM",
        category varchar(20) NOT NULL, --"receive",
        amount BIGINT NOT NULL, -- 8184682114 satoshis = 81.84682114 btc,
        label varchar(255) NULL,
        confirmations INT NOT NULL, --28,
        blockhash varchar(64) NOT NULL, --"00ae9906635f6bc44a278327ab5323ff23d2d4efecf17d021a428a6278b79f26",
        blockindex INT NOT NULL, --53,
        blocktime BIGINT NOT NULL, --1524896887278, bigint (8 bytes)  -9223372036854775808 +9223372036854775807
        txid VARCHAR(64) NOT NULL, --"7c293b31771cb4ee7e400290023698ad5204789f141488f1f5f3948907266d49",
        vout INT NOT NULL, --16
        walletconflicts VARCHAR(64) NULL, --TODO:Check type
        "time" BIGINT NOT NULL, --1524896845186,
        timereceived BIGINT NOT NULL, --1524896845186,
        "bip125-replaceable" VARCHAR(5), --"no",
        account varchar(50) NULL, //Obsolete
        
        PRIMARY KEY (txid, vout)  -- An input uses a txid and vout to identify a particular output to be spent
        });
    */
};

exports.down = function (db: Knex): Promise<any> {
    return Promise.resolve(
        db.schema
        .dropTable('accounts')
        .dropTableIfExists('transactions'));
};
