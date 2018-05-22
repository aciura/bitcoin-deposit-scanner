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
    
    private transactionsTable(): knex.QueryBuilder {
        return this.connector.table('transactions');
    } 

    public async getAllAccounts(): Promise<Account[]> {
        try {
            const accounts = await this.connector
                .table('accounts')
                .select('*').orderBy('id');
            
            return accounts as Account[];
        }
        catch(err) {
            console.error(err);
            return [];
        }
    }

    public insertTransaction(transaction: Transaction) {
        try { 
            return this.connector.table('transactions')
                .insert(transaction);
        } catch(err) {
           // console.error('DbService:' + err)
        }
    }

    public async getValidDeposits(): Promise<Deposit[]> {
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
        return [] as Deposit[];
    }

    public async getMinMaxTransaction(): Promise<{min:number,max:number}> {
        const result = await this.transactionsTable()
            .select(this.connector.raw('MIN(amount) as min, MAX(amount) as max'))
            .where('confirmations', '>=', REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION)
            .andWhere('amount', '>', 0);            
        
        return result[0];
    }
    
    getTransaction(txid: string, vout: number): any {
        return this.transactionsTable().where('txid', txid).andWhere('vout', vout)
            .then(result => result[0]);
    }
}