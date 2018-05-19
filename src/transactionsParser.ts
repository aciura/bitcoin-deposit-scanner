
//Proper Money Handling (JSON-RPC)
//https://en.bitcoin.it/wiki/Proper_Money_Handling_%28JSON-RPC%29 
function convertFloat2Satoshi(value: number) { 
    return Math.round(1e8 * value);  
}

function convertToTransaction(jsonObj: any): Transaction {
    jsonObj.amount = convertFloat2Satoshi(jsonObj.amount);
    return jsonObj as Transaction;
}

