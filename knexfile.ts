// Update with your config settings.

module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://admin:password@postgres:5432/accounts',
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/test'
    }
  },
  development: {
    client: 'pg',
    connection: 'postgres://admin:password@postgres:5432/accounts',
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/dev'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds/prod'
    }
  }
};
