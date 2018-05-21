import * as knex from 'knex';
import { dbConnection } from './dbConnection';
import { Transaction } from '../models/transaction';
import { Deposit } from '../models/deposit';

const REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION:number = 6; //TODO: Move to a config file

export class DbService {
    private connector: knex;

    constructor() {
        this.connector = dbConnection();
    }

    private Accounts() {
        return this.connector.table('accounts');
    } 

    private Transactions() {
        return this.connector.table('transactions');
    }

    public async getAllAccounts(): Promise<Account[]> {
        try {
            const accounts = await this.Accounts().select('*').orderBy('id');
            //console.log(accounts)
            return accounts as Account[];
        }
        catch(err) {
            console.error(err);
            return [];
        }
    }

    public insertTransaction(transaction: Transaction) {
        try { 
            return this.Transactions().insert(transaction);
        } catch(err) {
            console.error('DbService:' + err)
        }
    }

    public async getValidDeposits(): Promise<Deposit[]> {
        try { 
            const result = await this.connector.raw(
            `SELECT
                T.address, 
                A.owner, 
                A.id, 
                COUNT(*) as count, 
                SUM(T.amount) as amount
            FROM transactions T
                LEFT OUTER JOIN accounts AS A 
                ON A.address = T.address
            WHERE T.confirmations >= ${REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION}
            GROUP BY T.address, A.owner, A.id 
            ORDER BY A.id`);
            
            if (result.rows) {
                return result.rows as Deposit[];
            }            

        } catch (err) {
            console.error('DbService:' + err);
        }
        return [] as Deposit[];
    }

    public async getMinMaxTransaction(): Promise<{min:number,max:number}> {
        try {
            const result = await this.connector
                .select(this.connector.min('amount').as('min'), this.connector.max('amount').as('max'))
                .from('transactions')
                .where('confirmations', '>=', REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION)
                .andWhere('amount', '>', 0);
            return result;
            
        } catch (err) {
            console.error('DbService:' + err);
            throw err;
        }
    }
}