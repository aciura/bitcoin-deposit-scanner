import { DbService } from "./db/services";
import { Deposit } from "./models/deposit";
import { convertSatToBtc } from "./utils";
import { DepositReader } from "./depositReader";


function print(deposits: Deposit[]) {
    deposits.forEach(d => 
        console.log(`Deposited for ${d.owner}: count=${d.count} sum=${convertSatToBtc(d.amount)}`));
}

console.log();

const depositReader = new DepositReader();

depositReader.readDepositsFromDb().then((deposits:Deposit[]) => {
    print(deposits.filter(d => !!d.owner));
    
    const unknownDeposits = depositReader.sumUnknownDeposits(deposits);
    console.log(
        `Deposited without reference: count=${unknownDeposits.count} sum=${convertSatToBtc(unknownDeposits.amount)}`);

    depositReader.getMinMaxTransaction().then(minMaxTransaction => {
        console.log(`Smallest valid deposit: ${convertSatToBtc(minMaxTransaction.min)}`);
        console.log(`Largest valid deposit: ${convertSatToBtc(minMaxTransaction.max)}`);
        // process.exit(0)
    });    
});
