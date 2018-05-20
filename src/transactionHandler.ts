import { DbService } from "./db/services";
import { Transaction } from "./models/transaction";

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

    for (let trans of transactions) {
        // console.log(`${i++}: ${trans.address} ${trans.category} ${trans.amount} CONFIRM:${trans.confirmations}`);        
        try {
            await service.insertTransaction(convertToTransaction(trans));
            success++;                 
        } catch(err) { 
            errorCount++;            
            console.error(`ERROR when saving txid:${trans.txid} vout:${trans.vout}. Error Count: ${errorCount}`, err);             
        }            
    }   
    console.log(`Successfuly inserted ${success} transactions. Errors: ${errorCount}.`); 
    return { success: success, errorCount: errorCount };
}