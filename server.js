require('dotenv/config')

//setting up email
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_EMAIL_PASSWORD
    }
});

//import mongoose
const mongoose = require('mongoose');

//import express
const express = require('express');
//set up express 
const app = express();

//we need it for being able to use req.body??
const bodyParser = require('body-parser');

//enable all cors
var cors = require('cors');

app.use(cors({
    origin: ['http://localhost:8080/', 'http://10.11.12.58:8080', 'http://192.168.0.241:8080/'],
    credentials: true // enable set cookie
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(bodyParser.json())

//Serve the dist folder (with the Vue content)
app.use(express.static('dist'));


//connect to jobs collection in mongoDB
mongoose.connect(process.env.MONGODB_URI);


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
    id: String,
    isNowCreated: Boolean
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
    if (req.body.isNowCreated) {
        var mailOptions = {
            from: 'ridinleo@gmail.com',
            to: 'ridinleo@gmail.com',
            subject: 'Notification From TempJob!',
            text: 'Your account was created successfully!'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
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
    console.log(`Listening on port ${PORT}...`)
    
});




