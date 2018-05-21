process.env.NODE_ENV = 'test';

import { expect } from 'chai';
import 'mocha';
import { DepositReader } from '../depositReader';

describe('Deposit Reader', () => {

    const depositReader = new DepositReader();

    it('sum unknown deposits', () => {
        let deposits = [
            { id:1, amount: -0.5, owner:'', count: 1, address:"A0" },
            { id:1, amount: 1, owner:'', count: 1, address:"A1" },
            { id:2, amount: 2, owner:'', count: 2, address:"A3" },
            { id:99, amount: 99.999, owner:'Mr Robot', count: 99, address:"A99" },
        ]
        const unknownDeposit = depositReader.sumUnknownDeposits(deposits);
        expect(unknownDeposit.amount).eq(2.5);
        expect(unknownDeposit.count).eq(4);
    })
})