
console.log(`${(new Date).toLocaleTimeString()}: Starting...${process.argv} length:${process.argv.length}`);

let buffer:string[] = [];

process.stdin.resume(); 
process.stdin.setEncoding('utf8');

import * as db from './db';
import { Deposit } from './models/deposit';


let success = 0, errorCount = 0;
process.stdin.on('data', (data:string) => buffer.push(data));
process.stdin.on('end', async () => {
    console.timeEnd('read input');

    console.time('parseJson');
    let inputJson:string = buffer.join('');
    let parsedJson:any = JSON.parse(inputJson);
    console.timeEnd('parseJson');
    
    console.time('insert transactions');
    let i = 0;
    for (let trans of parsedJson.transactions) {
        // console.log(`${i++}: ${trans.address} ${trans.category} ${trans.amount} CONFIRM:${trans.confirmations}`);        
        try {
            await db.insertInto('records.transactions', convertToTransaction(trans))
            success++;                 
        } catch(err) { 
            errorCount++;            
            console.error(`ERROR when saving txid:${trans.txid} vout:${trans.vout}. Error Count: ${errorCount}`, err); 
            //TODO: Update existing transaction ?
        }            
    }   
    console.log(`Successfuly inserted ${success} transactions.`); 
    console.timeEnd('insert transactions');

    let deposits:Deposit[] = await db.getDeposits();
    console.log(JSON.stringify(deposits));

    for (let d of deposits) {
        d.address
    }
});


console.log(`${(new Date).toLocaleTimeString()}: end `);