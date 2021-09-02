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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
  let statement = `SELECT * FROM Patient WHERE email = '${email}';`
  console.log(statement);
  db.query(statement, function (error, results, fields) {
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
                       VALUES ` + `('${email}', '${password}', '${name}', '${address}', '${gender}');`
  console.log(psql_statement);
  db.query(psql_statement, function (error, results, fields) {
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
  db.query(psql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(results)
      let generated_id = results[0].id + 1;
      let psql_statement = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication) 
      VALUES ` + `('${generated_id}', ${curdate()}, '${conditions}', '${surgeries}', '${medications}');`
      console.log(psql_statement);
      db.query(psql_statement, function (error, results, fields) {
        if (error) throw error;
        else {
          let psql_statement = `INSERT INTO PatientsFillHistory (patient, history) 
          VALUES ` + `('${email}',${generated_id});`
          console.log(psql_statement);
          db.query(psql_statement, function (error, results, fields) {
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
  let params = req.query;
  let email = params.email;
  let password = params.password;
  let psql_statement = `SELECT * FROM Patient 
                       WHERE email='${email}' 
                       AND password='${password}';`;
  console.log(psql_statement);
  db.query(psql_statement, function (error, results, fields) {
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
  let statement = `SELECT * FROM Doctor WHERE email = '${email}';`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
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
                       VALUES ` + `('${email}', '${gender}', '${password}', '${name}');`
  console.log(psql_statement);
  db.query(psql_statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let psql_statement = `INSERT INTO DocsHaveSchedules (sched, doctor) 
                       VALUES ` + `(${schedule}, '${email}');`;
      console.log(psql_statement);
      db.query(psql_statement, function(error){
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
                       WHERE email='${email}' AND password='${password}';`
  console.log(psql_statement);
  db.query(psql_statement, function (error, results, fields) {
    if (error) {
      console.log("eror");
      return res.status(500).json({ failed: 'error ocurred' })
    }
    else {
      if (results.length === 0) {
      } else {
        var string = JSON.stringify(results);
        var json = JSON.parse(string);
        console.log(json)
        email_in_use = json.rows[0].email;
        password_in_use = json.rows[0].password;
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

//Generates ID for appointment
app.get('/genApptUID', (req, res) => {
  "called............"
  let statement = 'SELECT id FROM Appointment ORDER BY id DESC LIMIT 1;'
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(results)
      let generated_id = results.rows[0] ? results.rows[0].id + 1 : 1;
      return res.json({ id: `${generated_id}` });
    };
  });
});

//Schedules Appointment
app.get('/schedule', (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let doctor = params.doc;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10)
  let sql_date = `TO_DATE('${ndate}', '%YYYY-%mm-%dd')`;
  //sql to turn string to sql time obj
  let sql_start = `'${time}'`;
  //sql to turn string to sql time obj
  let sql_end = `'${endtime}'`;
  let sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
                 VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, 'NotDone');`
  console.log(sql_try);
  db.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
                 VALUES (${id}, '${doctor}', 'Not Yet Diagnosed' , 'Not Yet Diagnosed');`
      console.log(sql_try);
      db.query(sql_try, function (error, results, fields) {
        if (error) throw error;
        else{
          return res.json({
            data: results
          })
        }
      });
    }
  });
});

//To show appointments to doctor
app.get('/doctorViewAppt', (req, res) => {
  console.log("called doctorviewappt")
  let a = req.query;
  let email = a.email;
  let statement = `SELECT a.id,a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
  FROM Appointment a, PatientsAttendAppointments psa, Patient p
  WHERE a.id = psa.appt AND psa.patient = p.email
  AND a.id IN (SELECT appt FROM Diagnose WHERE doctor='${email_in_use}');`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Adds to PatientsAttendAppointment Table
app.get('/addToPatientSeeAppt', (req, res) => {
  let params = req.query;
  let email = params.email;
  let appt_id = params.id;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) 
                 VALUES ('${email}', ${appt_id}, '${concerns}', '${symptoms}');`
  console.log(sql_try);
  db.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else{
      return res.json({
        data: results
      })
    }
  });

});

//Resets Patient Password
app.post('/resetPasswordPatient', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `UPDATE Patient 
                   SET password = '${newPassword}' 
                   WHERE email = '${email}' 
                   AND password = '${oldPassword}';`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});
//Resets Doctor Password
app.post('/resetPasswordDoctor', (req, res) => {
  let something = req.query;
  let email = something.email;
  let oldPassword = "" + something.oldPassword;
  let newPassword = "" + something.newPassword;
  let statement = `UPDATE Doctor
                   SET password = '${newPassword}' 
                   WHERE email = '${email}' 
                   AND password = '${oldPassword}';`
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});
//Checks If a similar appointment exists to avoid a clash
app.get('/checkIfApptExists', (req, res) => {
  console.log("calledmsldkfj")
  let cond1, cond2, cond3 = ""
  let params = req.query;
  let email = params.email;
  let doc_email = params.docEmail;
  let startTime = params.startTime;
  let date = params.date;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10);
  console.log(date,ndate,'new....')
  let psql_date = `TO_DATE('${ndate}', '%YYYY-%mm-%dd')`;
  //psql to turn string to psql time obj
  let psql_start = `'${startTime}'`;
  let statement = `SELECT * FROM PatientsAttendAppointments, Appointment  
  WHERE patient = '${email}' AND
  appt = id AND
  date = ${psql_date} AND
  starttime = ${psql_start};`
  console.log(statement)
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      cond1 = results;
      console.log(results.rows,'results1........')
      statement=`SELECT * FROM Diagnose d INNER JOIN Appointment a 
      ON d.appt=a.id WHERE doctor='${doc_email}' AND date=${psql_date} AND status='NotDone' 
      AND ${psql_start} >= starttime AND ${psql_start} < endtime;`
      console.log(statement)
      db.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
          console.log(results.rows,'results2........')
          cond2 = results;
          statement = `SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules 
          INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id
          WHERE doctor='${doc_email}' AND 
          day=to_char(timestamp '${date}', 'Day') AND 
          ((${psql_start} + INTERVAL '1' HOUR) <= breaktime OR ${psql_start} >= (breaktime + INTERVAL '1' HOUR));`
          //not in doctor schedule
          console.log(statement)
          db.query(statement, function (error, results, fields) {
            if (error) throw error;
            else {
              if(!results.rows.length){
                results = []
              }
              else{
                results = [1]
              }
              // console.log('cond1....', cond1, 'cond2....', cond2,'result....', results)
              return res.json({
                data: cond1.rows.concat(cond2.rows,results)
              })
            };
          });
        };
      });
    };
  });
  //doctor has appointment at the same time - Your start time has to be greater than all prev end times
});
//Returns Date/Time of Appointment
app.get('/getDateTimeOfAppt', (req, res) => {
  let tmp = req.query;
  let id = tmp.id;
  let statement = `SELECT starttime as start, 
                          endtime as end, 
                          date as theDate 
                   FROM Appointment 
                   WHERE id = '${id}';`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({
        data: results
      })
    };
  });
});
//Patient Info Related

//to get all doctor names
app.get('/docInfo', (req, res) => {
  let statement = 'SELECT * FROM Doctor;';
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(results)
      return res.json({
        data: results
      })
    };
  });
});
//To return a particular patient history
app.get('/OneHistory', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT gender,name,email,address,conditions,surgeries,medication
                    FROM PatientsFillHistory,Patient,MedicalHistory
                    WHERE PatientsFillHistory.history=id
                    AND patient=email AND email = ${email};`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    }
  })
});
//To show all patients whose medical history can be accessed
app.get('/MedHistView', (req, res) => {
  let params = req.query;
  let patientName = "'%" + params.name + "%'";
  let secondParamTest = "" + params.variable;
  let statement = `SELECT name AS Name,
                    PatientsFillHistory.history AS ID,
                    email FROM Patient,PatientsFillHistory
                    WHERE Patient.email = PatientsFillHistory.patient
                    AND Patient.email IN (SELECT patient from PatientsAttendAppointments 
                    NATURAL JOIN Diagnose WHERE doctor='${email_in_use}')`
  if (patientName != "''")
    statement += " AND Patient.name LIKE " + patientName + ';'
  console.log(statement)
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});
// If 404, forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//Returns Appointment Info To patient logged In
app.get('/patientViewAppt', (req, res) => {
  let tmp = req.query;
  let email = tmp.email;
  let statement = `SELECT PatientsAttendAppointments.appt as ID,
                  PatientsAttendAppointments.patient as user, 
                  PatientsAttendAppointments.concerns as theConcerns, 
                  PatientsAttendAppointments.symptoms as theSymptoms, 
                  Appointment.date as theDate,
                  Appointment.starttime as theStart,
                  Appointment.endtime as theEnd,
                  Appointment.status as status
                  FROM PatientsAttendAppointments, Appointment
                  WHERE PatientsAttendAppointments.patient = '${email}' AND
                  PatientsAttendAppointments.appt = Appointment.id;`
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Checks if history exists
app.get('/checkIfHistory', (req, res) => {
    let params = req.query;
    let email = params.email;
    let statement = `SELECT patient FROM PatientsFillHistory WHERE patient = '${email}';`
    console.log(statement)
    db.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
            return res.json({
                data: results
            })
        };
    });
});


//To fill diagnoses
app.get('/diagnose', (req, res) => {
  let params = req.query;
  let id = params.id;
  let diagnosis = params.diagnosis;
  let prescription = params.prescription;
  let statement = `UPDATE Diagnose SET diagnosis='${diagnosis}', prescription='${prescription}' WHERE appt=${id};`;
  console.log(statement)
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let statement = `UPDATE Appointment SET status="Done" WHERE id=${id};`;
      console.log(statement)
      db.query(statement, function (error, results, fields){
        if (error) throw error;
      })
    };
  });
});

//To show diagnoses
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id};`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To show diagnoses to patient
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id};`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//To Show all diagnosed appointments till now
app.get('/allDiagnoses', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement =`SELECT date,doctor,concerns,symptoms,diagnosis,prescription FROM 
  Appointment A INNER JOIN (SELECT * from PatientsAttendAppointments NATURAL JOIN Diagnose 
  WHERE patient='${email}') AS B ON A.id = B.appt;`
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});


//To delete appointment
app.get('/deleteAppt', (req, res) => {
  let a = req.query;
  let uid = a.uid;
  let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
  console.log(statement);
  db.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      results = results[0].status
      if(results == "NotDone"){
        statement = `DELETE FROM Appointment WHERE id=${uid};`;
        console.log(statement);
        db.query(statement, function (error, results, fields) {
          if (error) throw error;
        });
      }
      else{
        if(who=="pat"){
          statement = `DELETE FROM PatientsAttendAppointments p WHERE p.appt = ${uid};`;
          console.log(statement);
          db.query(statement, function (error, results, fields) {
            if (error) throw error;
          });
        }
      }
    };
  });
  return;
});




module.exports = app;
