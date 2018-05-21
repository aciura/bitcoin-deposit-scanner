import { Deposit } from "./models/deposit";
import { DbService } from "./db/services";

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
                return {sum: sum+(+deposit.amount), count: count + (+deposit.count)};
            }
            else return {sum: +sum, count: +count};
        }, {sum:0, count:0});

        return { id: +Infinity,
            owner: OWNER_UNKNOWN, 
            count: unknownDeposits.count, 
            amount: unknownDeposits.sum,
            address: '' }
    }

    public getMinMaxTransaction(): Promise<{min: number, max: number}> {
        return this.dbService.getMinMaxTransaction();
    }
}