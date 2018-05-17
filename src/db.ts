import {IMain, IDatabase} from 'pg-promise';
import pgPromise from 'pg-promise';
import { Deposit } from './deposit';

const connString = 'postgres://admin:password@localhost:5432/accounts';
// let connString:string = process.env.DATABASE_URL || '';

const pgp:IMain = pgPromise();
const db:IDatabase<any> = pgp(connString);

export function query(qs: string): Promise<any> {
  console.log(qs);
  return db.query(qs)  
    // .catch(error => console.error('failed to query db', error));
}

function normalizeValue(value: any) {
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  if (value == null) {
    return 'null';
  }
  if (Array.isArray(value) && value.length == 0) {
    return 'null';
  }
  return value;
}

function normalizeKey(k: string) {
  return `"${k}"`;
}

export function all(table: string) {
  return query(`SELECT * FROM ${table}`);
}

export function clear(table: string) {
  return query(`DELETE FROM ${table}`);
}

export function insertInto(table: string, params: Object) {
  const assigns = Object.keys(params).map(k => normalizeKey(k));
  const values = Object.values(params).map((value:any) => normalizeValue(value));
  return query(`INSERT INTO ${table} (${assigns}) VALUES (${values})`);
}

export function getById(table:string, id:number) {
  return query(`SELECT * FROM ${table} WHERE id=${id}`);
}

export function getDeposits(): Promise<Deposit[]> {
  return query(
  `SELECT 
      T.address, 
      A.owner_name as owner, 
      A.id, 
      COUNT(*) as count, 
      SUM(T.amount) as amount
  FROM records.transactions T
      LEFT OUTER JOIN records.accounts AS A ON A.address = T.address
      WHERE  T.category = 'receive' 
        AND T.confirmations >= 6
  GROUP BY T.address, A.owner_name `);
}

// -- RECEIVE
// SELECT T.address, A.owner_name, SUM(T.amount) as SumAmount
// FROM records.transactions T
// LEFT OUTER JOIN records.accounts as A on A.address = T.address
// where  T.category = 'receive' and T.confirmations >= 6
// group by T.address, A.owner_name

// -- SEND
// SELECT T.address, A.owner_name, SUM(T.amount) as SumAmount
// FROM records.transactions T
// LEFT OUTER JOIN records.accounts as A on A.address = T.address
// where  T.category = 'send' and T.confirmations >= 6
// group by T.address, A.owner_name

// export function update(table:string, id:number, params: {}) {
//   if (params.id) delete params.id;
//   const assigns = Object.keys(params);
//   const values = assigns.map((key) => `${key}=${normalizeValue(params[key])}`).join(', '); // eslint-disable-line
//   return query(`UPDATE ${table} SET ${values} WHERE id=${id} RETURNING *`);
// }

