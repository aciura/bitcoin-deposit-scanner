import { addTransactionsToDb } from "./transactionHandler";

console.log(`Insert transactions`);

process.stdin.resume(); 
process.stdin.setEncoding('utf8');

const buffer:string[] = [];
process.stdin.on('data', (data:string) => buffer.push(data));

process.stdin.on('end', () => {
 
    const inputJson:string = buffer.join('');
    const parsedJson:any = JSON.parse(inputJson);
    
    addTransactionsToDb(parsedJson.transactions).then((result) => {
        console.log(`Successfuly inserted ${result.success} transactions out of ${result.all}. Errors: ${result.errorCount}. Ignored: ${result.ignored}`);         
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
    })
});
