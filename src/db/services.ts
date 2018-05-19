import * as knex from 'knex';
import { dbConnection } from './dbConnection';

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

    insertTransaction(transaction: Transaction) {
        try { 
            return this.Transactions().insert(transaction);
        } catch(err) {
            console.error(err)
        }
    }
    
}