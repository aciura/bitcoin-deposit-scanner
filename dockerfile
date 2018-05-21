FROM node:8.9.1

WORKDIR /usr/app
COPY package*.json .
RUN npm install --quiet
RUN npm run tsc
COPY . .

# prapare DB
RUN knex migrate:rollback --env development
RUN knex migrate:latest --env development
RUN knex seed:run --env development

# insert transactions 
RUN ./insert-transactions <data/transactions-1.json
RUN ./insert-transactions <data/transactions-2.json

# print deposits
CMD node ./dist/src/printDeposits

 
