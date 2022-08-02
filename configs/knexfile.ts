import {DB_HOST, DB_NAME, DB_USER, DB_PSW, DB_PORT} from "./config"

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

module.exports = {

  //dev mode
  development: {
    client: 'pg', 
    connection: {
        host: DB_HOST,
        database: DB_NAME,
        user: DB_USER,
        password: DB_PSW,
        port: DB_PORT,
        ssl: { rejectUnauthorized: false }
    },
    pool: {
        min: 2,
        max: 5,
    },
    migrations: {
        directory: "../src/migrations"
    },
    seeds: {
      directory: "../src/seeds"
    }
  }

};
