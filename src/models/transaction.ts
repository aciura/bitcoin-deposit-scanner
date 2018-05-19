
interface Transaction {

    involvesWatchonly: boolean;
    /*Obsolete*/ account: string;
    address: string; //"miTHhiX3iFhVnAEecLjybxvV5g8mKYTtnM",
    category: string; //"receive" / "send",
    amount: number; // 8184682114 satoshis = 81.84682114 btc,
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