///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();

// pull PORT from .env, give default value of 4000
const { PORT = 4000, DATABASE_URL} = process.env;

// import express, mongoose
const express = require("express");
const mongoose = require('mongoose');

// Mongoose Connection
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;

// DB Check
db.on('connected', () => {console.log('Connected')});
db.on('disconnect', () => {console.log('disconnected')});
db.on('error', (err)=> {console.log('an error occured' + err.message)});


// create application object
const app = express();

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
    res.send("hello world");
});

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT || 4000, () => console.log(`listening on PORT ${PORT}`));