import { DbService } from "./db/services";
import { Transaction } from "./models/transaction";

const REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION: number = 6; //TODO: Move to a config file.

//Proper Money Handling (JSON-RPC). See https://en.bitcoin.it/wiki/Proper_Money_Handling_%28JSON-RPC%29 
function convertFloat2Satoshi(value: number) { 
    return Math.round(1e8 * value);  
}

function convertToTransaction(jsonObj: any): Transaction {
    jsonObj.amount = convertFloat2Satoshi(jsonObj.amount);
    return jsonObj as Transaction;
}

export async function addTransactionsToDb(transactions: any[]) {
    const service = new DbService();
    let success = 0, errorCount = 0;

    const validTransactions = 
        transactions.map(t => convertToTransaction(t))
        // DECISION: I could store just valid transactions but rules said to store all
        //.filter(t => t.confirmations >= REQUIRED_CONFIRMATIONS_FOR_VALID_TRANSACTION);

    for (const trans of validTransactions) {        
        try {
                await service.insertTransaction(trans);
                success++;                              
        } catch(err) { 
            errorCount++;            
            console.error(`ERROR when saving txid:${trans.txid} vout:${trans.vout}. Error Count: ${errorCount}`, err);
        }
    }   
    const ignored = transactions.length - success - errorCount;
    console.log(`Successfuly inserted ${success} transactions out of ${transactions.length}. Errors: ${errorCount}. Ignored: ${ignored}`); 
    return { success: success, errorCount: errorCount, ignored: ignored, all: transactions.length };
}