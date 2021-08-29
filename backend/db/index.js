const mysql = require('mysql2');
require('dotenv').config();





const client = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
})
//Connecting To Database
client.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL");
});



module.exports = client;

