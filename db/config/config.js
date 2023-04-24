module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'chatdb-service',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'chatdb-service',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: 'chatdb-service',
    dialect: 'postgres',
  }
};