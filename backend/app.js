

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./db');
const dbHelpers = require('./helpers/dbHelpers')(db);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter(dbHelpers));

//Check if patient exists in database
app.get('/checkIfPatientExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Patient WHERE email = "${email}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Patient log-in to show if px is logged in
app.get('/checklogin', (req, res) => {
  let psql_statement = `SELECT * FROM Patient 
                       WHERE email="${email}" 
                       AND password="${password}"`;
  console.log(psql_statement);
  con.query(psql_statement, function (error, results, fields) {
    if (error) {
      console.log("error");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = email;
        password_in_use = password;
        who = "pat";
      }
      return res.json({
        data: results
      })
    };
  });
});
  
//Returns Who is Logged in
app.get('/userInSession', (req, res) => {
  return res.json({ email: `${email_in_use}`, who:`${who}`});
});

//Logs the person out
app.get('/endSession', (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
});














app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});



module.exports = app;
