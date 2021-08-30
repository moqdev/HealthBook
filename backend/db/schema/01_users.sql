

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