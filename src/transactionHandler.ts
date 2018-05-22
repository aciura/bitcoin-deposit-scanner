import { DbService } from "./db/services";
import { Transaction } from "./models/transaction";
import { convertFloatToSatoshi } from "./utils";
import { EWOULDBLOCK } from "constants";


const REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION: number = 6; //TODO: Move to a config file.

function convertToTransaction(jsonObj: any): Transaction {
    jsonObj.amount = convertFloatToSatoshi(jsonObj.amount);
    return jsonObj as Transaction;
}

export async function addTransactionsToDb(transactions: any[]) {
    const service = new DbService();
    let success = 0, errorCount = 0;

    const validTransactions = 
        transactions.map(t => convertToTransaction(t))
        // DECISION: I could just store valid transactions but rules said to store all transactions
        //.filter(t => t.confirmations >= REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION);

    for (const trans of validTransactions) {        
        try {
                await service.insertTransaction(trans);
                success++;                              
        } catch(err) { 
            // Exclude duplicated transactions from DB.
            // There are not many duplications, so we don't need to check
            // if transaction exists before inserting it (I belive this way is faster).
            errorCount++;            
            console.error(`Duplicated Transaction txid:${trans.txid} vout:${trans.vout}. Error Count: ${errorCount}`);            
        }
    }   
    const ignored = transactions.length - success - errorCount;
    return { success: success, errorCount: errorCount, ignored: ignored, all: transactions.length };
}