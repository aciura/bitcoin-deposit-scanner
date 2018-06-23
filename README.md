# bitcoin-deposit-scanner

The program processes transactions and filters them for valid deposits. 
It reads all transactions from /data/transactions-1.json (output of bitcoind's rpc call "listsinceblock"), and stores them in relational database (postgres). 
At the end it reads valid deposits for customer accounts from the database and prints them on the screen. 

## Getting Started

To start the project run: 
docker-compose up

The program has 3 main parts: 
1. postgres database 
2. inserting transactions 
3. printing deposits 

Ad1. **postgres database**
I use postgres relational database as a reliable and fast DB that can handle complicated SQL queries. Database schema is created by using knex migrations inside src/db/migrations directory. 
Example customer accounts are added to the database as part of src/db/seeds/dev/account_seeds.ts. 
Database has just 2 tables - accounts and transactions. 
In 'transactions' table all transactions from data files are stored. Later when returning deposits, transactions need to be aggregated for each address/customer. 

Ad2. **inserting transactions** 
Files with transactions-data are provided as standard-input into the "insertTransactions.ts" file. It's parsing JSON and inserting it to the DB. Amount is stored in Satoshis instead of float BTC value (using conversion 1BTC = 100 000 000 Satoshi). This way all calculations in JavaScript and Database are done on integer values and it is safer and more reliable. This is the way recommended by  https://en.bitcoin.it/wiki/Proper_Money_Handling_%28JSON-RPC%29 . 
Each payment Input can only have 1 Output from previous transaction, which is uniquely identified by TransactionId (txid) and output-index (vout). Therefore, I am using (txid, vout) as a primary key in "transactions" table. In case there is transaction with the same (txid, vout) it's not inserted into the DB, to avoid duplicated deposits.

Ad3. **printing deposits**
Printing deposits starts in "printDeposits.ts". I am using one SQL query with group-by to calculate deposits for all addresses. 

### Prerequisites

You need to have docker running before starting this project. See: https://docs.docker.com/install/ 

### Building project

To build project use: npm run build.
This will run TypeScript compiler and create JavaScript files inside dist/.
I decided to use typescript as it helps during development by keeping track of types error.

## Running the tests

After running "docker-compose up", you can run tests using: 
docker exec -it kraken_node_1 npm test
(or "winpty docker exec -it kraken_node_1 npm test" on Windows)

For automated tests I am using Mocha test framework & chai assertions. Tests are inside src/test directory. 
The tests in "src/test/transaction.spec.ts" use database migrations to setup database schema, insert data to DB and run integration tests.

## Built With

* [knex](http://knexjs.org/) - Sql query builder and db migration tool, 
* [postgresql](https://www.postgresql.org/) - Relational database 
* [typescript](https://www.typescriptlang.org/) - Javascript with types 
* [Mocha](https://mochajs.org/) - automated test framework, 
* [chai](http://www.chaijs.com/) - fluent assertion library
* [nodeJs](https://nodejs.org/en/)  
* [docker](https://www.docker.com/) 

## Authors

* **Adrian Ciura** aciura@gmail.com

## License

This project is licensed under the MIT License
