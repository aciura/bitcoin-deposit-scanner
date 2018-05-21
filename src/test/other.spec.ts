process.env.NODE_ENV = 'test';

import 'mocha';
import { expect } from 'chai';
import { convertSatToBtc } from '../utils';
import { convertFloatToSatoshi } from '../utils'

describe('Other/Utils', () => {
    it('convert satoshis to btc', () => {
        const satoshis = 1;
        expect(convertSatToBtc(satoshis)).equal("0.00000001");

        expect(convertSatToBtc(33)).equal("0.00000033");

        const maxSatAmount = 21 * 1e6 * 1e8; /* 21 000 000 BTC in satoshis */
        expect(convertSatToBtc(maxSatAmount)).equal('21000000.00000000');

        const maxSatMinusOne = maxSatAmount - 1;
        expect(convertSatToBtc(maxSatMinusOne)).equal('20999999.99999999');
    });

    it('convert float -> satoshi -> float string', () => {
        const amount = 123.00456789;
        const result = convertSatToBtc(convertFloatToSatoshi(amount));
        expect(result).equal(amount.toFixed(8));
    })
});