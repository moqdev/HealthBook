DROP TABLE IF EXISTS Patient CASCADE;
CREATE TABLE Patient(
email varchar(50) PRIMARY KEY NOT NULL,
password varchar(30) NOT NULL,
name varchar(50) NOT NULL,
address varchar(60) NOT NULL,
gender VARCHAR(20) NOT NULL
);

DROP TABLE IF EXISTS MedicalHistory CASCADE;
CREATE TABLE MedicalHistory(
id SERIAL PRIMARY KEY NOT NULL,
date DATE NOT NULL,
conditions VARCHAR(100) NOT NULL, 
surgeries VARCHAR(100) NOT NULL, 
medication VARCHAR(100) NOT NULL
);

DROP TABLE IF EXISTS Doctor CASCADE;
CREATE TABLE Doctor(
email varchar(50) PRIMARY KEY,
gender varchar(20) NOT NULL,
password varchar(30) NOT NULL,
name varchar(50) NOT NULL
);

DROP TABLE IF EXISTS Appointment CASCADE;
CREATE TABLE Appointment(
id int PRIMARY KEY,
date DATE NOT NULL,
starttime TIME NOT NULL,
endtime TIME NOT NULL,
status varchar(15) NOT NULL
);

DROP TABLE IF EXISTS PatientsAttendAppointments CASCADE;
CREATE TABLE PatientsAttendAppointments(
patient varchar(50) NOT NULL,
appt int NOT NULL,
concerns varchar(40) NOT NULL,
symptoms varchar(40) NOT NULL,
FOREIGN KEY (patient) REFERENCES Patient (email) ON DELETE CASCADE,
FOREIGN KEY (appt) REFERENCES Appointment (id) ON DELETE CASCADE,
PRIMARY KEY (patient, appt)
);

DROP TABLE IF EXISTS Schedule CASCADE;
CREATE TABLE Schedule(
id int NOT NULL UNIQUE,
starttime TIME NOT NULL, 
endtime TIME NOT NULL,
breaktime TIME NOT NULL,
day varchar(20) NOT NULL,
PRIMARY KEY (id, starttime, endtime, breaktime, day)

);

DROP TABLE IF EXISTS PatientsFillHistory CASCADE;
CREATE TABLE PatientsFillHistory(
patient varchar(50) NOT NULL,
history int NOT NULL,
FOREIGN KEY (patient) REFERENCES Patient (email) ON DELETE CASCADE,
FOREIGN KEY (history) REFERENCES MedicalHistory (id) ON DELETE CASCADE,
PRIMARY KEY (history)
);

DROP TABLE IF EXISTS Diagnose CASCADE;
CREATE TABLE Diagnose(
appt int NOT NULL,
doctor varchar(50) NOT NULL,
diagnosis varchar(40) NOT NULL,
prescription varchar(50) NOT NULL,
FOREIGN KEY (appt) REFERENCES Appointment (id) ON DELETE CASCADE,
FOREIGN KEY (doctor) REFERENCES Doctor (email) ON DELETE CASCADE,
PRIMARY KEY (appt, doctor)
);

DROP TABLE IF EXISTS DocsHaveSchedules CASCADE;
CREATE TABLE DocsHaveSchedules(
sched int NOT NULL,
doctor varchar(50) NOT NULL,
FOREIGN KEY (sched) REFERENCES Schedule (id) ON DELETE CASCADE,
FOREIGN KEY (doctor) REFERENCES Doctor (email) ON DELETE CASCADE,
PRIMARY KEY (sched, doctor)
);

DROP TABLE IF EXISTS DoctorViewsHistory CASCADE;
CREATE TABLE DoctorViewsHistory(
history int NOT NULL,
doctor varchar(50) NOT NULL,
FOREIGN KEY (doctor) REFERENCES Doctor (email) ON DELETE CASCADE,
FOREIGN KEY (history) REFERENCES MedicalHistory (id) ON DELETE CASCADE,
PRIMARY KEY (history, doctor)
);