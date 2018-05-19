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

    public async getAllAccounts() {
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
    
}