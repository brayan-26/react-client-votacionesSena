require("dotenv").config();
const {createPool} = require('mysql2/promise')

const pool = createPool({
    host:process.env.HOST,
    user:'root',
    database:process.env.DATABASE,
})

module.exports = pool;  