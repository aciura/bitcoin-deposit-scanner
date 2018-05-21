
//Proper Money Handling (JSON-RPC). See https://en.bitcoin.it/wiki/Proper_Money_Handling_%28JSON-RPC%29 
export function convertFloat2Satoshi(value: number) { 
    return Math.round(1e8 * value);  
}

export function convertSatToBtc(amountInSatoshi: number): string {
    let str = amountInSatoshi.toString().padStart(9, '0');
    return str.substr(0, str.length-8) + '.' + str.slice(-8);
}