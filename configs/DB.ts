const knex = require("knex");
const configure = require('./knexfile.ts');

export default knex(configure.development);