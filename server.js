1//import mongoose
const mongoose = require('mongoose');

//import express
const express = require('express');
//set up express app
const app = express();

//we need it for being able to use req.body??
const bodyParser = require('body-parser');

//enable all cors
var cors = require('cors');

app.use(cors({
    origin: ['http://10.11.12.58:8080'],
    credentials: true // enable set cookie
}));

app.use(bodyParser.json())

//for deploying on Heroku
app.use(express.static('dist'));


//connect to jobs collection in mongoDB
mongoose.connect('mongodb://ninja:moshiach516@ds111012.mlab.com:11012/job_db');


//define job object schema
var jobSchema = new mongoose.Schema({
    title: String,
    createdAt: String,
    location: String,
    company: String,
    description: String,
    jobTypeIcon: String,
    id: String
});
//create job data model
var Job = mongoose.model('Job', jobSchema);

//define employer object schema
var employerSchema = new mongoose.Schema({
    name: String,
    company: String,
    rating: Number,
    phone: String,
    email: String,
    about: String,
    offeredJobs: Array,
    image: String,
    password: String,
    applicants: Array,
    id: String
});
//create employer data model
var Employer = mongoose.model('Employer', employerSchema);


//HANDLE JOBS DB REQUESTS

app.get('/jobs', (req, res) => {
    Job.find({}, (err, data) => {
        if (err) throw err;
        res.send(data);
    })
});

app.post('/jobs', (req, res) => {
    Job(req.body).save(function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

app.delete('/jobs', (req, res) => {
    Job.deleteOne({ id: req.query.id }, function (err, data) {
        if (err) {
            throw err;
        }
        res.json(data);
    });
});

//HANDLE EMPLOYERS DB REQUESTS
app.get('/employers', (req, res) => {
    Employer.find({}, (err, data) => {
        if (err) throw err;
        res.send(data);
    })
});

app.post('/employers', (req, res) => {
    Employer(req.body).save(function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

app.delete('/employers', (req, res) => {

    Employer.deleteOne({ id: req.query.id }, function (err, data) {
        if (err) {
            throw err;
        }
        res.json(data);
    });
});



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Page builder app listening on port ${PORT}!`)

});




