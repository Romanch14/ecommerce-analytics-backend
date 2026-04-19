
const {Pool} = require("pg");

const pool = new Pool({
    host: 'localhost',
    database : 'ecommerce',
    port: 5432,
    user : 'postgres',
    password: 'admin'
});
module.exports = pool;

