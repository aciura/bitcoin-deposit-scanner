process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import 'mocha';
import { dbConnection } from '../db/dbConnection';
import { DbService } from '../db/services';

const db = dbConnection();
const service = new DbService();

describe('Accounts', () => {

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
        db.migrate.rollback().then(() => {
            done();
        });        
    })

    it('there are accounts in db', async () => {
        let accounts = await service.getAllAccounts();
        expect(accounts).to.be.not.empty;
        expect(accounts).to.be.length(7);        
    });

    


});