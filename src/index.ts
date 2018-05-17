
console.log(`${(new Date).toLocaleTimeString()}: Starting...${process.argv} length:${process.argv.length}`);

// if (process.argv.length <= 2) {     
//     throw Error('File to read is required as program argument!');    
// }
// const fileToRead = process.argv[2]

interface Transaction {
    involvesWatchonly: boolean;
    /*Obsolete*/ account: string;
    address: string; //"miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM",
    category: string; //"receive",
    amount: number; // 81.84682114,
    label: string; //"",
    confirmations: number; //28,
    blockhash: string; //"00ae9906635f6bc44a278327ab5323ff23d2d4efecf17d021a428a6278b79f26",
    blockindex: number; //53,
    blocktime: number; //1524896887278,
    txid: string; //"7c293b31771cb4ee7e400290023698ad5204789f141488f1f5f3948907266d49",
    vout: number; //16,
    walletconflicts: string[]; //TODO:Check type
    time: number; //1524896845186,
    timereceived: number; //1524896845186,
    "bip125-replaceable": string; //"no"
}


let buffer:string[] = [];

console.time('read input')
process.stdin.resume(); 
process.stdin.setEncoding('utf8');

import * as db from './db';
import { Deposit } from './deposit';

//Proper Money Handling (JSON-RPC)
//https://en.bitcoin.it/wiki/Proper_Money_Handling_%28JSON-RPC%29 
function convertFloat2Satoshi(value: number) { 
    return Math.round(1e8 * value);  
}

function convertToTransaction(jsonObj: any): Transaction {
    jsonObj.amount = convertFloat2Satoshi(jsonObj.amount);
    return jsonObj as Transaction;
}

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