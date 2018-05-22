
//Proper Money Handling (JSON-RPC). See https://en.bitcoin.it/wiki/Proper_Money_Handling_%28JSON-RPC%29 
export function convertFloatToSatoshi(value: number): number { 
    return +Math.round(1e8 * value);  
}

export function convertSatToBtc(amountInSatoshi: number): string {
    return (+amountInSatoshi/1e8).toFixed(8);
}