const Sequelize = require('sequelize');
const dbConfig = require('./config/config');

const conf = dbConfig.development;

const sequelize = new Sequelize(
  conf.database,
  conf.username,
  conf.password,
  {
    host: conf.host,
    dialect: "postgres",
    operatorsAliases: 0,
    logging: 0
  }
);

module.exports = sequelize;
