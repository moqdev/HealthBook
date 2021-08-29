//load .env data into process.env
require('dotenv').config();
var mysql = require('mysql2');
var fs = require('fs');
var readline = require('readline');
var myCon = mysql.createConnection({
   host: 'localhost',
   port: '3306',
   database: 'healthbook',
   user: 'root',
   password: 'root'
   //multipleStatements: true
});
var rl = readline.createInterface({
  input: fs.createReadStream('./db/./schema/01_users.sql'),
  terminal: false
 });
rl.on('line', function(chunk){
    myCon.query(chunk.toString('ascii'), function(err, sets, fields){
     if(err) console.log(err);
    });
});
rl.on('close', function(){
  console.log("finished");
  myCon.end();
});


