
// prapare DB
knex migrate:rollback --env development
knex migrate:latest --env development
knex seed:run --env development

./insert-transactions <data/transactions-1.json
./insert-transactions <data/transactions-2.json

 
