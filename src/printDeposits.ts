import { DbService } from "./db/services";
import { Deposit } from "./models/deposit";
import { convertSatToBtc } from "./utils";
import { DepositReader } from "./depositReader";


function print(deposits: Deposit[]) {
    deposits.forEach(d => 
        `Deposited for ${d.owner}: count=${d.count} sum=${convertSatToBtc(d.amount)}`);
}

const depositReader = new DepositReader();
depositReader.readDepositsFromDb().then((deposits:Deposit[]) => {
    print(deposits.filter(d => d.owner));
    
    const unknownDeposits = depositReader.sumUnknownDeposits(deposits);
    console.log(
        `Deposited without reference: count=${unknownDeposits.count} sum=${convertSatToBtc(unknownDeposits.amount)}`);

    const minMaxTransaction = depositReader.getMinMaxTransaction();

    console.log(`Smallest valid deposit: ${minMaxTransaction.min}`);
    console.log(`Largest valid deposit: ${minMaxTransaction.max}`);

    process.exit(0)
});
