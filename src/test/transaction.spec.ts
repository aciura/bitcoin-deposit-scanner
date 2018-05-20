process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import 'mocha';
import { dbConnection } from '../db/dbConnection';
import { DbService } from '../db/services';
import { Transaction } from '../models/transaction';
import { addTransactionsToDb } from '../transactionHandler';

const db = dbConnection();
const service = new DbService();

const testTransactions = [{
    "involvesWatchonly": true,
    "account": "",
    "address": "mmFFG4jqAtw9MoCC88hw5FNfreQWuEHADp", /*'Leonard McCoy'*/
    "category": "receive",
    "amount": 8,
    "label": "",
    "confirmations": 6,
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
    "address": "mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ", /*'Wesley Crusher'*/
    "category": "receive",
    "amount": 7.71,
    "label": "",
    "confirmations": 7,
    "blockhash": "a9ed13caa3f13c7168d4c4c52c0439502e46541217eb74b84608510dbc0caf74",
    "blockindex": 8,
    "blocktime": 1524911287278,
    "txid": "5a798928969f3a7be6b85cecbd35cdcc78a0291c8dd0471b66dfbad4459a3366",
    "vout": 49,
    "walletconflicts": [],
    "time": 1524911257226,
    "timereceived": 1524911257226,
    "bip125-replaceable": "no"
},
{
    "involvesWatchonly": true,
    "account": "",
    "address": "mvd6qFeVkqH6MNAS2Y2cLifbdaX5XUkbZJ",/*'Wesley Crusher'*/
    "category": "receive",
    "amount": 6,
    "label": "",
    "confirmations": 60,
    "blockhash": "a851ec2903a544e87d4bc5e89a9f5183353d0aa029420e706b6773358907e41c",
    "blockindex": 97,
    "blocktime": 1524877687278,
    "txid": "51294115c07d4c393ad82761aabbfd35f7f82580f209c0cfa04b3e6f1e4e0e9f",
    "vout": 58,
    "walletconflicts": [],
    "time": 1524877647575,
    "timereceived": 1524877647575,
    "bip125-replaceable": "no"
}];

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
    
    it('add 2 transactions to db', async () => {
        const result = await addTransactionsToDb(testTransactions.slice(0, 2));
        expect(result).to.be.not.null;
        expect(result.success).to.be.eq(2);        
        expect(result.errorCount).to.be.eq(0);
    });

    it('get deposits from db', async () => {
        await addTransactionsToDb(testTransactions);
        
        const deposits = await service.getDeposits();
        for (let d of deposits) {
            console.log('Deposit:' + JSON.stringify(d));
        }

        expect(deposits).to.be.not.null;
        expect(deposits.length).to.be.eq(2);
    })
    
});