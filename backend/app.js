var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./db');
const dbHelpers = require('./helpers/dbHelpers')(db);
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

//Variables to keep state info about who is logged in
var email_in_use = "";
var password_in_use = "";
var who = "";
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/api/users', usersRouter(dbHelpers));

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

//Create User Account
app.get('/makeAccount', (req, res) => {
  let query = req.query;
  let name = query.name + " " + query.lastname;
  let email = query.email;
  let password = query.password;
  let address = query.address;
  let gender = query.gender;
  let medications = query.medications;
  let conditions = query.conditions;
  let surgeries = query.surgeries;
if(medications===undefined){
    medications="none"
  }
  if(conditions===undefined){
    conditions="none"
  }
  if(!surgeries===undefined){
    surgeries="none"
  }
  let psql_statement = `INSERT INTO Patient (email, password, name, address, gender) 
                       VALUES ` + `("${email}", "${password}", "${name}", "${address}", "${gender}")`;
  console.log(psql_statement);
  con.query(psql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      email_in_use = email;
      password_in_use = password;
      who="pat";
      return res.json({
        data: results
      })
    };
  });
  psql_statement='SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;';
  console.log(psql_statement)
  con.query(psql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      let psql_statement = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication) 
      VALUES ` + `("${generated_id}", curdate(), "${conditions}", "${surgeries}", "${medications}")`;
      console.log(psql_statement);
      con.query(psql_statement, function (error, results, fields) {
        if (error) throw error;
        else {
          let psql_statement = `INSERT INTO PatientsFillHistory (patient, history) 
          VALUES ` + `("${email}",${generated_id})`;
          console.log(psql_statement);
          con.query(psql_statement, function (error, results, fields) {
            if (error) throw error;
            else {};
          });
        };
      });
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
  
//Return Who is Logged in
app.get('/userInSession', (req, res) => {
  return res.json({ email: `${email_in_use}`, who:`${who}`});
});

//Log the user out
app.get('/endSession', (req, res) => {
  console.log("Ending session");
  email_in_use = "";
  password_in_use = "";
});
//Checks If Doctor Exists
app.get('/checkIfDocExists', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = `SELECT * FROM Doctor WHERE email = "${email}"`;
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
//Makes Doctor Account
app.get('/makeDocAccount', (req, res) => {
  let params = req.query;
  let name = params.name + " " + params.lastname;
  let email = params.email;
  let password = params.password;
  let gender = params.gender;
  let schedule = params.schedule;
  let psql_statement = `INSERT INTO Doctor (email, gender, password, name) 
                       VALUES ` + `("${email}", "${gender}", "${password}", "${name}")`;
  console.log(psql_statement);
  con.query(psql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let psql_statement = `INSERT INTO DocsHaveSchedules (sched, doctor) 
                       VALUES ` + `(${schedule}, "${email}")`;
      console.log(psql_statement);
      con.query(psql_statement, function(error){
        if (error) throw error;
      })
      email_in_use = email;
      password_in_use = password;
      who = 'doc';
      return res.json({
        data: results
      })
    };
  });
});
//Checks if doctor is logged in
app.get('/checkDoclogin', (req, res) => {
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let psql_statement = `SELECT * 
                       FROM Doctor
                       WHERE email="${email}" AND password="${password}"`;
  console.log(psql_statement);
  con.query(psql_statement, function (error, results, fields) {
    if (error) {
      console.log("eror");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        email_in_use = json[0].email;
        password_in_use = json[0].password;
        who="doc";
        console.log(email_in_use);
        console.log(password_in_use);
      }
      return res.json({
        data: results
      })
    };
  });
});














app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});



module.exports = app;
