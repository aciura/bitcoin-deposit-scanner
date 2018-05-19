import { Deposit } from './models/deposit';
import { DbService } from './db/services';
import { convertToTransaction } from './transactionsParser';

console.log(`${(new Date).toLocaleTimeString()}: Starting...`);

process.stdin.resume(); 
process.stdin.setEncoding('utf8');

const buffer:string[] = [];
process.stdin.on('data', (data:string) => buffer.push(data));

process.stdin.on('end', async () => {
 
    let inputJson:string = buffer.join('');
    let parsedJson:any = JSON.parse(inputJson);
 
    const service = new DbService();
    let success = 0, errorCount = 0;
    for (let trans of parsedJson.transactions) {
        // console.log(`${i++}: ${trans.address} ${trans.category} ${trans.amount} CONFIRM:${trans.confirmations}`);        
        try {
            await service.insertTransaction(convertToTransaction(trans));
            success++;                 
        } catch(err) { 
            errorCount++;            
            console.error(`ERROR when saving txid:${trans.txid} vout:${trans.vout}. Error Count: ${errorCount}`, err);             
        }            
    }   
    console.log(`Successfuly inserted ${success} transactions.`); 
    process.stdin.destroy();
});
