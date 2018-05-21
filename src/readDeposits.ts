import { DbService } from "./db/services";
import { Deposit } from "./models/deposit";

const OWNER_UNKNOWN = "Unknown";

export class DepositReader {
    private dbService: DbService = new DbService();

    public async readDepositsFromDb() {
        return await this.dbService.getValidDeposits();
        // console.log(JSON.stringify(deposits));
    }

    public sumUnknownDeposits(deposits: Deposit[]): Deposit {
        let unknownDeposits = deposits.reduce(({sum, count}, deposit) => { 
            if (!deposit.owner) {                 
                return {sum: sum + (+deposit.amount), count : count + 1};
            }
            else return {sum: sum, count: count};
        }, {sum:0, count:0});
        console.log(`Unknown: count:${unknownDeposits.count} sum:${unknownDeposits.sum}`)
        return { 
            id: +Infinity,
            owner: OWNER_UNKNOWN, 
            count: unknownDeposits.count, 
            amount: unknownDeposits.sum,
            address: '' }
    }

    public getMinMaxTransaction(): any {
        throw new Error("Method not implemented.");
    }
}


export function convertSatToBtc(amountInSatoshi: number): string {
    let str = amountInSatoshi.toString().padStart(9, '0');
    return str.substr(0, str.length-8) + '.' + str.slice(-8);
}

function print(deposits: Deposit[]) {
    deposits.forEach(d => `Deposited for ${d.owner}: count=${d.count} sum=${convertSatToBtc(d.amount)}`);
}

const depositReader = new DepositReader();
depositReader.readDepositsFromDb().then((deposits:Deposit[]) => {
    const unknownDeposits = depositReader.sumUnknownDeposits(deposits);
    const minMaxTransaction = depositReader.getMinMaxTransaction();

    print(deposits.filter(d => d.owner));

    process.exit(0)
});
