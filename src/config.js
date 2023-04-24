const fs = require("fs");
const readFileSync = filename => fs.readFileSync(filename).toString("utf8");

// Constants
module.exports = {
  database: {
    host: 'chatdb-service',
    port: '5432',
    database: process.env.POSTGRES_DB,
    user: process.env.DB_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  port: process.env.PORT || 8080
  // if you're not using docker compose for local development, this will default to 8080
  // to prevent non-root permission problems with 80. Dockerfile is set to make this 80
  // because containers don't have that issue :)
};