process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import 'mocha';
import { dbConnection } from '../db/dbConnection';
import { DbService } from '../db/services';
import { Transaction } from '../models/transaction';
import { addTransactionsToDb } from '../transactionHandler';

const db = dbConnection();
const service = new DbService();

describe('Transactions', () => {

    beforeEach((done) => {
        db.migrate.rollback()
        .then(() => {
            return db.migrate.latest();
        }).then(() => {
            return db.seed.run();
        }).then(() => { 
            done(); 
        })        
    })

    afterEach((done) => {
        db.migrate.rollback()
        .then(() => {
            done();
        });        
    })
    
    it('add 3 transaction to db', async () => {
        const result = await addTransactionsToDb(testTransactions);
        expect(result).to.be.not.null;
        expect(result.success).to.eq(2);        
        expect(result.errorCount).to.eq(0);
    });

    it('get deposits from db', async () => {
        await addTransactionsToDb(testTransactions);
        const result = await service.getDeposits();
        console.log(result);

        expect(result).to.be.not.null;        
    })

    const testTransactions = [{
		"involvesWatchonly": true,
		"account": "",
		"address": "mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp",
		"category": "receive",
		"amount": 8,
		"label": "",
		"confirmations": 1,
		"blockhash": "3125fc0ebdcbdae25051f0f5e69ac2969cf910bdf5017349ef55a0ef9d76d591",
		"blockindex": 28,
		"blocktime": 1524913087278,
		"txid": "146df95d04dc205f10cbb07d4a55d0ed924056a6a4c8873823fd09811b76387e",
		"vout": 32,
		"walletconflicts": [],
		"time": 1524913064422,
		"timereceived": 1524913064422,
		"bip125-replaceable": "no"
	},
	{
		"involvesWatchonly": true,
		"account": "",
		"address": "mzzg8fvHXydKs8j9D2a8t7KpSXpGgAnk4n",
		"category": "receive",
		"amount": 7.71,
		"label": "",
		"confirmations": 4,
		"blockhash": "a9ed13caa3f13c7168d4c4c52c0439502e46541217eb74b84608510dbc0caf74",
		"blockindex": 8,
		"blocktime": 1524911287278,
		"txid": "5a798928969f3a7be6b85cecbd35cdcc78a0291c8dd0471b66dfbad4459a3366",
		"vout": 49,
		"walletconflicts": [],
		"time": 1524911257226,
		"timereceived": 1524911257226,
		"bip125-replaceable": "no"
	}];

});