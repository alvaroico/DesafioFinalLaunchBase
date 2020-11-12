const { Pool } = require("pg");

module.exports = new Pool({
  user: "postgres",
  password: "alvaroico",
  host: "localhost",
  port: 5432,
  database: "foodfy",
});
